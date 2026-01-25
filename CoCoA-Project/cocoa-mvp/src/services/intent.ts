/**
 * CoCoA MVP - Intent Classification Service
 * Uses Workers AI to classify user intents and generate responses
 */

import { Env, ParsedIntent, IntentType, Session, Faction } from '../types';
import { listIOs, listAuctions, getBalances, getMemberFEIDs, getIO, getAuction } from '../db/queries';

// Intent patterns for quick matching (fallback when AI unavailable)
const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  greeting: [/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)/i],
  balance_check: [/balance/i, /how\s*much/i, /what.*have/i, /my\s*(tokens?|comm|pmt|pct|pdt)/i],
  io_list: [/show.*io/i, /list.*io/i, /available.*io/i, /(intent|intents).*opportunit/i, /what.*can.*do/i],
  io_contribute: [/contribute/i, /stake/i, /join.*io/i, /sign\s*up.*io/i, /participate/i],
  auction_list: [/show.*auction/i, /list.*auction/i, /vam/i, /what.*bid/i, /available.*auction/i],
  auction_bid: [/bid/i, /place.*bid/i, /want.*auction/i, /buy/i],
  status: [/status/i, /my\s*profile/i, /who\s*am/i, /my\s*account/i, /my\s*info/i],
  help: [/help/i, /how.*work/i, /what.*can.*you/i, /explain/i, /guide/i],
  unknown: [],
};

// Extract entities from user message
function extractEntities(message: string): ParsedIntent['entities'] {
  const entities: ParsedIntent['entities'] = {};

  // Extract IO ID (e.g., IO-SYN-001)
  const ioMatch = message.match(/IO-[A-Z]{3}-\d{3}/i);
  if (ioMatch) {
    entities.io_id = ioMatch[0].toUpperCase();
  }

  // Extract auction ID (e.g., VAM-001)
  const auctionMatch = message.match(/VAM-\d{3}/i);
  if (auctionMatch) {
    entities.auction_id = auctionMatch[0].toUpperCase();
  }

  // Extract amount (e.g., "100 COMM", "bid 500")
  const amountMatch = message.match(/(\d+)\s*(comm|tokens?)?/i);
  if (amountMatch) {
    entities.amount = parseInt(amountMatch[1], 10);
  }

  // Extract faction
  const factionMatch = message.match(/(syndicate|guild|union|promoter|procurer|producer)/i);
  if (factionMatch) {
    const faction = factionMatch[1].toLowerCase();
    if (['syndicate', 'promoter'].includes(faction)) entities.faction = 'syndicate';
    else if (['guild', 'procurer'].includes(faction)) entities.faction = 'guild';
    else if (['union', 'producer'].includes(faction)) entities.faction = 'union';
  }

  return entities;
}

// Pattern-based intent classification (fallback)
function classifyByPatterns(message: string): { type: IntentType; confidence: number } {
  const lowerMessage = message.toLowerCase();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerMessage)) {
        return { type: intent as IntentType, confidence: 0.8 };
      }
    }
  }

  return { type: 'unknown', confidence: 0.3 };
}

// Classify intent using Workers AI
export async function classifyIntent(env: Env, message: string, session: Session): Promise<ParsedIntent> {
  const entities = extractEntities(message);

  try {
    // Use Workers AI for classification
    const prompt = `You are an intent classifier for CoCoA, a cooperative member interface. Classify the user's intent into exactly one of these categories:

- greeting: User is saying hello or starting conversation
- balance_check: User wants to check their token balances (COMM, PMT, PCT, PDT, JLZ)
- io_list: User wants to see available Intent Opportunities (work tasks)
- io_contribute: User wants to contribute/stake on an IO
- auction_list: User wants to see available VAM auctions
- auction_bid: User wants to place a bid on an auction
- status: User wants to see their profile/status/FEIDs
- help: User needs help understanding the system
- unknown: Cannot determine intent

User message: "${message}"

Respond with ONLY the intent name, nothing else.`;

    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      prompt,
      max_tokens: 20,
    });

    // Parse AI response
    const aiIntent = (response as { response?: string }).response?.trim().toLowerCase() || 'unknown';
    const validIntents: IntentType[] = ['greeting', 'balance_check', 'io_list', 'io_contribute', 'auction_list', 'auction_bid', 'status', 'help', 'unknown'];
    
    const type = validIntents.includes(aiIntent as IntentType) ? (aiIntent as IntentType) : 'unknown';

    return {
      type,
      confidence: type !== 'unknown' ? 0.9 : 0.3,
      entities,
      raw: message,
    };
  } catch (error) {
    console.error('AI classification failed, using pattern matching:', error);
    
    // Fallback to pattern matching
    const patternResult = classifyByPatterns(message);
    
    return {
      type: patternResult.type,
      confidence: patternResult.confidence,
      entities,
      raw: message,
    };
  }
}

// Generate response based on intent
export async function generateResponse(
  env: Env,
  intent: ParsedIntent,
  session: Session
): Promise<{ message: string; actions?: Array<{ type: string; payload: Record<string, unknown> }> }> {
  const seid = session.seid!;

  switch (intent.type) {
    case 'greeting':
      return {
        message: `Hey there! I'm CoCoA, your Cosmic Commoner Avatar. I can help you:

• Check your **balances** (COMM, patronage tokens)
• Browse **Intent Opportunities** to earn rewards
• View and bid on **VAM auctions**
• Check your **status** and FEIDs

What would you like to do?`,
      };

    case 'balance_check':
      const balances = await getBalances(env, seid);
      const balanceMap: Record<string, number> = {};
      for (const b of balances) {
        balanceMap[b.token_type] = b.amount;
      }

      return {
        message: `Here are your current balances:

💰 **COMM**: ${balanceMap['COMM'] || 0} (Community tokens)
🔵 **PMT**: ${balanceMap['PMT'] || 0} (Promoter patronage)
🟢 **PCT**: ${balanceMap['PCT'] || 0} (Procurer patronage)
🟣 **PDT**: ${balanceMap['PDT'] || 0} (Producer patronage)
⚡ **JLZ**: ${balanceMap['JLZ'] || 0} (Energy credits)
✨ **XPT**: ${balanceMap['XPT'] || 0} (Experience)`,
      };

    case 'io_list':
      const ios = await listIOs(env, 'open', intent.entities.faction);
      if (ios.length === 0) {
        return {
          message: `No open Intent Opportunities found${intent.entities.faction ? ` for ${intent.entities.faction}` : ''}. Check back soon!`,
        };
      }

      const ioList = ios.slice(0, 5).map(io => 
        `• **${io.id}**: ${io.title} (${io.required_faction} · ${io.patronage_reward} ${io.required_faction === 'syndicate' ? 'PMT' : io.required_faction === 'guild' ? 'PCT' : 'PDT'})`
      ).join('\n');

      return {
        message: `Here are the open Intent Opportunities:\n\n${ioList}\n\nSay "contribute to [IO-ID]" to stake and participate.`,
      };

    case 'io_contribute':
      if (!intent.entities.io_id) {
        return {
          message: `Which IO would you like to contribute to? Please specify the IO ID (e.g., "contribute to IO-SYN-001").`,
        };
      }

      const io = await getIO(env, intent.entities.io_id);
      if (!io) {
        return {
          message: `IO "${intent.entities.io_id}" not found. Use "show IOs" to see available opportunities.`,
        };
      }

      return {
        message: `**${io.title}** (${io.id})

${io.description}

• **Faction**: ${io.required_faction} (${io.required_role})
• **Min stake**: ${io.min_stake} COMM
• **Reward**: ${io.patronage_reward} ${io.required_faction === 'syndicate' ? 'PMT' : io.required_faction === 'guild' ? 'PCT' : 'PDT'}
• **Deadline**: ${new Date(io.deadline).toLocaleDateString()}

How much COMM would you like to stake? (minimum ${io.min_stake})`,
        actions: [
          {
            type: 'form_complete',
            payload: {
              form: 'io_contribute',
              io_id: io.id,
              min_stake: io.min_stake,
            },
          },
        ],
      };

    case 'auction_list':
      const auctions = await listAuctions(env, 'open');
      if (auctions.length === 0) {
        return {
          message: `No open auctions right now. Check back soon for new VAM opportunities!`,
        };
      }

      const auctionList = auctions.slice(0, 5).map(a => {
        const endTime = new Date(a.end_time);
        const hoursLeft = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / (1000 * 60 * 60)));
        return `• **${a.id}**: ${a.asset_name} (${a.asset_type} · reserve ${a.reserve_price} COMM · ${hoursLeft}h left)`;
      }).join('\n');

      return {
        message: `Here are the open VAM auctions:\n\n${auctionList}\n\nSay "bid on [VAM-ID]" to place a sealed bid.`,
      };

    case 'auction_bid':
      if (!intent.entities.auction_id) {
        return {
          message: `Which auction would you like to bid on? Please specify the auction ID (e.g., "bid on VAM-001").`,
        };
      }

      const auction = await getAuction(env, intent.entities.auction_id);
      if (!auction) {
        return {
          message: `Auction "${intent.entities.auction_id}" not found. Use "show auctions" to see available ones.`,
        };
      }

      return {
        message: `**${auction.asset_name}** (${auction.id})

${auction.asset_description}

• **Type**: ${auction.asset_type}
• **Reserve**: ${auction.reserve_price} COMM
• **Ends**: ${new Date(auction.end_time).toLocaleString()}

This is a **sealed-bid Vickrey auction**. You submit one secret bid. If you win, you pay the **second-highest bid** (not your bid). The difference goes to the Commons treasury.

How much COMM would you like to bid? (minimum ${auction.reserve_price})`,
        actions: [
          {
            type: 'form_complete',
            payload: {
              form: 'auction_bid',
              auction_id: auction.id,
              reserve_price: auction.reserve_price,
            },
          },
        ],
      };

    case 'status':
      const feids = await getMemberFEIDs(env, seid);
      const statusBalances = await getBalances(env, seid);
      
      const feidList = feids.length > 0
        ? feids.map(f => `• ${f.faction.charAt(0).toUpperCase() + f.faction.slice(1)} (${f.faction === 'syndicate' ? 'Promoter' : f.faction === 'guild' ? 'Procurer' : 'Producer'})`).join('\n')
        : '• None yet - contribute to an IO to earn your first FEID!';

      const sBalanceMap: Record<string, number> = {};
      for (const b of statusBalances) {
        sBalanceMap[b.token_type] = b.amount;
      }

      return {
        message: `**Your Status**

🆔 **SEID**: ${seid}

**Faction Identities (FEIDs):**
${feidList}

**Balances:**
• COMM: ${sBalanceMap['COMM'] || 0}
• PMT: ${sBalanceMap['PMT'] || 0} | PCT: ${sBalanceMap['PCT'] || 0} | PDT: ${sBalanceMap['PDT'] || 0}`,
      };

    case 'help':
      return {
        message: `**Welcome to C3 Alliance!** Here's how it works:

**Identity:**
• Your **SEID** is your sovereign identity
• **FEIDs** are faction badges earned by contributing

**Three Factions:**
• **Syndicate** (Promoters) → Earn PMT
• **Guild** (Procurers) → Earn PCT
• **Union** (Producers) → Earn PDT

**Actions:**
• **IOs** (Intent Opportunities): Stake COMM to participate in tasks
• **VAM** (Vickrey Auctions): Bid on assets, winner pays 2nd-highest bid

**Commands I understand:**
• "Check my balance"
• "Show IOs" / "Show auctions"
• "Contribute to [IO-ID]"
• "Bid on [VAM-ID]"
• "What's my status?"`,
      };

    default:
      return {
        message: `I'm not sure what you mean. Try:
• "Check my balance"
• "Show IOs"
• "Show auctions"
• "What's my status?"
• "Help"`,
      };
  }
}
