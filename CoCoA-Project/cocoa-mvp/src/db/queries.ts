/**
 * CoCoA MVP - Database Queries
 * D1 database operations for members, IOs, auctions, and balances
 */

import { Env, Member, MemberFEID, Balance, IO, IOContribution, Auction, Bid, Faction, PatronageToken } from '../types';

// === Member Operations ===

export async function getMemberBySEID(env: Env, seid: string): Promise<Member | null> {
  const result = await env.DB.prepare('SELECT * FROM members WHERE seid = ?').bind(seid).first<Member>();
  return result || null;
}

export async function getMemberByWallet(env: Env, walletAddress: string): Promise<Member | null> {
  const result = await env.DB.prepare('SELECT * FROM members WHERE wallet_address = ?')
    .bind(walletAddress)
    .first<Member>();
  return result || null;
}

export async function createMember(env: Env, seid: string, walletAddress: string, displayName?: string): Promise<Member> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO members (seid, wallet_address, display_name, created_at, last_active) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(seid, walletAddress, displayName || null, now, now)
    .run();
  
  return {
    seid,
    wallet_address: walletAddress,
    display_name: displayName || null,
    created_at: now,
    last_active: now,
  };
}

export async function updateMemberActivity(env: Env, seid: string): Promise<void> {
  await env.DB.prepare('UPDATE members SET last_active = ? WHERE seid = ?')
    .bind(new Date().toISOString(), seid)
    .run();
}

// === FEID Operations ===

export async function getMemberFEIDs(env: Env, seid: string): Promise<MemberFEID[]> {
  const result = await env.DB.prepare('SELECT * FROM member_feids WHERE seid = ?').bind(seid).all<MemberFEID>();
  return result.results || [];
}

export async function hasFEID(env: Env, seid: string, faction: Faction): Promise<boolean> {
  const result = await env.DB.prepare('SELECT id FROM member_feids WHERE seid = ? AND faction = ?')
    .bind(seid, faction)
    .first();
  return !!result;
}

export async function createFEID(env: Env, seid: string, faction: Faction, feidTokenId: string): Promise<MemberFEID> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    'INSERT INTO member_feids (seid, faction, feid_token_id, earned_at) VALUES (?, ?, ?, ?) RETURNING *'
  )
    .bind(seid, faction, feidTokenId, now)
    .first<MemberFEID>();
  
  if (!result) throw new Error('Failed to create FEID');
  return result;
}

// === Balance Operations ===

export async function getBalances(env: Env, seid: string): Promise<Balance[]> {
  const result = await env.DB.prepare('SELECT * FROM balances WHERE seid = ?').bind(seid).all<Balance>();
  return result.results || [];
}

export async function getBalance(env: Env, seid: string, tokenType: string): Promise<number> {
  const result = await env.DB.prepare('SELECT amount FROM balances WHERE seid = ? AND token_type = ?')
    .bind(seid, tokenType)
    .first<{ amount: number }>();
  return result?.amount || 0;
}

export async function updateBalance(env: Env, seid: string, tokenType: string, delta: number): Promise<number> {
  const now = new Date().toISOString();
  const current = await getBalance(env, seid, tokenType);
  const newAmount = current + delta;
  
  if (newAmount < 0) throw new Error('Insufficient balance');
  
  if (current === 0 && delta > 0) {
    // Insert new balance record
    await env.DB.prepare(
      'INSERT INTO balances (seid, token_type, amount, updated_at) VALUES (?, ?, ?, ?)'
    )
      .bind(seid, tokenType, newAmount, now)
      .run();
  } else {
    // Update existing
    await env.DB.prepare(
      'UPDATE balances SET amount = ?, updated_at = ? WHERE seid = ? AND token_type = ?'
    )
      .bind(newAmount, now, seid, tokenType)
      .run();
  }
  
  return newAmount;
}

// === IO Operations ===

export async function listIOs(env: Env, status?: string, faction?: Faction): Promise<IO[]> {
  let query = 'SELECT * FROM ios WHERE 1=1';
  const params: string[] = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (faction) {
    query += ' AND required_faction = ?';
    params.push(faction);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const stmt = env.DB.prepare(query);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const result = await bound.all<IO>();
  return result.results || [];
}

export async function getIO(env: Env, ioId: string): Promise<IO | null> {
  const result = await env.DB.prepare('SELECT * FROM ios WHERE id = ?').bind(ioId).first<IO>();
  return result || null;
}

export async function createIOContribution(
  env: Env,
  ioId: string,
  seid: string,
  feidId: number,
  stakeAmount: number
): Promise<IOContribution> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `INSERT INTO io_contributions (io_id, seid, feid_id, stake_amount, status, submitted_at) 
     VALUES (?, ?, ?, ?, 'pending', ?) RETURNING *`
  )
    .bind(ioId, seid, feidId, stakeAmount, now)
    .first<IOContribution>();
  
  if (!result) throw new Error('Failed to create contribution');
  return result;
}

export async function getMemberContributions(env: Env, seid: string): Promise<IOContribution[]> {
  const result = await env.DB.prepare('SELECT * FROM io_contributions WHERE seid = ? ORDER BY submitted_at DESC')
    .bind(seid)
    .all<IOContribution>();
  return result.results || [];
}

// === Auction Operations ===

export async function listAuctions(env: Env, status?: string): Promise<Auction[]> {
  let query = 'SELECT * FROM auctions';
  if (status) {
    query += ' WHERE status = ?';
    const result = await env.DB.prepare(query).bind(status).all<Auction>();
    return result.results || [];
  }
  const result = await env.DB.prepare(query + ' ORDER BY end_time ASC').all<Auction>();
  return result.results || [];
}

export async function getAuction(env: Env, auctionId: string): Promise<Auction | null> {
  const result = await env.DB.prepare('SELECT * FROM auctions WHERE id = ?').bind(auctionId).first<Auction>();
  return result || null;
}

export async function createBid(env: Env, auctionId: string, seid: string, amount: number): Promise<Bid> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `INSERT INTO bids (auction_id, seid, amount, submitted_at, is_winning) 
     VALUES (?, ?, ?, ?, false) RETURNING *`
  )
    .bind(auctionId, seid, amount, now)
    .first<Bid>();
  
  if (!result) throw new Error('Failed to create bid');
  return result;
}

export async function getAuctionBids(env: Env, auctionId: string): Promise<Bid[]> {
  const result = await env.DB.prepare('SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC')
    .bind(auctionId)
    .all<Bid>();
  return result.results || [];
}

export async function getMemberBids(env: Env, seid: string): Promise<Bid[]> {
  const result = await env.DB.prepare('SELECT * FROM bids WHERE seid = ? ORDER BY submitted_at DESC')
    .bind(seid)
    .all<Bid>();
  return result.results || [];
}

// === VAM Settlement ===

export async function settleAuction(env: Env, auctionId: string): Promise<Auction> {
  const bids = await getAuctionBids(env, auctionId);
  
  if (bids.length === 0) {
    // No bids - cancel auction
    await env.DB.prepare("UPDATE auctions SET status = 'cancelled' WHERE id = ?").bind(auctionId).run();
    const auction = await getAuction(env, auctionId);
    if (!auction) throw new Error('Auction not found');
    return auction;
  }
  
  // Sort by amount descending (should already be sorted)
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBid = sortedBids[0];
  const secondBid = sortedBids[1]?.amount || winningBid.amount;
  const delta = winningBid.amount - secondBid;
  
  // Update auction with winner
  await env.DB.prepare(
    `UPDATE auctions 
     SET status = 'settled', winner_seid = ?, winning_bid = ?, second_bid = ?, delta_captured = ? 
     WHERE id = ?`
  )
    .bind(winningBid.seid, winningBid.amount, secondBid, delta, auctionId)
    .run();
  
  // Mark winning bid
  await env.DB.prepare('UPDATE bids SET is_winning = true WHERE id = ?').bind(winningBid.id).run();
  
  const auction = await getAuction(env, auctionId);
  if (!auction) throw new Error('Auction not found after settlement');
  return auction;
}
