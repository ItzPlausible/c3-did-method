/**
 * CoCoA MVP - API Router
 * Routes requests to appropriate handlers
 */

import { Env, APIResponse } from './types';
import { handleAuth } from './handlers/auth';
import { handleChat } from './handlers/chat';
import { handleIOs } from './handlers/ios';
import { handleAuctions } from './handlers/auctions';
import { handleMember } from './handlers/member';
import { checkBlockfrostConnection, getOnChainBalance, getWalletUTXOs } from './services/cardano';

export class Router {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Health check
    if (path === '/api/health') {
      return this.json({ success: true, data: { status: 'healthy', timestamp: Date.now() } });
    }

    // Route to handlers
    try {
      // Auth routes: /api/auth/*
      if (path.startsWith('/api/auth')) {
        return await handleAuth(request, this.env, path.replace('/api/auth', ''));
      }

      // Chat routes: /api/chat
      if (path.startsWith('/api/chat')) {
        return await handleChat(request, this.env);
      }

      // IO routes: /api/ios/*
      if (path.startsWith('/api/ios')) {
        return await handleIOs(request, this.env, path.replace('/api/ios', ''));
      }

      // Auction routes: /api/auctions/*
      if (path.startsWith('/api/auctions')) {
        return await handleAuctions(request, this.env, path.replace('/api/auctions', ''));
      }

      // Member routes: /api/member/*
      if (path.startsWith('/api/member')) {
        return await handleMember(request, this.env, path.replace('/api/member', ''));
      }

      // Cardano routes: /api/cardano/*
      if (path.startsWith('/api/cardano')) {
        return await this.handleCardano(request, path.replace('/api/cardano', ''));
      }

      // 404 for unknown API routes
      if (path.startsWith('/api/')) {
        return this.json({ success: false, error: 'Endpoint not found' }, 404);
      }

      // For non-API routes, return 404 (static assets handled separately)
      return this.json({ success: false, error: 'Not found' }, 404);
    } catch (error) {
      console.error('Router error:', error);
      return this.json(
        { success: false, error: error instanceof Error ? error.message : 'Internal error' },
        500
      );
    }
  }

  // === Cardano Handler ===
  private async handleCardano(request: Request, subPath: string): Promise<Response> {
    const url = new URL(request.url);

    // GET /api/cardano/health - Check Blockfrost connection
    if (subPath === '/health' && request.method === 'GET') {
      const status = await checkBlockfrostConnection(this.env);
      return this.json({
        success: status.connected,
        data: status,
      });
    }

    // GET /api/cardano/balance/:address - Get wallet balance
    if (subPath.startsWith('/balance/') && request.method === 'GET') {
      const address = subPath.replace('/balance/', '');
      
      if (!address) {
        return this.json({ success: false, error: 'Wallet address required' }, 400);
      }

      try {
        const balance = await getOnChainBalance(this.env, address);
        
        // Convert BigInt to string for JSON serialization
        return this.json({
          success: true,
          data: {
            address,
            ada: balance.ada,
            lovelace: balance.lovelace.toString(),
            tokens: balance.tokens.map(t => ({
              policyId: t.policyId,
              assetName: t.assetName,
              assetNameUtf8: t.assetNameUtf8,
              quantity: t.quantity.toString(),
            })),
          },
        });
      } catch (error) {
        return this.json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to query balance',
        }, 500);
      }
    }

    // GET /api/cardano/utxos/:address - Get wallet UTXOs
    if (subPath.startsWith('/utxos/') && request.method === 'GET') {
      const address = subPath.replace('/utxos/', '');
      
      if (!address) {
        return this.json({ success: false, error: 'Wallet address required' }, 400);
      }

      try {
        const utxos = await getWalletUTXOs(this.env, address);
        
        return this.json({
          success: true,
          data: {
            address,
            utxoCount: utxos.length,
            utxos: utxos.map(u => ({
              txHash: u.txHash,
              outputIndex: u.outputIndex,
              lovelace: u.lovelace.toString(),
              tokens: u.tokens.map(t => ({
                policyId: t.policyId,
                assetName: t.assetName,
                assetNameUtf8: t.assetNameUtf8,
                quantity: t.quantity.toString(),
              })),
              datumHash: u.datumHash,
            })),
          },
        });
      } catch (error) {
        return this.json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to query UTXOs',
        }, 500);
      }
    }

    return this.json({ success: false, error: 'Cardano endpoint not found' }, 404);
  }

  private json(data: APIResponse, status = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
