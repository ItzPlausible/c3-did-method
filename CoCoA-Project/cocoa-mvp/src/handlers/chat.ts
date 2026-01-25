/**
 * CoCoA MVP - Chat Handler
 * Conversational interface with intent classification via Workers AI
 */

import { Env, APIResponse, ChatResponse, ParsedIntent, IntentType, ChatMessage, Session } from '../types';
import { getSession, updateSession } from './auth';
import { classifyIntent, generateResponse } from '../services/intent';
import { getBalances, getMemberFEIDs } from '../db/queries';

export async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405);
  }

  try {
    // Get session
    const session = await getSession(request, env);
    if (!session || !session.seid) {
      return jsonResponse({ 
        success: false, 
        error: 'Please connect your wallet first',
        data: {
          message: "Hi! I'm CoCoA, your Cosmic Commoner Avatar. Please connect your Lace wallet to get started.",
          intent: { type: 'unknown', confidence: 0, entities: {}, raw: '' },
        }
      }, 401);
    }

    // Parse user message
    const body = await request.json() as { message: string };
    if (!body.message || typeof body.message !== 'string') {
      return jsonResponse({ success: false, error: 'Message is required' }, 400);
    }

    const userMessage = body.message.trim();

    // Add user message to session
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    session.messages.push(userChatMessage);

    // Classify intent using Workers AI
    const intent = await classifyIntent(env, userMessage, session);
    session.context.currentIntent = intent;

    // Generate response based on intent
    const response = await generateResponse(env, intent, session);

    // Add assistant response to session
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response.message,
      timestamp: Date.now(),
    };
    session.messages.push(assistantMessage);

    // Update session in KV
    await updateSession(env, session);

    return jsonResponse({
      success: true,
      data: {
        message: response.message,
        intent,
        actions: response.actions,
      },
    } as ChatResponse);

  } catch (error) {
    console.error('Chat error:', error);
    return jsonResponse({
      success: false,
      error: 'Chat processing failed',
      data: {
        message: "I encountered an issue processing that. Could you try again?",
        intent: { type: 'unknown', confidence: 0, entities: {}, raw: '' },
      },
    }, 500);
  }
}

function jsonResponse(data: APIResponse | ChatResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
