/**
 * CoCoA MVP - IOs (Intent Opportunities) Handler
 * List, view, and contribute to Intent Opportunities
 */

import { Env, APIResponse, Faction } from '../types';
import { getSession } from './auth';
import { listIOs, getIO, createIOContribution, getMemberFEIDs, hasFEID, createFEID, getBalance, updateBalance } from '../db/queries';

export async function handleIOs(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  // GET /api/ios - List all IOs
  if (path === '' || path === '/') {
    if (method === 'GET') return handleListIOs(request, env);
  }

  // GET /api/ios/:id - Get specific IO
  const ioMatch = path.match(/^\/([A-Z0-9-]+)$/);
  if (ioMatch && method === 'GET') {
    return handleGetIO(request, env, ioMatch[1]);
  }

  // POST /api/ios/:id/contribute - Contribute to an IO
  const contributeMatch = path.match(/^\/([A-Z0-9-]+)\/contribute$/);
  if (contributeMatch && method === 'POST') {
    return handleContribute(request, env, contributeMatch[1]);
  }

  return jsonResponse({ success: false, error: 'Unknown IOs endpoint' }, 404);
}

async function handleListIOs(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const faction = url.searchParams.get('faction') as Faction | undefined;

    const ios = await listIOs(env, status, faction);

    return jsonResponse({
      success: true,
      data: {
        ios,
        count: ios.length,
      },
    });
  } catch (error) {
    console.error('List IOs error:', error);
    return jsonResponse({ success: false, error: 'Failed to list IOs' }, 500);
  }
}

async function handleGetIO(request: Request, env: Env, ioId: string): Promise<Response> {
  try {
    const io = await getIO(env, ioId);

    if (!io) {
      return jsonResponse({ success: false, error: 'IO not found' }, 404);
    }

    return jsonResponse({
      success: true,
      data: io,
    });
  } catch (error) {
    console.error('Get IO error:', error);
    return jsonResponse({ success: false, error: 'Failed to get IO' }, 500);
  }
}

async function handleContribute(request: Request, env: Env, ioId: string): Promise<Response> {
  try {
    // Verify session
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    // Get IO details
    const io = await getIO(env, ioId);
    if (!io) {
      return jsonResponse({ success: false, error: 'IO not found' }, 404);
    }

    if (io.status !== 'open') {
      return jsonResponse({ success: false, error: 'IO is not open for contributions' }, 400);
    }

    // Parse stake amount
    const body = await request.json() as { stake_amount: number };
    const stakeAmount = body.stake_amount;

    if (!stakeAmount || stakeAmount < io.min_stake) {
      return jsonResponse({
        success: false,
        error: `Minimum stake is ${io.min_stake} COMM`,
      }, 400);
    }

    // Check member's COMM balance
    const commBalance = await getBalance(env, session.seid, 'COMM');
    if (commBalance < stakeAmount) {
      return jsonResponse({
        success: false,
        error: `Insufficient COMM balance. You have ${commBalance}, need ${stakeAmount}`,
      }, 400);
    }

    // Check/create FEID for required faction
    const requiredFaction = io.required_faction as Faction;
    let memberFEIDs = await getMemberFEIDs(env, session.seid);
    let feid = memberFEIDs.find(f => f.faction === requiredFaction);

    if (!feid) {
      // First contribution to this faction - mint FEID (SBT)
      // In production, this would trigger on-chain minting
      const feidTokenId = `FEID-${requiredFaction.toUpperCase()}-${session.seid}-${Date.now()}`;
      feid = await createFEID(env, session.seid, requiredFaction, feidTokenId);
    }

    // Deduct stake from COMM balance
    await updateBalance(env, session.seid, 'COMM', -stakeAmount);

    // Create contribution record
    const contribution = await createIOContribution(env, ioId, session.seid, feid.id, stakeAmount);

    return jsonResponse({
      success: true,
      data: {
        contribution,
        feid_created: !memberFEIDs.find(f => f.faction === requiredFaction),
        new_comm_balance: commBalance - stakeAmount,
      },
      message: `Successfully staked ${stakeAmount} COMM to "${io.title}". Pending approval.`,
    });

  } catch (error) {
    console.error('Contribute error:', error);
    return jsonResponse({ success: false, error: 'Failed to process contribution' }, 500);
  }
}

function jsonResponse(data: APIResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
