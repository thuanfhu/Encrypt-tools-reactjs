import { modPow } from './diffie-hellman';
import { sha256 } from './sha256';

export interface SchnorrSignature {
  r: bigint;
  s: bigint;
}

export function generateSchnorrKeyPair(p: bigint, g: bigint): { privateKey: bigint; publicKey: bigint } {
  const privateKey = BigInt(Math.floor(Math.random() * Number(p - 2n)) + 2);
  const publicKey = modPow(g, privateKey, p);
  return { privateKey, publicKey };
}

export function signSchnorr(message: string, privateKey: bigint, p: bigint, g: bigint): SchnorrSignature {
  const k = BigInt(Math.floor(Math.random() * Number(p - 2n)) + 2);
  const r = modPow(g, k, p);
  const e = BigInt('0x' + sha256(message + r.toString())) % p;
  const s = (k - privateKey * e) % (p - 1n);
  return { r, s: s < 0n ? s + (p - 1n) : s };
}

export function verifySchnorr(message: string, signature: SchnorrSignature, publicKey: bigint, p: bigint, g: bigint): boolean {
  const { r, s } = signature;
  const e = BigInt('0x' + sha256(message + r.toString())) % p;
  const left = (modPow(g, s, p) * modPow(publicKey, e, p)) % p;
  return left === r;
}