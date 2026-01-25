/**
 * CoCoA MVP - Intent Classification Tests
 * Tests for the pattern-based intent classification fallback
 */

import { describe, it, expect } from 'vitest';

// Simulated intent patterns (copy from intent.ts for testing)
const INTENT_PATTERNS: Record<string, RegExp[]> = {
  greeting: [/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)/i],
  balance_check: [/balance/i, /how\s*much/i, /what.*have/i, /my\s*(tokens?|comm|pmt|pct|pdt)/i],
  io_list: [/show.*io/i, /list.*io/i, /available.*io/i, /(intent|intents).*opportunit/i, /what.*can.*do/i],
  io_contribute: [/contribute/i, /stake/i, /join.*io/i, /sign\s*up.*io/i, /participate/i],
  auction_list: [/show.*auction/i, /list.*auction/i, /vam/i, /what.*bid/i, /available.*auction/i],
  auction_bid: [/bid/i, /place.*bid/i, /want.*auction/i, /buy/i],
  status: [/status/i, /my\s*profile/i, /who\s*am/i, /my\s*account/i, /my\s*info/i],
  help: [/help/i, /how.*work/i, /what.*can.*you/i, /explain/i, /guide/i],
};

function classifyByPatterns(message: string): { type: string; confidence: number } {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerMessage)) {
        return { type: intent, confidence: 0.8 };
      }
    }
  }
  
  return { type: 'unknown', confidence: 0.3 };
}

describe('Intent Classification', () => {
  describe('Greetings', () => {
    it('should classify "hi" as greeting', () => {
      expect(classifyByPatterns('hi').type).toBe('greeting');
    });

    it('should classify "Hello there" as greeting', () => {
      expect(classifyByPatterns('Hello there').type).toBe('greeting');
    });

    it('should classify "Good morning" as greeting', () => {
      expect(classifyByPatterns('Good morning').type).toBe('greeting');
    });
  });

  describe('Balance Check', () => {
    it('should classify "check my balance" as balance_check', () => {
      expect(classifyByPatterns('check my balance').type).toBe('balance_check');
    });

    it('should classify "how much COMM do I have?" as balance_check', () => {
      expect(classifyByPatterns('how much COMM do I have?').type).toBe('balance_check');
    });

    it('should classify "my tokens" as balance_check', () => {
      expect(classifyByPatterns('my tokens').type).toBe('balance_check');
    });
  });

  describe('IO List', () => {
    it('should classify "show me IOs" as io_list', () => {
      expect(classifyByPatterns('show me IOs').type).toBe('io_list');
    });

    it('should classify "list available IOs" as io_list', () => {
      expect(classifyByPatterns('list available IOs').type).toBe('io_list');
    });

    it('should classify "intent opportunities" as io_list', () => {
      expect(classifyByPatterns('intent opportunities').type).toBe('io_list');
    });
  });

  describe('IO Contribute', () => {
    it('should classify "contribute to IO-SYN-001" as io_contribute', () => {
      expect(classifyByPatterns('contribute to IO-SYN-001').type).toBe('io_contribute');
    });

    it('should classify "I want to stake" as io_contribute', () => {
      expect(classifyByPatterns('I want to stake').type).toBe('io_contribute');
    });

    it('should classify "participate in an IO" as io_contribute', () => {
      expect(classifyByPatterns('participate in an IO').type).toBe('io_contribute');
    });
  });

  describe('Auction List', () => {
    it('should classify "show auctions" as auction_list', () => {
      expect(classifyByPatterns('show auctions').type).toBe('auction_list');
    });

    it('should classify "VAM opportunities" as auction_list', () => {
      expect(classifyByPatterns('VAM opportunities').type).toBe('auction_list');
    });

    it('should classify "what can I bid on?" as auction_list', () => {
      expect(classifyByPatterns('what can I bid on?').type).toBe('auction_list');
    });
  });

  describe('Auction Bid', () => {
    it('should classify "bid on VAM-001" as auction_bid', () => {
      expect(classifyByPatterns('bid on VAM-001').type).toBe('auction_bid');
    });

    it('should classify "place a bid" as auction_bid', () => {
      expect(classifyByPatterns('place a bid').type).toBe('auction_bid');
    });

    it('should classify "I want to buy the solar panel" as auction_bid', () => {
      expect(classifyByPatterns('I want to buy the solar panel').type).toBe('auction_bid');
    });
  });

  describe('Status', () => {
    it('should classify "what is my status?" as status', () => {
      expect(classifyByPatterns('what is my status?').type).toBe('status');
    });

    it('should classify "show my profile" as status', () => {
      expect(classifyByPatterns('show my profile').type).toBe('status');
    });

    it('should classify "who am I?" as status', () => {
      expect(classifyByPatterns('who am I?').type).toBe('status');
    });
  });

  describe('Help', () => {
    it('should classify "help" as help', () => {
      expect(classifyByPatterns('help').type).toBe('help');
    });

    it('should classify "how does this work?" as help', () => {
      expect(classifyByPatterns('how does this work?').type).toBe('help');
    });

    it('should classify "explain the system" as help', () => {
      expect(classifyByPatterns('explain the system').type).toBe('help');
    });
  });

  describe('Unknown', () => {
    it('should classify random text as unknown', () => {
      expect(classifyByPatterns('asdfghjkl').type).toBe('unknown');
    });

    it('should classify unrelated sentences as unknown', () => {
      expect(classifyByPatterns('The weather is nice today').type).toBe('unknown');
    });
  });

  describe('Entity Extraction', () => {
    // Test entity extraction patterns
    const extractEntities = (message: string) => {
      const entities: Record<string, unknown> = {};
      
      const ioMatch = message.match(/IO-[A-Z]{3}-\d{3}/i);
      if (ioMatch) entities.io_id = ioMatch[0].toUpperCase();
      
      const auctionMatch = message.match(/VAM-\d{3}/i);
      if (auctionMatch) entities.auction_id = auctionMatch[0].toUpperCase();
      
      const amountMatch = message.match(/(\d+)\s*(comm|tokens?)?/i);
      if (amountMatch) entities.amount = parseInt(amountMatch[1], 10);
      
      return entities;
    };

    it('should extract IO ID from message', () => {
      const entities = extractEntities('contribute to IO-SYN-001');
      expect(entities.io_id).toBe('IO-SYN-001');
    });

    it('should extract auction ID from message', () => {
      const entities = extractEntities('bid on VAM-002');
      expect(entities.auction_id).toBe('VAM-002');
    });

    it('should extract amount from message', () => {
      const entities = extractEntities('stake 100 COMM');
      expect(entities.amount).toBe(100);
    });

    it('should extract multiple entities', () => {
      const entities = extractEntities('contribute 50 tokens to IO-GUI-001');
      expect(entities.io_id).toBe('IO-GUI-001');
      expect(entities.amount).toBe(50);
    });
  });
});
