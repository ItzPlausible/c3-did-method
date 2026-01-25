/**
 * CoCoA MVP - Member Handler
 * Member profile, balances, FEIDs, and activity
 */

import { Env, APIResponse, FACTION_MAP } from '../types';
import { getSession } from './auth';
import { getMemberBySEID, getBalances, getMemberFEIDs, getMemberContributions, getMemberBids } from '../db/queries';

export async function handleMember(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  // GET /api/member - Get current member profile
  if ((path === '' || path === '/') && method === 'GET') {
    return handleGetProfile(request, env);
  }

  // GET /api/member/status - Get full status (balances, FEIDs, activity)
  if (path === '/status' && method === 'GET') {
    return handleGetStatus(request, env);
  }

  // GET /api/member/balances - Get token balances
  if (path === '/balances' && method === 'GET') {
    return handleGetBalances(request, env);
  }

  // GET /api/member/feids - Get FEIDs
  if (path === '/feids' && method === 'GET') {
    return handleGetFEIDs(request, env);
  }

  // GET /api/member/contributions - Get IO contributions
  if (path === '/contributions' && method === 'GET') {
    return handleGetContributions(request, env);
  }

  // GET /api/member/bids - Get auction bids
  if (path === '/bids' && method === 'GET') {
    return handleGetBids(request, env);
  }

  return jsonResponse({ success: false, error: 'Unknown member endpoint' }, 404);
}

async function handleGetProfile(request: Request, env: Env): Promise<Response> {
  try {
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const member = await getMemberBySEID(env, session.seid);
    if (!member) {
      return jsonResponse({ success: false, error: 'Member not found' }, 404);
    }

    return jsonResponse({
      success: true,
      data: {
        seid: member.seid,
        wallet_address: member.wallet_address,
        display_name: member.display_name,
        created_at: member.created_at,
        last_active: member.last_active,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return jsonResponse({ success: false, error: 'Failed to get profile' }, 500);
  }
}

async function handleGetStatus(request: Request, env: Env): Promise<Response> {
  try {
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const seid = session.seid;

    // Get member profile
    const member = await getMemberBySEID(env, seid);
    if (!member) {
      return jsonResponse({ success: false, error: 'Member not found' }, 404);
    }

    // Get all data in parallel
    const [balances, feids, contributions, bids] = await Promise.all([
      getBalances(env, seid),
      getMemberFEIDs(env, seid),
      getMemberContributions(env, seid),
      getMemberBids(env, seid),
    ]);

    // Format balances as object
    const balanceMap: Record<string, number> = {};
    for (const b of balances) {
      balanceMap[b.token_type] = b.amount;
    }

    // Format FEIDs with faction info
    const feidInfo = feids.map(f => ({
      faction: f.faction,
      role: FACTION_MAP[f.faction].role,
      token: FACTION_MAP[f.faction].token,
      earned_at: f.earned_at,
    }));

    // Determine active factions
    const activeFactions = feids.map(f => f.faction);
    const availableFactions = (['syndicate', 'guild', 'union'] as const).filter(
      f => !activeFactions.includes(f)
    );

    return jsonResponse({
      success: true,
      data: {
        member: {
          seid: member.seid,
          display_name: member.display_name,
          wallet_address: member.wallet_address,
          member_since: member.created_at,
        },
        balances: {
          COMM: balanceMap['COMM'] || 0,
          PMT: balanceMap['PMT'] || 0,
          PCT: balanceMap['PCT'] || 0,
          PDT: balanceMap['PDT'] || 0,
          JLZ: balanceMap['JLZ'] || 0,
          XPT: balanceMap['XPT'] || 0,
        },
        identity: {
          feids: feidInfo,
          active_factions: activeFactions,
          available_factions: availableFactions,
        },
        activity: {
          total_contributions: contributions.length,
          pending_contributions: contributions.filter(c => c.status === 'pending').length,
          completed_contributions: contributions.filter(c => c.status === 'completed').length,
          total_bids: bids.length,
          winning_bids: bids.filter(b => b.is_winning).length,
        },
      },
    });
  } catch (error) {
    console.error('Get status error:', error);
    return jsonResponse({ success: false, error: 'Failed to get status' }, 500);
  }
}

async function handleGetBalances(request: Request, env: Env): Promise<Response> {
  try {
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const balances = await getBalances(env, session.seid);
    
    const balanceMap: Record<string, number> = {
      COMM: 0,
      PMT: 0,
      PCT: 0,
      PDT: 0,
      JLZ: 0,
      XPT: 0,
    };
    
    for (const b of balances) {
      balanceMap[b.token_type] = b.amount;
    }

    return jsonResponse({
      success: true,
      data: balanceMap,
    });
  } catch (error) {
    console.error('Get balances error:', error);
    return jsonResponse({ success: false, error: 'Failed to get balances' }, 500);
  }
}

async function handleGetFEIDs(request: Request, env: Env): Promise<Response> {
  try {
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const feids = await getMemberFEIDs(env, session.seid);

    const feidInfo = feids.map(f => ({
      id: f.id,
      faction: f.faction,
      role: FACTION_MAP[f.faction].role,
      patronage_token: FACTION_MAP[f.faction].token,
      feid_token_id: f.feid_token_id,
      earned_at: f.earned_at,
    }));

    return jsonResponse({
      success: true,
      data: {
        feids: feidInfo,
        count: feids.length,
      },
    });
  } catch (error) {
    console.error('Get FEIDs error:', error);
    return jsonResponse({ success: false, error: 'Failed to get FEIDs' }, 500);
  }
}

async function handleGetContributions(request: Request, env: Env): Promise<Response> {
  try {
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const contributions = await getMemberContributions(env, session.seid);

    return jsonResponse({
      success: true,
      data: {
        contributions,
        count: contributions.length,
      },
    });
  } catch (error) {
    console.error('Get contributions error:', error);
    return jsonResponse({ success: false, error: 'Failed to get contributions' }, 500);
  }
}

async function handleGetBids(request: Request, env: Env): Promise<Response> {
  try {
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    }

    const bids = await getMemberBids(env, session.seid);

    return jsonResponse({
      success: true,
      data: {
        bids,
        count: bids.length,
      },
    });
  } catch (error) {
    console.error('Get bids error:', error);
    return jsonResponse({ success: false, error: 'Failed to get bids' }, 500);
  }
}

function jsonResponse(data: APIResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
