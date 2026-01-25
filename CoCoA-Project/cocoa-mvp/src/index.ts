/**
 * CoCoA MVP - Main Entry Point
 * Cosmic Commoner Avatar: Conversational Form Completer for C3 Alliance
 */

import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Env, APIResponse } from './types';
import { Router } from './router';

// @ts-ignore - manifest is generated at build time
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // API routing - handle /api/* paths first
    if (url.pathname.startsWith('/api/')) {
      try {
        const router = new Router(env);
        const response = await router.handle(request);
        
        // Add CORS headers to response
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch (error) {
        console.error('Unhandled error:', error);
        
        const errorResponse: APIResponse = {
          success: false,
          error: error instanceof Error ? error.message : 'Internal server error',
        };
        
        return new Response(JSON.stringify(errorResponse), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Serve static assets for all other paths
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (e) {
      // If asset not found, serve index.html for SPA routing
      try {
        const notFoundRequest = new Request(new URL('/index.html', url.origin).toString(), request);
        return await getAssetFromKV(
          {
            request: notFoundRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};

// Extend Env type to include static content binding
declare module './types' {
  interface Env {
    __STATIC_CONTENT: KVNamespace;
  }
}
