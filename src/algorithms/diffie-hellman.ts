import { isPrime } from './euclid';
import { sha256 } from './sha256';

export interface DHDetails {
  P: bigint;
  G: bigint;
  privateKey: bigint;
  publicKey: bigint;
  otherPublicKey: bigint;
  sharedSecret: bigint;
}

export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exponent >>= 1n;
  }
  return result;
}

function findPrimitiveRoot(p: bigint): bigint {
  if (!isPrime(p)) throw new Error('P phải là số nguyên tố');
  const phi = p - 1n;
  let g = 2n;
  while (g < p) {
    let isPrimitive = true;
    for (let i = 2n; i * i <= phi; i++) {
      if (phi % i === 0n) {
        if (modPow(g, phi / i, p) === 1n) {
          isPrimitive = false;
          break;
        }
        if (modPow(g, i, p) === 1n) {
          isPrimitive = false;
          break;
        }
      }
    }
    if (isPrimitive) return g;
    g++;
  }
  throw new Error('Không tìm thấy căn nguyên thủy');
}

export interface DHParameters {
  P: bigint;
  G: bigint;
}

interface DHKeyPair {
  publicKey: bigint;
  privateKey: bigint;
}

const DH_PRIME = BigInt((import.meta as any).env.VITE_DH_PRIME || '23');

export function generateDHParameters(): DHParameters {
  const P = DH_PRIME;
  if (!isPrime(P)) throw new Error('P phải là số nguyên tố');
  const G = findPrimitiveRoot(P);
  return { P, G };
}

export function generateDHKeyPair(params: DHParameters): DHKeyPair {
  const { P } = params;
  const privateKey = BigInt(Math.floor(Math.random() * Number(P - 2n)) + 2);
  const publicKey = modPow(params.G, privateKey, P);
  return { publicKey, privateKey };
}

export function computeDHSharedSecret(
  params: DHParameters,
  privateKey: bigint,
  otherPublicKey: bigint
): bigint {
  return modPow(otherPublicKey, privateKey, params.P);
}

export function deriveAESKey(sharedSecret: bigint): Uint8Array {
  const hash = sha256(sharedSecret.toString());
  const keyBytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    keyBytes[i] = parseInt(hash.substr(i * 2, 2), 16);
  }
  return keyBytes;
}

export function performDHExchange(params: DHParameters, otherPublicKey: bigint): { keyPair: DHKeyPair; sharedSecret: bigint; details: DHDetails } {
  const keyPair = generateDHKeyPair(params);
  const sharedSecret = computeDHSharedSecret(params, keyPair.privateKey, otherPublicKey);
  const details: DHDetails = {
    P: params.P,
    G: params.G,
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
    otherPublicKey,
    sharedSecret,
  };
  return { keyPair, sharedSecret, details };
}