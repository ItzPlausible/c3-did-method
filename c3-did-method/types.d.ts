declare module 'blakejs/blake2b' {
  function blake2b(input: Uint8Array, key?: Uint8Array | null, outlen?: number): Uint8Array;
  export default blake2b;
}

declare module 'blakejs' {
  export function blake2b(input: Uint8Array, key?: Uint8Array | null, outlen?: number): Uint8Array;
  export function blake2bHex(input: Uint8Array, key?: Uint8Array | null, outlen?: number): string;
}
