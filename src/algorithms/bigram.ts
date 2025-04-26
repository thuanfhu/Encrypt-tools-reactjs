export function generateBigramTable(key: string): string[][] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .,-';
  const table: string[][] = Array(5)
    .fill(0)
    .map(() => Array(6).fill(''));
  const used = new Set<string>();
  let row = 0,
    col = 0;

  const cleanKey = key.toUpperCase().replace(/[^A-Z .,-]/g, '');
  for (const char of cleanKey) {
    if (!used.has(char)) {
      table[row][col] = char;
      used.add(char);
      col++;
      if (col === 6) {
        col = 0;
        row++;
      }
    }
  }

  for (const char of alphabet) {
    if (!used.has(char)) {
      table[row][col] = char;
      used.add(char);
      col++;
      if (col === 6) {
        col = 0;
        row++;
      }
    }
  }

  return table;
}

export function findPosition(table: string[][], char: string): [number, number] {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      if (table[i][j] === char) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

export function bigramEncrypt(
  plaintext: string,
  key: string
): { ciphertext: string; duplicates: string[]; isPadded: boolean } {
  const table = generateBigramTable(key);
  let cleanText = plaintext.toUpperCase().replace(/[^A-Z .,-]/g, '');
  const duplicates: string[] = [];
  let isPadded = false;

  if (cleanText.length % 2 !== 0) {
    cleanText += ' ';
    isPadded = true;
  }

  let ciphertext = '';
  for (let i = 0; i < cleanText.length; i += 2) {
    const char1 = cleanText[i];
    const char2 = cleanText[i + 1];
    const [row1, col1] = findPosition(table, char1);
    const [row2, col2] = findPosition(table, char2);

    if (char1 === char2) {
      duplicates.push(char1 + char2);
      const newRow = row1 === 4 ? 0 : row1 + 1;
      ciphertext += table[newRow][col1] + table[newRow][col1];
    } else if (col1 === col2) {
      const newRow1 = row1 === 4 ? 0 : row1 + 1;
      const newRow2 = row2 === 4 ? 0 : row2 + 1;
      ciphertext += table[newRow1][col1] + table[newRow2][col2];
    } else if (row1 === row2) {
      const newCol1 = col1 === 5 ? 0 : col1 + 1;
      const newCol2 = col2 === 5 ? 0 : col2 + 1;
      ciphertext += table[row1][newCol1] + table[row2][newCol2];
    } else {
      ciphertext += table[row1][col2] + table[row2][col1];
    }
  }

  return { ciphertext, duplicates, isPadded };
}

export function bigramDecrypt(
  ciphertext: string,
  key: string,
  isPadded: boolean
): string {
  const table = generateBigramTable(key);
  let plaintext = '';

  for (let i = 0; i < ciphertext.length; i += 2) {
    const char1 = ciphertext[i];
    const char2 = ciphertext[i + 1];
    const [row1, col1] = findPosition(table, char1);
    const [row2, col2] = findPosition(table, char2);

    // Kiểm tra xem cặp ký tự có phải là kết quả của cặp trùng không
    if (char1 === char2) {
      const newRow = row1 === 0 ? 4 : row1 - 1;
      plaintext += table[newRow][col1] + table[newRow][col1];
    } else if (col1 === col2) {
      const newRow1 = row1 === 0 ? 4 : row1 - 1;
      const newRow2 = row2 === 0 ? 4 : row2 - 1;
      plaintext += table[newRow1][col1] + table[newRow2][col2];
    } else if (row1 === row2) {
      const newCol1 = col1 === 0 ? 5 : col1 - 1;
      const newCol2 = col2 === 0 ? 5 : col2 - 1;
      plaintext += table[row1][newCol1] + table[row2][newCol2];
    } else {
      plaintext += table[row1][col2] + table[row2][col1];
    }
  }

  if (isPadded && plaintext.endsWith(' ')) {
    plaintext = plaintext.slice(0, -1);
  }

  return plaintext;
}

export function displayBigramTable(key: string): string[][] {
  return generateBigramTable(key);
}