/**
 * CoCoA MVP - Cardano Service
 * Handles blockchain interactions via Blockfrost API
 * 
 * Phase 2: Live Blockfrost integration for PreProd testnet
 */

import { Env } from '../types';

// === Blockfrost Types ===

interface BlockfrostConfig {
  projectId: string;
  network: 'mainnet' | 'preprod' | 'preview';
  baseUrl: string;
}

interface BlockfrostAmount {
  unit: string;  // 'lovelace' or policy_id + asset_name_hex
  quantity: string;
}

interface BlockfrostUTXO {
  tx_hash: string;
  tx_index: number;
  output_index: number;
  amount: BlockfrostAmount[];
  block: string;
  data_hash: string | null;
  inline_datum: string | null;
  reference_script_hash: string | null;
}

interface BlockfrostAddressInfo {
  address: string;
  amount: BlockfrostAmount[];
  stake_address: string | null;
  type: string;
  script: boolean;
}

interface BlockfrostAsset {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
}

interface BlockfrostError {
  status_code: number;
  error: string;
  message: string;
}

// === Configuration ===

function getBlockfrostConfig(env: Env): BlockfrostConfig {
  const projectId = env.BLOCKFROST_PROJECT_ID || '';
  
  // Detect network from project ID prefix
  let network: 'mainnet' | 'preprod' | 'preview' = 'preprod';
  if (projectId.startsWith('mainnet')) {
    network = 'mainnet';
  } else if (projectId.startsWith('preview')) {
    network = 'preview';
  }
  
  return {
    projectId,
    network,
    baseUrl: `https://cardano-${network}.blockfrost.io/api/v0`,
  };
}

// === Blockfrost API Helper ===

async function blockfrostRequest<T>(
  config: BlockfrostConfig,
  endpoint: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  if (!config.projectId) {
    throw new Error('BLOCKFROST_PROJECT_ID not configured');
  }

  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    method,
    headers: {
      'project_id': config.projectId,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as BlockfrostError;
    
    // Handle specific error cases
    if (response.status === 404) {
      throw new Error(`NOT_FOUND: ${errorBody.message || endpoint}`);
    }
    if (response.status === 402) {
      throw new Error('BLOCKFROST_LIMIT: API usage limit exceeded');
    }
    if (response.status === 403) {
      throw new Error('BLOCKFROST_AUTH: Invalid project ID');
    }
    
    throw new Error(`Blockfrost API error ${response.status}: ${errorBody.message || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// === Wallet Verification ===

export async function verifyWalletAddress(address: string): Promise<boolean> {
  // Cardano address validation
  // Mainnet: addr1...
  // Testnet: addr_test1...
  const validPrefixes = ['addr1', 'addr_test1'];
  return validPrefixes.some(prefix => address.startsWith(prefix));
}

// === Balance Queries ===

export interface WalletBalance {
  ada: number;              // ADA amount (not lovelace)
  lovelace: bigint;         // Raw lovelace
  tokens: TokenBalance[];   // Native tokens
}

export interface TokenBalance {
  policyId: string;
  assetName: string;        // Hex-encoded
  assetNameUtf8: string;    // Human-readable (if valid UTF-8)
  quantity: bigint;
  fingerprint?: string;
}

export async function getOnChainBalance(
  env: Env,
  walletAddress: string
): Promise<WalletBalance> {
  const config = getBlockfrostConfig(env);
  
  try {
    const addressInfo = await blockfrostRequest<BlockfrostAddressInfo>(
      config,
      `/addresses/${walletAddress}`
    );

    // Parse amounts
    let lovelace = BigInt(0);
    const tokens: TokenBalance[] = [];

    for (const amount of addressInfo.amount) {
      if (amount.unit === 'lovelace') {
        lovelace = BigInt(amount.quantity);
      } else {
        // Native token: unit = policy_id (56 chars) + asset_name_hex
        const policyId = amount.unit.substring(0, 56);
        const assetNameHex = amount.unit.substring(56);
        
        tokens.push({
          policyId,
          assetName: assetNameHex,
          assetNameUtf8: hexToUtf8(assetNameHex),
          quantity: BigInt(amount.quantity),
        });
      }
    }

    return {
      ada: Number(lovelace) / 1_000_000,
      lovelace,
      tokens,
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('NOT_FOUND')) {
      // Address has no UTXOs (empty wallet)
      return {
        ada: 0,
        lovelace: BigInt(0),
        tokens: [],
      };
    }
    throw error;
  }
}

// === UTXO Queries ===

export interface UTXO {
  txHash: string;
  outputIndex: number;
  lovelace: bigint;
  tokens: TokenBalance[];
  datumHash: string | null;
  inlineDatum: string | null;
}

export async function getWalletUTXOs(
  env: Env,
  walletAddress: string
): Promise<UTXO[]> {
  const config = getBlockfrostConfig(env);
  
  try {
    const utxos = await blockfrostRequest<BlockfrostUTXO[]>(
      config,
      `/addresses/${walletAddress}/utxos`
    );

    return utxos.map(utxo => {
      let lovelace = BigInt(0);
      const tokens: TokenBalance[] = [];

      for (const amount of utxo.amount) {
        if (amount.unit === 'lovelace') {
          lovelace = BigInt(amount.quantity);
        } else {
          const policyId = amount.unit.substring(0, 56);
          const assetNameHex = amount.unit.substring(56);
          
          tokens.push({
            policyId,
            assetName: assetNameHex,
            assetNameUtf8: hexToUtf8(assetNameHex),
            quantity: BigInt(amount.quantity),
          });
        }
      }

      return {
        txHash: utxo.tx_hash,
        outputIndex: utxo.output_index,
        lovelace,
        tokens,
        datumHash: utxo.data_hash,
        inlineDatum: utxo.inline_datum,
      };
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('NOT_FOUND')) {
      return [];
    }
    throw error;
  }
}

// === Asset Verification ===

export async function verifyAssetOwnership(
  env: Env,
  walletAddress: string,
  policyId: string,
  assetName?: string
): Promise<boolean> {
  const balance = await getOnChainBalance(env, walletAddress);
  
  return balance.tokens.some(token => {
    if (token.policyId !== policyId) return false;
    if (assetName && token.assetName !== assetName) return false;
    return token.quantity > 0;
  });
}

export async function getAssetInfo(
  env: Env,
  policyId: string,
  assetNameHex: string
): Promise<BlockfrostAsset | null> {
  const config = getBlockfrostConfig(env);
  const assetId = policyId + assetNameHex;
  
  try {
    return await blockfrostRequest<BlockfrostAsset>(
      config,
      `/assets/${assetId}`
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('NOT_FOUND')) {
      return null;
    }
    throw error;
  }
}

// === Transaction Submission ===

export async function submitTransaction(
  env: Env,
  signedTxCbor: string
): Promise<string> {
  const config = getBlockfrostConfig(env);
  
  const response = await fetch(`${config.baseUrl}/tx/submit`, {
    method: 'POST',
    headers: {
      'project_id': config.projectId,
      'Content-Type': 'application/cbor',
    },
    body: hexToBytes(signedTxCbor),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as BlockfrostError;
    throw new Error(`Transaction submission failed: ${errorBody.message || response.statusText}`);
  }

  // Returns transaction hash
  const txHash = await response.text();
  return txHash.replace(/"/g, '');
}

// === SEID NFT Operations (Phase 2 - Stubs for Now) ===

export interface SEIDMetadata {
  seid: string;
  walletAddress: string;
  createdAt: string;
  version: string;
}

export async function mintSEID(
  env: Env,
  walletAddress: string,
  seid: string
): Promise<{ txHash: string; tokenId: string } | null> {
  // TODO: Implement SEID minting
  // 1. Build transaction with Mesh.js or Lucid
  // 2. Include CIP-25/CIP-68 metadata
  // 3. Return unsigned tx for wallet signing
  
  console.log(`[TODO] Mint SEID ${seid} for wallet ${walletAddress}`);
  
  return {
    txHash: `pending_${Date.now()}`,
    tokenId: `SEID_${seid}`,
  };
}

// === FEID SBT Operations (Phase 2 - Stubs for Now) ===

export interface FEIDMetadata {
  feid: string;
  seid: string;
  faction: 'syndicate' | 'guild' | 'union';
  earnedAt: string;
}

export async function mintFEID(
  env: Env,
  seid: string,
  faction: 'syndicate' | 'guild' | 'union'
): Promise<{ txHash: string; tokenId: string } | null> {
  // TODO: Implement FEID minting
  
  console.log(`[TODO] Mint ${faction} FEID for SEID ${seid}`);
  
  return {
    txHash: `pending_${Date.now()}`,
    tokenId: `FEID_${faction.toUpperCase()}_${seid}`,
  };
}

// === Token Transfer Operations (Phase 2 - Stubs for Now) ===

export async function transferTokens(
  env: Env,
  from: string,
  to: string,
  amount: number,
  tokenType: string
): Promise<{ txHash: string } | null> {
  // TODO: Implement token transfers
  
  console.log(`[TODO] Transfer ${amount} ${tokenType} from ${from} to ${to}`);
  
  return {
    txHash: `pending_${Date.now()}`,
  };
}

// === VAM Settlement (Phase 2 - Stubs for Now) ===

export async function settleAuctionOnChain(
  env: Env,
  auctionId: string,
  winnerAddress: string,
  amount: number,
  assetTokenId: string
): Promise<{ txHash: string } | null> {
  // TODO: Implement atomic swap for auction settlement
  
  console.log(`[TODO] Settle auction ${auctionId} - ${amount} COMM for ${assetTokenId}`);
  
  return {
    txHash: `pending_${Date.now()}`,
  };
}

// === Utility Functions ===

function hexToUtf8(hex: string): string {
  try {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    return new TextDecoder().decode(bytes);
  } catch {
    return hex; // Return hex if not valid UTF-8
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function utf8ToHex(str: string): string {
  return Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generatePolicyId(seed: string): string {
  // TODO: Derive from actual minting policy script
  return `policy_${seed.substring(0, 8)}`;
}

// === Network Health Check ===

export async function checkBlockfrostConnection(env: Env): Promise<{
  connected: boolean;
  network: string;
  tip?: { slot: number; hash: string };
  error?: string;
}> {
  const config = getBlockfrostConfig(env);
  
  try {
    const tip = await blockfrostRequest<{ slot: number; hash: string }>(
      config,
      '/blocks/latest'
    );
    
    return {
      connected: true,
      network: config.network,
      tip: { slot: tip.slot, hash: tip.hash },
    };
  } catch (error) {
    return {
      connected: false,
      network: config.network,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Extend Env type for Cardano config
declare module '../types' {
  interface Env {
    BLOCKFROST_PROJECT_ID?: string;
    CARDANO_NETWORK?: string;
  }
}
