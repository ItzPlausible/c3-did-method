/**
 * CoCoA MVP - Auctions (VAM) Handler
 * List, view, and bid on Vickrey Auction Mechanism auctions
 */

import { Env, APIResponse } from '../types';
import { getSession } from './auth';
import { listAuctions, getAuction, createBid, getAuctionBids, getBalance, updateBalance, settleAuction } from '../db/queries';

export async function handleAuctions(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  // GET /api/auctions - List all auctions
  if (path === '' || path === '/') {
    if (method === 'GET') return handleListAuctions(request, env);
  }

  // GET /api/auctions/:id - Get specific auction
  const auctionMatch = path.match(/^\/([A-Z0-9-]+)$/);
  if (auctionMatch && method === 'GET') {
    return handleGetAuction(request, env, auctionMatch[1]);
  }

  // POST /api/auctions/:id/bid - Place a bid
  const bidMatch = path.match(/^\/([A-Z0-9-]+)\/bid$/);
  if (bidMatch && method === 'POST') {
    return handlePlaceBid(request, env, bidMatch[1]);
  }

  // POST /api/auctions/:id/settle - Settle auction (admin)
  const settleMatch = path.match(/^\/([A-Z0-9-]+)\/settle$/);
  if (settleMatch && method === 'POST') {
    return handleSettleAuction(request, env, settleMatch[1]);
  }

  return jsonResponse({ success: false, error: 'Unknown auctions endpoint' }, 404);
}

async function handleListAuctions(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;

    const auctions = await listAuctions(env, status);

    // Calculate time remaining for open auctions
    const auctionsWithTimeLeft = auctions.map(auction => {
      if (auction.status === 'open') {
        const endTime = new Date(auction.end_time).getTime();
        const now = Date.now();
        const timeLeftMs = Math.max(0, endTime - now);
        const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
          ...auction,
          time_remaining: {
            hours: hoursLeft,
            minutes: minutesLeft,
            is_ending_soon: hoursLeft < 24,
          },
        };
      }
      return auction;
    });

    return jsonResponse({
      success: true,
      data: {
        auctions: auctionsWithTimeLeft,
        count: auctions.length,
      },
    });
  } catch (error) {
    console.error('List auctions error:', error);
    return jsonResponse({ success: false, error: 'Failed to list auctions' }, 500);
  }
}

async function handleGetAuction(request: Request, env: Env, auctionId: string): Promise<Response> {
  try {
    const auction = await getAuction(env, auctionId);

    if (!auction) {
      return jsonResponse({ success: false, error: 'Auction not found' }, 404);
    }

    // Get bid count (not amounts - sealed bids!)
    const bids = await getAuctionBids(env, auctionId);

    return jsonResponse({
      success: true,
      data: {
        ...auction,
        bid_count: bids.length,
        // Don't expose bid amounts until settled
      },
    });
  } catch (error) {
    console.error('Get auction error:', error);
    return jsonResponse({ success: false, error: 'Failed to get auction' }, 500);
  }
}

async function handlePlaceBid(request: Request, env: Env, auctionId: string): Promise<Response> {
  try {
    // Verify session
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    // Get auction details
    const auction = await getAuction(env, auctionId);
    if (!auction) {
      return jsonResponse({ success: false, error: 'Auction not found' }, 404);
    }

    if (auction.status !== 'open') {
      return jsonResponse({ success: false, error: 'Auction is not open for bidding' }, 400);
    }

    // Check if auction has ended
    const endTime = new Date(auction.end_time).getTime();
    if (Date.now() > endTime) {
      return jsonResponse({ success: false, error: 'Auction has ended' }, 400);
    }

    // Parse bid amount
    const body = await request.json() as { amount: number };
    const bidAmount = body.amount;

    if (!bidAmount || bidAmount < auction.reserve_price) {
      return jsonResponse({
        success: false,
        error: `Bid must be at least ${auction.reserve_price} COMM (reserve price)`,
      }, 400);
    }

    // Check member's COMM balance
    const commBalance = await getBalance(env, session.seid, 'COMM');
    if (commBalance < bidAmount) {
      return jsonResponse({
        success: false,
        error: `Insufficient COMM balance. You have ${commBalance}, need ${bidAmount}`,
      }, 400);
    }

    // Check for existing bid from this member
    const existingBids = await getAuctionBids(env, auctionId);
    const existingBid = existingBids.find(b => b.seid === session.seid);
    if (existingBid) {
      return jsonResponse({
        success: false,
        error: 'You have already placed a bid on this auction. VAM allows one sealed bid per member.',
      }, 400);
    }

    // Lock bid amount (deduct from balance, will be returned if not winning)
    await updateBalance(env, session.seid, 'COMM', -bidAmount);

    // Create sealed bid
    const bid = await createBid(env, auctionId, session.seid, bidAmount);

    return jsonResponse({
      success: true,
      data: {
        bid_id: bid.id,
        auction_id: auctionId,
        amount_locked: bidAmount,
        new_comm_balance: commBalance - bidAmount,
      },
      message: `Sealed bid of ${bidAmount} COMM placed on "${auction.asset_name}". Your COMM has been locked until auction settlement.`,
    });

  } catch (error) {
    console.error('Place bid error:', error);
    return jsonResponse({ success: false, error: 'Failed to place bid' }, 500);
  }
}

async function handleSettleAuction(request: Request, env: Env, auctionId: string): Promise<Response> {
  try {
    // In production, this would be restricted to admin or automated
    const session = await getSession(request, env);
    if (!session) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const auction = await getAuction(env, auctionId);
    if (!auction) {
      return jsonResponse({ success: false, error: 'Auction not found' }, 404);
    }

    if (auction.status !== 'open') {
      return jsonResponse({ success: false, error: 'Auction is not open' }, 400);
    }

    // Settle using Vickrey rules
    const settledAuction = await settleAuction(env, auctionId);

    // Return locked COMM to non-winners
    const bids = await getAuctionBids(env, auctionId);
    for (const bid of bids) {
      if (!bid.is_winning) {
        // Refund non-winning bid
        await updateBalance(env, bid.seid, 'COMM', bid.amount);
      } else if (settledAuction.second_bid) {
        // Winner pays B2, refund the difference
        const refund = bid.amount - settledAuction.second_bid;
        if (refund > 0) {
          await updateBalance(env, bid.seid, 'COMM', refund);
        }
      }
    }

    return jsonResponse({
      success: true,
      data: {
        auction: settledAuction,
        vam_result: {
          winner_seid: settledAuction.winner_seid,
          winning_bid: settledAuction.winning_bid,
          price_paid: settledAuction.second_bid,
          delta_to_commons: settledAuction.delta_captured,
        },
      },
      message: settledAuction.winner_seid
        ? `Auction settled! Winner pays ${settledAuction.second_bid} COMM. Delta of ${settledAuction.delta_captured} COMM captured for Commons treasury.`
        : 'Auction cancelled - no bids received.',
    });

  } catch (error) {
    console.error('Settle auction error:', error);
    return jsonResponse({ success: false, error: 'Failed to settle auction' }, 500);
  }
}

function jsonResponse(data: APIResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
