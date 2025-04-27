import { isPrime } from './euclid';
import { sha256 } from './sha256';

export interface DHDetails {
  P: bigint;
  G: bigint;
  privateKey: bigint;
  publicKey: bigint;
  otherPublicKey: bigint;
  sharedSecret: bigint;
  steps: string[];
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
  const factors: bigint[] = [];
  let n = phi;
  for (let i = 2n; i * i <= n; i++) {
    if (n % i === 0n) {
      factors.push(i);
      while (n % i === 0n) n /= i;
    }
  }
  if (n > 1n) factors.push(n);

  for (let g = 2n; g < p; g++) {
    let isPrimitive = true;
    for (const factor of factors) {
      if (modPow(g, phi / factor, p) === 1n) {
        isPrimitive = false;
        break;
      }
    }
    if (isPrimitive) return g;
  }
  throw new Error('Không tìm thấy căn nguyên thủy');
}

export interface DHParameters {
  P: bigint;
  G: bigint;
}

export function generateDHParameters(P: bigint): DHParameters {
  if (!isPrime(P)) throw new Error('P phải là số nguyên tố');
  const G = findPrimitiveRoot(P);
  return { P, G };
}

export interface DHKeyPair {
  publicKey: bigint;
  privateKey: bigint;
}

export function generateDHKeyPair(params: DHParameters, privateKey: bigint): DHKeyPair {
  const { P } = params;
  if (privateKey < 2n || privateKey >= P - 2n) {
    throw new Error('Khóa riêng phải nằm trong khoảng từ 2 đến P-2');
  }
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
    keyBytes[i] = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
  }
  return keyBytes;
}

export function performDHExchange(params: DHParameters, privateKeyA: bigint, privateKeyB: bigint
): { keyPairA: DHKeyPair; keyPairB: DHKeyPair; sharedSecret: bigint; details: DHDetails } {
  const keyPairA = generateDHKeyPair(params, privateKeyA);
  const keyPairB = generateDHKeyPair(params, privateKeyB);
  const sharedSecretA = computeDHSharedSecret(params, privateKeyA, keyPairB.publicKey);
  const sharedSecretB = computeDHSharedSecret(params, privateKeyB, keyPairA.publicKey);

  if (sharedSecretA !== sharedSecretB) throw new Error('Bí mật chung không khớp!');

  const steps: string[] = [];
  steps.push(`Bước\\ 1: Alice\\ và\\ Bob\\ lấy\\ số\\ công\\ khai\\ P = ${params.P},\\ G = ${params.G}`);
  steps.push(`Bước\\ 2: Alice\\ chọn\\ khóa\\ riêng\\ a = ${privateKeyA},\\ Bob\\ chọn\\ khóa\\ riêng\\ b = ${privateKeyB}`);
  steps.push(
    `Bước\\ 3: Alice\\ tính\\ x = (G^a \\mod P) = (${params.G}^{${privateKeyA}} \\mod ${params.P}) = ${keyPairA.publicKey},\\ ` +
    `Bob\\ tính\\ y = (G^b \\mod P) = (${params.G}^{${privateKeyB}} \\mod ${params.P}) = ${keyPairB.publicKey}`
  );
  steps.push(`Bước\\ 4: Alice\\ và\\ Bob\\ trao\\ đổi\\ số\\ công\\ khai`);
  steps.push(
    `Bước\\ 5: Alice\\ nhận\\ khóa\\ công\\ khai\\ của\\ Bob\\ y = ${keyPairB.publicKey},\\ ` +
    `Bob\\ nhận\\ khóa\\ công\\ khai\\ của\\ Alice\\ x = ${keyPairA.publicKey}`
  );
  steps.push(
    `Bước\\ 6: Alice\\ tính\\ k_A = (y^a \\mod P) = (${keyPairB.publicKey}^{${privateKeyA}} \\mod ${params.P}) = ${sharedSecretA},\\ ` +
    `Bob\\ tính\\ k_B = (x^b \\mod P) = (${keyPairA.publicKey}^{${privateKeyB}} \\mod ${params.P}) = ${sharedSecretB}`
  );
  steps.push(`Bước\\ 7: Khóa\\ bí\\ mật\\ được\\ chia\\ sẻ:\\ ${sharedSecretA}`);

  const details: DHDetails = {
    P: params.P,
    G: params.G,
    privateKey: privateKeyA,
    publicKey: keyPairA.publicKey,
    otherPublicKey: keyPairB.publicKey,
    sharedSecret: sharedSecretA,
    steps,
  };

  return { keyPairA, keyPairB, sharedSecret: sharedSecretA, details };
}