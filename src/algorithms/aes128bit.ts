const SBOX = new Uint8Array([
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]);

const INV_SBOX = new Uint8Array([
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
]);

const RCON = new Uint8Array([
  0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
]);

function stateToHex(state: Uint8Array): string {
  return Array.from(state).map(b => b.toString(16).padStart(2, '0')).join('');
}

function rotWord(w: number): number {
  return ((w << 8) | (w >>> 24)) >>> 0;
}

function subWord(w: number): number {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    const byte = (w >>> (24 - i * 8)) & 0xff;
    result = (result << 8) | SBOX[byte];
  }
  return result >>> 0;
}

function xorRcon(w: number, j: number): number {
  const rcon = RCON[j] << 24;
  return (w ^ rcon) >>> 0;
}

function g(w: number, j: number): number {
  const rotW = rotWord(w);
  const subW = subWord(rotW);
  return xorRcon(subW, j);
}

function keyExpansion(key: Uint8Array): Uint32Array {
  const w = new Uint32Array(44);
  for (let i = 0; i < 4; i++) {
    w[i] = (
      (key[i * 4] << 24) |
      (key[i * 4 + 1] << 16) |
      (key[i * 4 + 2] << 8) |
      key[i * 4 + 3]
    ) >>> 0;
  }

  for (let i = 4; i < 44; i++) {
    let temp = w[i - 1];
    if (i % 4 === 0) {
      temp = g(temp, i / 4);
    }
    w[i] = (w[i - 4] ^ temp) >>> 0;
  }
  return w;
}

function addRoundKey(state: Uint32Array, roundKey: Uint32Array, round: number): void {
  for (let i = 0; i < 4; i++) {
    state[i] ^= roundKey[round * 4 + i];
  }
}

function subBytes(state: Uint32Array): Uint32Array {
  const result = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    let word = 0;
    for (let j = 0; j < 4; j++) {
      const byte = (state[i] >>> (24 - j * 8)) & 0xff;
      word = (word << 8) | SBOX[byte];
    }
    result[i] = word >>> 0;
  }
  return result;
}

function invSubBytes(state: Uint32Array): Uint32Array {
  const result = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    let word = 0;
    for (let j = 0; j < 4; j++) {
      const byte = (state[i] >>> (24 - j * 8)) & 0xff;
      word = (word << 8) | INV_SBOX[byte];
    }
    result[i] = word >>> 0;
  }
  return result;
}

function shiftRows(state: Uint32Array): Uint32Array {
  const result = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    const byte1 = (state[i] >>> 24) & 0xff;
    const byte2 = (state[(i + 1) % 4] >>> 16) & 0xff;
    const byte3 = (state[(i + 2) % 4] >>> 8) & 0xff;
    const byte4 = state[(i + 3) % 4] & 0xff;
    result[i] = (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;
  }
  return result;
}

function invShiftRows(state: Uint32Array): Uint32Array {
  const result = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    const byte1 = (state[i] >>> 24) & 0xff;
    const byte2 = (state[(i + 3) % 4] >>> 16) & 0xff;
    const byte3 = (state[(i + 2) % 4] >>> 8) & 0xff;
    const byte4 = state[(i + 1) % 4] & 0xff;
    result[i] = (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;
  }
  return result;
}

function nhan2(w: number): number {
  let result = w << 1;
  if (w & 0x80) result ^= 0x1b;
  return result & 0xff;
}

function nhan3(w: number): number {
  return nhan2(w) ^ w;
}

function nhan9(w: number): number {
  return (nhan2(nhan2(nhan2(w))) ^ w) & 0xff;
}

function nhanB(w: number): number {
  return (nhan2(nhan2(nhan2(w))) ^ nhan2(w) ^ w) & 0xff;
}

function nhanD(w: number): number {
  return (nhan2(nhan2(nhan2(w))) ^ nhan2(nhan2(w)) ^ w) & 0xff;
}

function nhanE(w: number): number {
  return (nhan2(nhan2(nhan2(w))) ^ nhan2(nhan2(w)) ^ nhan2(w)) & 0xff;
}

function nhanCot(w: number): number {
  const byte1 = (w >>> 24) & 0xff;
  const byte2 = (w >>> 16) & 0xff;
  const byte3 = (w >>> 8) & 0xff;
  const byte4 = w & 0xff;

  const kq1 = nhan2(byte1) ^ nhan3(byte2) ^ byte3 ^ byte4;
  const kq2 = byte1 ^ nhan2(byte2) ^ nhan3(byte3) ^ byte4;
  const kq3 = byte1 ^ byte2 ^ nhan2(byte3) ^ nhan3(byte4);
  const kq4 = nhan3(byte1) ^ byte2 ^ byte3 ^ nhan2(byte4);

  return (kq1 << 24) | (kq2 << 16) | (kq3 << 8) | kq4;
}

function invNhanCot(w: number): number {
  const byte1 = (w >>> 24) & 0xff;
  const byte2 = (w >>> 16) & 0xff;
  const byte3 = (w >>> 8) & 0xff;
  const byte4 = w & 0xff;

  const kq1 = nhanE(byte1) ^ nhanB(byte2) ^ nhanD(byte3) ^ nhan9(byte4);
  const kq2 = nhan9(byte1) ^ nhanE(byte2) ^ nhanB(byte3) ^ nhanD(byte4);
  const kq3 = nhanD(byte1) ^ nhan9(byte2) ^ nhanE(byte3) ^ nhanB(byte4);
  const kq4 = nhanB(byte1) ^ nhanD(byte2) ^ nhan9(byte3) ^ nhanE(byte4);

  return (kq1 << 24) | (kq2 << 16) | (kq3 << 8) | kq4;
}

function mixColumns(state: Uint32Array): Uint32Array {
  const result = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    result[i] = nhanCot(state[i]);
  }
  return result;
}

function invMixColumns(state: Uint32Array): Uint32Array {
  const result = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    result[i] = invNhanCot(state[i]);
  }
  return result;
}

function bytesToState(bytes: Uint8Array): Uint32Array {
  const state = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    state[i] = (
      (bytes[i * 4] << 24) |
      (bytes[i * 4 + 1] << 16) |
      (bytes[i * 4 + 2] << 8) |
      bytes[i * 4 + 3]
    ) >>> 0;
  }
  return state;
}

function stateToBytes(state: Uint32Array): Uint8Array {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 4; i++) {
    bytes[i * 4] = (state[i] >>> 24) & 0xff;
    bytes[i * 4 + 1] = (state[i] >>> 16) & 0xff;
    bytes[i * 4 + 2] = (state[i] >>> 8) & 0xff;
    bytes[i * 4 + 3] = state[i] & 0xff;
  }
  return bytes;
}

function pad(plaintext: Uint8Array): Uint8Array {
  const paddingLen = 16 - (plaintext.length % 16) || 16;
  const padded = new Uint8Array(plaintext.length + paddingLen);
  padded.set(plaintext);
  for (let i = plaintext.length; i < padded.length; i++) {
    padded[i] = paddingLen;
  }
  return padded;
}

function unpad(plaintext: Uint8Array): Uint8Array {
  const paddingLen = plaintext[plaintext.length - 1];
  if (paddingLen > 16 || paddingLen === 0) {
    throw new Error('Invalid padding');
  }
  for (let i = plaintext.length - paddingLen; i < plaintext.length; i++) {
    if (plaintext[i] !== paddingLen) {
      throw new Error('Invalid padding');
    }
  }
  return plaintext.slice(0, plaintext.length - paddingLen);
}

export interface AesRound {
  roundNumber: number;
  startOfRound: string;
  afterSubBytes: string;
  afterShiftRows: string;
  afterMixColumns: string;
  roundKeyValue: string;
}

export function aesEncrypt(plaintext: Uint8Array, key: Uint8Array): { ciphertext: Uint8Array; rounds: AesRound[] } {
  if (key.length !== 16) throw new Error('Khóa AES phải dài 128 bit (16 byte)');
  const padded = pad(plaintext);
  const expandedKey = keyExpansion(key);
  const ciphertext = new Uint8Array(padded.length);
  const rounds: AesRound[] = [];

  for (let block = 0; block < padded.length; block += 16) {
    let state = bytesToState(padded.slice(block, block + 16));

    rounds.push({
      roundNumber: 0,
      startOfRound: stateToHex(stateToBytes(state)),
      afterSubBytes: '',
      afterShiftRows: '',
      afterMixColumns: '',
      roundKeyValue: stateToHex(stateToBytes(expandedKey.slice(0, 4))),
    });

    addRoundKey(state, expandedKey, 0);
    for (let round = 1; round < 10; round++) {
      const roundStart = state.slice();
      state = subBytes(state);
      const afterSub = state.slice();
      state = shiftRows(state);
      const afterShift = state.slice();
      state = mixColumns(state);
      const afterMix = state.slice();
      addRoundKey(state, expandedKey, round);

      rounds.push({
        roundNumber: round,
        startOfRound: stateToHex(stateToBytes(roundStart)),
        afterSubBytes: stateToHex(stateToBytes(afterSub)),
        afterShiftRows: stateToHex(stateToBytes(afterShift)),
        afterMixColumns: stateToHex(stateToBytes(afterMix)),
        roundKeyValue: stateToHex(stateToBytes(expandedKey.slice(round * 4, (round + 1) * 4))),
      });
    }
    const roundStart = state.slice();
    state = subBytes(state);
    const afterSub = state.slice();
    state = shiftRows(state);
    const afterShift = state.slice();
    addRoundKey(state, expandedKey, 10);

    rounds.push({
      roundNumber: 10,
      startOfRound: stateToHex(stateToBytes(roundStart)),
      afterSubBytes: stateToHex(stateToBytes(afterSub)),
      afterShiftRows: stateToHex(stateToBytes(afterShift)),
      afterMixColumns: '',
      roundKeyValue: stateToHex(stateToBytes(expandedKey.slice(10 * 4, 11 * 4))),
    });

    ciphertext.set(stateToBytes(state), block);
  }

  return { ciphertext, rounds };
}

export function aesDecrypt(ciphertext: Uint8Array, key: Uint8Array): { plaintext: Uint8Array; rounds: AesRound[] } {
  if (key.length !== 16) throw new Error('Khóa AES phải dài 128 bit (16 byte)');
  if (ciphertext.length % 16 !== 0) throw new Error('Dữ liệu mã hóa không hợp lệ');

  const expandedKey = keyExpansion(key);
  const plaintext = new Uint8Array(ciphertext.length);
  const rounds: AesRound[] = [];

  for (let block = 0; block < ciphertext.length; block += 16) {
    let state = bytesToState(ciphertext.slice(block, block + 16));

    rounds.push({
      roundNumber: 10,
      startOfRound: stateToHex(stateToBytes(state)),
      afterSubBytes: '',
      afterShiftRows: '',
      afterMixColumns: '',
      roundKeyValue: stateToHex(stateToBytes(expandedKey.slice(10 * 4, 11 * 4))),
    });

    addRoundKey(state, expandedKey, 10);
    for (let round = 9; round > 0; round--) {
      const roundStart = state.slice();
      state = invShiftRows(state);
      const afterShift = state.slice();
      state = invSubBytes(state);
      const afterSub = state.slice();
      addRoundKey(state, expandedKey, round);
      const afterAdd = state.slice();
      state = invMixColumns(state);

      rounds.push({
        roundNumber: round,
        startOfRound: stateToHex(stateToBytes(roundStart)),
        afterSubBytes: stateToHex(stateToBytes(afterSub)),
        afterShiftRows: stateToHex(stateToBytes(afterShift)),
        afterMixColumns: stateToHex(stateToBytes(afterAdd)),
        roundKeyValue: stateToHex(stateToBytes(expandedKey.slice(round * 4, (round + 1) * 4))),
      });
    }
    const roundStart = state.slice();
    state = invShiftRows(state);
    const afterShift = state.slice();
    state = invSubBytes(state);
    const afterSub = state.slice();
    addRoundKey(state, expandedKey, 0);

    rounds.push({
      roundNumber: 0,
      startOfRound: stateToHex(stateToBytes(roundStart)),
      afterSubBytes: stateToHex(stateToBytes(afterSub)),
      afterShiftRows: stateToHex(stateToBytes(afterShift)),
      afterMixColumns: '',
      roundKeyValue: stateToHex(stateToBytes(expandedKey.slice(0, 4))),
    });

    plaintext.set(stateToBytes(state), block);
  }

  return { plaintext: unpad(plaintext), rounds };
}