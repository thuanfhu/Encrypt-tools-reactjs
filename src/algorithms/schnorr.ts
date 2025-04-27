import { modPow } from './diffie-hellman';
import { sha256 } from './sha256';

// Định nghĩa cấu trúc chữ ký Schnorr
export interface SchnorrSignature {
  e: bigint; // e = H(M || x)
  y: bigint; // y = (r + s * e) mod q
}

// Thuật toán Miller-Rabin để kiểm tra số nguyên tố
function isPrime(n: bigint, k: number = 5): boolean {
  if (n <= 1n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  // Tìm d và s sao cho n-1 = d * 2^s
  let d = n - 1n;
  let s = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1n;
  }

  // Test Miller-Rabin
  for (let i = 0; i < k; i++) {
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 4n))); // Random [2, n-2]
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let continueOuter = false;
    for (let r = 0n; r < s - 1n; r++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        continueOuter = true;
        break;
      }
    }
    if (continueOuter) continue;
    return false;
  }
  return true;
}

// Kiểm tra xem a có phải là căn nguyên thủy bậc q modulo p không
function isValidGenerator(a: bigint, p: bigint, q: bigint): boolean {
  if (a <= 1n || a >= p) return false;
  if (modPow(a, q, p) !== 1n) return false;
  // Đảm bảo a có bậc đúng bằng q
  for (let i = 1n; i < q; i++) {
    if (modPow(a, i, p) === 1n) return false;
  }
  return true;
}

// Tạo số ngẫu nhiên an toàn trong khoảng [0, max-1]
function getSecureRandom(max: bigint, fixedValue?: bigint): bigint {
  if (fixedValue !== undefined && fixedValue >= 0n && fixedValue < max) {
    return fixedValue; // Dùng giá trị cố định cho test
  }
  const byteLength = (max.toString(2).length + 7) >> 3;
  let rand;
  do {
    const buf = new Uint8Array(byteLength);
    crypto.getRandomValues(buf);
    rand = BigInt('0x' + Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')) % max;
  } while (rand === 0n);
  return rand;
}

// Bước 2: Tạo cặp khóa (Key Generation)
export function generateKeyPair(
  p: bigint,
  a: bigint,
  q: bigint,
  fixedPrivateKey?: bigint
): { privateKey: bigint; publicKey: bigint } {
  if (!isPrime(p)) throw new Error('p must be a prime number');
  if (!isPrime(q) || (p - 1n) % q !== 0n) throw new Error('q must be a prime number and q | p-1');
  if (!isValidGenerator(a, p, q)) throw new Error('a must be a primitive root of order q modulo p');

  const s = getSecureRandom(q, fixedPrivateKey); // s (privateKey): 0 <= s < q
  const v = modPow(a, q - s, p); // v (publicKey): v = a^(-s) mod p = a^(q-s) mod p
  return { privateKey: s, publicKey: v };
}

// Bước 3: Ký tin nhắn (Sign Message)
export function signMessage(
  message: string,
  privateKey: bigint,
  p: bigint,
  a: bigint,
  q: bigint,
  fixedR?: bigint
): SchnorrSignature {
  if (!isPrime(p)) throw new Error('p must be a prime number');
  if (!isPrime(q) || (p - 1n) % q !== 0n) throw new Error('q must be a prime number and q | p-1');
  if (!isValidGenerator(a, p, q)) throw new Error('a must be a primitive root of order q modulo p');
  if (privateKey < 0n || privateKey >= q) throw new Error('Private key (s) must be in [0, q-1]');

  const r = getSecureRandom(q, fixedR); // r: 0 <= r < q
  const x = modPow(a, r, p); // x = a^r mod p
  const e = BigInt('0x' + sha256(message + '|' + x.toString())) % q; // e = H(M || x)
  const y = (r + privateKey * e) % q; // y = (r + s * e) mod q
  return { e, y };
}

// Bước 4: Xác minh chữ ký (Verify Signature)
export function verifySignature(
  signature: SchnorrSignature,
  publicKey: bigint,
  message: string,
  p: bigint,
  a: bigint,
  q: bigint
): { isValid: boolean; xPrime: bigint } {
  const { e, y } = signature;
  if (!isPrime(p)) throw new Error('p must be a prime number');
  if (!isPrime(q) || (p - 1n) % q !== 0n) throw new Error('q must be a prime number and q | p-1');
  if (!isValidGenerator(a, p, q)) throw new Error('a must be a primitive root of order q modulo p');
  if (y < 0n || y >= q) throw new Error('y must be in [0, q-1]');
  if (publicKey <= 0n || publicKey >= p) throw new Error('Public key (v) must be in [1, p-1]');

  const xPrime = (modPow(a, y, p) * modPow(publicKey, e, p)) % p; // x' = a^y * v^e mod p
  const ePrime = BigInt('0x' + sha256(message + '|' + xPrime.toString())) % q; // e' = H(M || x')
  return { isValid: ePrime === e, xPrime };
}