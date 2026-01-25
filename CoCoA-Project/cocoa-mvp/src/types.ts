// CoCoA MVP Type Definitions

// === Environment Bindings ===
export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  AI: Ai;
  ENVIRONMENT: string;
}

// === Faction System ===
export type Faction = 'syndicate' | 'guild' | 'union';
export type Role = 'promoter' | 'procurer' | 'producer';
export type PatronageToken = 'PMT' | 'PCT' | 'PDT';

export const FACTION_MAP: Record<Faction, { role: Role; token: PatronageToken }> = {
  syndicate: { role: 'promoter', token: 'PMT' },
  guild: { role: 'procurer', token: 'PCT' },
  union: { role: 'producer', token: 'PDT' },
};

// === Member Identity ===
export interface Member {
  seid: string;           // Sovereign Entity ID
  wallet_address: string;
  display_name: string | null;
  created_at: string;
  last_active: string;
}

export interface MemberFEID {
  id: number;
  seid: string;
  faction: Faction;
  feid_token_id: string;  // On-chain SBT reference
  earned_at: string;
}

export interface Balance {
  seid: string;
  token_type: 'COMM' | PatronageToken | 'JLZ' | 'XPT';
  amount: number;
  updated_at: string;
}

// === Intent Opportunities ===
export type IOStatus = 'open' | 'in_progress' | 'completed' | 'expired';

export interface IO {
  id: string;
  title: string;
  description: string;
  required_faction: Faction;
  required_role: Role;
  min_stake: number;
  patronage_reward: number;
  status: IOStatus;
  deadline: string;
  created_at: string;
}

export interface IOContribution {
  id: number;
  io_id: string;
  seid: string;
  feid_id: number;
  stake_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submitted_at: string;
  completed_at: string | null;
}

// === VAM Auctions ===
export type AssetType = 'rwa' | 'service' | 'land' | 'equity';
export type AuctionStatus = 'open' | 'closed' | 'settled' | 'cancelled';

export interface Auction {
  id: string;
  asset_name: string;
  asset_description: string;
  asset_type: AssetType;
  reserve_price: number;
  start_time: string;
  end_time: string;
  status: AuctionStatus;
  winner_seid: string | null;
  winning_bid: number | null;
  second_bid: number | null;
  delta_captured: number | null;
  created_at: string;
}

export interface Bid {
  id: number;
  auction_id: string;
  seid: string;
  amount: number;
  submitted_at: string;
  is_winning: boolean;
}

// === Chat & Intent System ===
export type IntentType =
  | 'greeting'
  | 'balance_check'
  | 'io_list'
  | 'io_contribute'
  | 'auction_list'
  | 'auction_bid'
  | 'status'
  | 'help'
  | 'unknown';

export interface ParsedIntent {
  type: IntentType;
  confidence: number;
  entities: {
    io_id?: string;
    auction_id?: string;
    amount?: number;
    faction?: Faction;
  };
  raw: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  seid: string | null;
  wallet_address: string | null;
  messages: ChatMessage[];
  context: {
    currentIntent?: ParsedIntent;
    pendingAction?: string;
    formData?: Record<string, unknown>;
  };
  created_at: number;
  updated_at: number;
}

// === API Response Types ===
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatResponse extends APIResponse {
  data: {
    message: string;
    intent: ParsedIntent;
    actions?: {
      type: 'wallet_connect' | 'sign_tx' | 'form_complete';
      payload: Record<string, unknown>;
    }[];
  };
}

// === Wallet Types (CIP-30) ===
export interface WalletAPI {
  enable(): Promise<{
    getNetworkId(): Promise<number>;
    getUsedAddresses(): Promise<string[]>;
    getUnusedAddresses(): Promise<string[]>;
    getBalance(): Promise<string>;
    signTx(tx: string, partialSign?: boolean): Promise<string>;
    submitTx(tx: string): Promise<string>;
  }>;
  isEnabled(): Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}
