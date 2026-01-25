/**
 * CoCoA MVP - Auth Handler
 * Handles wallet connection, session management, and onboarding
 */

import { Env, APIResponse, Session, Member } from '../types';
import { getMemberByWallet, createMember, updateMemberActivity } from '../db/queries';

// Generate a unique session ID
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Generate a SEID for new members
function generateSEID(): string {
  return `SEID-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function handleAuth(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  // POST /api/auth/connect - Connect wallet and create/retrieve session
  if (path === '/connect' && method === 'POST') {
    return handleConnect(request, env);
  }

  // GET /api/auth/session - Get current session
  if (path === '/session' && method === 'GET') {
    return handleGetSession(request, env);
  }

  // POST /api/auth/disconnect - End session
  if (path === '/disconnect' && method === 'POST') {
    return handleDisconnect(request, env);
  }

  return jsonResponse({ success: false, error: 'Unknown auth endpoint' }, 404);
}

async function handleConnect(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { wallet_address: string; display_name?: string };
    
    if (!body.wallet_address) {
      return jsonResponse({ success: false, error: 'wallet_address is required' }, 400);
    }

    const walletAddress = body.wallet_address;
    
    // Check if member exists
    let member = await getMemberByWallet(env, walletAddress);
    let isNewMember = false;
    
    if (!member) {
      // New member - create SEID and member record
      const seid = generateSEID();
      member = await createMember(env, seid, walletAddress, body.display_name);
      isNewMember = true;
    } else {
      // Existing member - update activity
      await updateMemberActivity(env, member.seid);
    }
    
    // Create session
    const sessionId = generateSessionId();
    const session: Session = {
      id: sessionId,
      seid: member.seid,
      wallet_address: walletAddress,
      messages: [],
      context: {},
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    
    // Store session in KV (24h TTL)
    await env.KV.put(`session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 86400, // 24 hours
    });
    
    return jsonResponse({
      success: true,
      data: {
        session_id: sessionId,
        seid: member.seid,
        is_new_member: isNewMember,
        member: {
          seid: member.seid,
          display_name: member.display_name,
          created_at: member.created_at,
        },
      },
      message: isNewMember
        ? `Welcome to C3 Alliance! Your Sovereign Entity ID is ${member.seid}. You start as a Syndicate Promoter.`
        : `Welcome back! Connected as ${member.display_name || member.seid}.`,
    });
  } catch (error) {
    console.error('Connect error:', error);
    return jsonResponse({ success: false, error: 'Failed to connect wallet' }, 500);
  }
}

async function handleGetSession(request: Request, env: Env): Promise<Response> {
  const sessionId = request.headers.get('X-Session-ID');
  
  if (!sessionId) {
    return jsonResponse({ success: false, error: 'No session ID provided' }, 401);
  }
  
  const sessionData = await env.KV.get(`session:${sessionId}`);
  
  if (!sessionData) {
    return jsonResponse({ success: false, error: 'Session not found or expired' }, 404);
  }
  
  const session = JSON.parse(sessionData) as Session;
  
  return jsonResponse({
    success: true,
    data: {
      session_id: session.id,
      seid: session.seid,
      wallet_address: session.wallet_address,
      message_count: session.messages.length,
      created_at: session.created_at,
    },
  });
}

async function handleDisconnect(request: Request, env: Env): Promise<Response> {
  const sessionId = request.headers.get('X-Session-ID');
  
  if (!sessionId) {
    return jsonResponse({ success: false, error: 'No session ID provided' }, 401);
  }
  
  // Delete session from KV
  await env.KV.delete(`session:${sessionId}`);
  
  return jsonResponse({
    success: true,
    message: 'Session ended successfully',
  });
}

// Helper function for JSON responses
function jsonResponse(data: APIResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Export session helper for other handlers
export async function getSession(request: Request, env: Env): Promise<Session | null> {
  const sessionId = request.headers.get('X-Session-ID');
  if (!sessionId) return null;
  
  const sessionData = await env.KV.get(`session:${sessionId}`);
  if (!sessionData) return null;
  
  return JSON.parse(sessionData) as Session;
}

export async function updateSession(env: Env, session: Session): Promise<void> {
  session.updated_at = Date.now();
  await env.KV.put(`session:${session.id}`, JSON.stringify(session), {
    expirationTtl: 86400,
  });
}
