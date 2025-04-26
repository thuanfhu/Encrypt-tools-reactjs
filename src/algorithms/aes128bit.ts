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
  0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
]);

function stateToHex(state: Uint8Array): string {
  return Array.from(state).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

function subBytes(state: Uint8Array): void {
  for (let i = 0; i < 16; i++) {
    state[i] = SBOX[state[i]];
  }
}

function invSubBytes(state: Uint8Array): void {
  for (let i = 0; i < 16; i++) {
    state[i] = INV_SBOX[state[i]];
  }
}

function shiftRows(state: Uint8Array): void {
  const temp = new Uint8Array(16);
  temp.set(state);

  state[1] = temp[5];
  state[5] = temp[9];
  state[9] = temp[13];
  state[13] = temp[1];

  state[2] = temp[10];
  state[6] = temp[14];
  state[10] = temp[2];
  state[14] = temp[6];

  state[3] = temp[15];
  state[7] = temp[3];
  state[11] = temp[7];
  state[15] = temp[11];
}

function invShiftRows(state: Uint8Array): void {
  const temp = new Uint8Array(16);
  temp.set(state);

  state[1] = temp[13];
  state[5] = temp[1];
  state[9] = temp[5];
  state[13] = temp[9];

  state[2] = temp[10];
  state[6] = temp[14];
  state[10] = temp[2];
  state[14] = temp[6];

  state[3] = temp[7];
  state[7] = temp[11];
  state[11] = temp[15];
  state[15] = temp[3];
}

function mixColumns(state: Uint8Array): void {
  for (let c = 0; c < 4; c++) {
    const a0 = state[4 * c];
    const a1 = state[4 * c + 1];
    const a2 = state[4 * c + 2];
    const a3 = state[4 * c + 3];

    state[4 * c] = (mul2(a0) ^ mul3(a1) ^ a2 ^ a3);
    state[4 * c + 1] = (a0 ^ mul2(a1) ^ mul3(a2) ^ a3);
    state[4 * c + 2] = (a0 ^ a1 ^ mul2(a2) ^ mul3(a3));
    state[4 * c + 3] = (mul3(a0) ^ a1 ^ a2 ^ mul2(a3));
  }
}

function invMixColumns(state: Uint8Array): void {
  for (let c = 0; c < 4; c++) {
    const a0 = state[4 * c];
    const a1 = state[4 * c + 1];
    const a2 = state[4 * c + 2];
    const a3 = state[4 * c + 3];

    state[4 * c] = (mul14(a0) ^ mul11(a1) ^ mul13(a2) ^ mul9(a3));
    state[4 * c + 1] = (mul9(a0) ^ mul14(a1) ^ mul11(a2) ^ mul13(a3));
    state[4 * c + 2] = (mul13(a0) ^ mul9(a1) ^ mul14(a2) ^ mul11(a3));
    state[4 * c + 3] = (mul11(a0) ^ mul13(a1) ^ mul9(a2) ^ mul14(a3));
  }
}

function mul2(x: number): number {
  return ((x << 1) ^ (((x >> 7) & 1) * 0x1b)) & 0xff;
}

function mul3(x: number): number {
  return mul2(x) ^ x;
}

function mul9(x: number): number {
  return mul2(mul2(mul2(x))) ^ x;
}

function mul11(x: number): number {
  return mul2(mul2(mul2(x))) ^ mul2(x) ^ x;
}

function mul13(x: number): number {
  return mul2(mul2(mul2(x))) ^ mul2(mul2(x)) ^ x;
}

function mul14(x: number): number {
  return mul2(mul2(mul2(x))) ^ mul2(mul2(x)) ^ mul2(x);
}

function addRoundKey(state: Uint8Array, roundKey: Uint8Array, offset: number): void {
  for (let i = 0; i < 16; i++) {
    state[i] ^= roundKey[offset + i];
  }
}

function expandKey(key: Uint8Array): Uint8Array {
  const expandedKey = new Uint8Array(176);
  expandedKey.set(key);

  for (let i = 16; i < 176; i += 4) {
    let temp = expandedKey.slice(i - 4, i);
    if (i % 16 === 0) {
      temp = new Uint8Array([temp[1], temp[2], temp[3], temp[0]]);
      for (let j = 0; j < 4; j++) {
        temp[j] = SBOX[temp[j]];
      }
      temp[0] ^= RCON[(i / 16) - 1];
    }
    for (let j = 0; j < 4; j++) {
      expandedKey[i + j] = expandedKey[i - 16 + j] ^ temp[j];
    }
  }
  return expandedKey;
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

export function aesEncrypt(plaintext: Uint8Array, key: Uint8Array, iv: Uint8Array): { ciphertext: Uint8Array; rounds: AesRound[] } {
  if (key.length !== 16) throw new Error('Khóa AES phải dài 128 bit (16 byte)');
  if (iv.length !== 16) throw new Error('IV phải dài 128 bit (16 byte)');

  const padded = pad(plaintext);
  const expandedKey = expandKey(key);
  const ciphertext = new Uint8Array(padded.length);
  const rounds: AesRound[] = [];
  let previousBlock = iv.slice();

  for (let block = 0; block < padded.length; block += 16) {
    const state = new Uint8Array(16);
    state.set(padded.slice(block, block + 16));

    for (let i = 0; i < 16; i++) {
      state[i] ^= previousBlock[i];
    }

    rounds.push({
      roundNumber: 0,
      startOfRound: stateToHex(state),
      afterSubBytes: '',
      afterShiftRows: '',
      afterMixColumns: '',
      roundKeyValue: stateToHex(expandedKey.slice(0, 16)),
    });

    addRoundKey(state, expandedKey, 0);
    for (let round = 1; round < 10; round++) {
      const roundStart = state.slice();
      subBytes(state);
      const afterSub = state.slice();
      shiftRows(state);
      const afterShift = state.slice();
      mixColumns(state);
      const afterMix = state.slice();
      addRoundKey(state, expandedKey, round * 16);

      rounds.push({
        roundNumber: round,
        startOfRound: stateToHex(roundStart),
        afterSubBytes: stateToHex(afterSub),
        afterShiftRows: stateToHex(afterShift),
        afterMixColumns: stateToHex(afterMix),
        roundKeyValue: stateToHex(expandedKey.slice(round * 16, (round + 1) * 16)),
      });
    }
    const roundStart = state.slice();
    subBytes(state);
    const afterSub = state.slice();
    shiftRows(state);
    const afterShift = state.slice();
    addRoundKey(state, expandedKey, 10 * 16);

    rounds.push({
      roundNumber: 10,
      startOfRound: stateToHex(roundStart),
      afterSubBytes: stateToHex(afterSub),
      afterShiftRows: stateToHex(afterShift),
      afterMixColumns: '',
      roundKeyValue: stateToHex(expandedKey.slice(10 * 16, 11 * 16)),
    });

    ciphertext.set(state, block);
    previousBlock = state.slice();
  }

  return { ciphertext, rounds };
}

export function aesDecrypt(ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array): { plaintext: Uint8Array; rounds: AesRound[] } {
  if (key.length !== 16) throw new Error('Khóa AES phải dài 128 bit (16 byte)');
  if (iv.length !== 16) throw new Error('IV phải dài 128 bit (16 byte)');
  if (ciphertext.length % 16 !== 0) throw new Error('Dữ liệu mã hóa không hợp lệ');

  const expandedKey = expandKey(key);
  const plaintext = new Uint8Array(ciphertext.length);
  const rounds: AesRound[] = [];
  let previousBlock = iv.slice();

  for (let block = 0; block < ciphertext.length; block += 16) {
    const state = new Uint8Array(16);
    state.set(ciphertext.slice(block, block + 16));
    const currentBlock = state.slice();

    rounds.push({
      roundNumber: 10,
      startOfRound: stateToHex(state),
      afterSubBytes: '',
      afterShiftRows: '',
      afterMixColumns: '',
      roundKeyValue: stateToHex(expandedKey.slice(10 * 16, 11 * 16)),
    });

    addRoundKey(state, expandedKey, 10 * 16);
    for (let round = 9; round > 0; round--) {
      const roundStart = state.slice();
      invShiftRows(state);
      const afterShift = state.slice();
      invSubBytes(state);
      const afterSub = state.slice();
      addRoundKey(state, expandedKey, round * 16);
      const afterAdd = state.slice();
      invMixColumns(state);

      rounds.push({
        roundNumber: round,
        startOfRound: stateToHex(roundStart),
        afterSubBytes: stateToHex(afterSub),
        afterShiftRows: stateToHex(afterShift),
        afterMixColumns: stateToHex(afterAdd),
        roundKeyValue: stateToHex(expandedKey.slice(round * 16, (round + 1) * 16)),
      });
    }
    const roundStart = state.slice();
    invShiftRows(state);
    const afterShift = state.slice();
    invSubBytes(state);
    const afterSub = state.slice();
    addRoundKey(state, expandedKey, 0);

    rounds.push({
      roundNumber: 0,
      startOfRound: stateToHex(roundStart),
      afterSubBytes: stateToHex(afterSub),
      afterShiftRows: stateToHex(afterShift),
      afterMixColumns: '',
      roundKeyValue: stateToHex(expandedKey.slice(0, 16)),
    });

    for (let i = 0; i < 16; i++) {
      state[i] ^= previousBlock[i];
    }

    plaintext.set(state, block);
    previousBlock = currentBlock;
  }

  return { plaintext: unpad(plaintext), rounds };
}