import { useState, useEffect } from 'react';
import { aesEncrypt, aesDecrypt, AesRound } from '../algorithms/aes128bit';
import katex from 'katex';

export default function Aes128UI() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState('');
  const [rounds, setRounds] = useState<AesRound[]>([]);
  const [showRounds, setShowRounds] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setResult('');
    setRounds([]);
    setShowRounds(false);
    try {
      if (!text) throw new Error('Vui lòng nhập văn bản!');
      if (key.length !== 32) throw new Error('Khóa phải dài đúng 32 ký tự!');
      if (!/^[0-9A-Fa-f]*$/.test(text)) throw new Error('Văn bản phải là chuỗi hex!');
      if (!/^[0-9A-Fa-f]*$/.test(key)) throw new Error('Khóa phải là chuỗi hex!');

      const textBytes = new Uint8Array((text.match(/.{1,2}/g) || []).map(byte => parseInt(byte, 16)));
      const keyBytes = new Uint8Array((key.match(/.{1,2}/g) || []).map(byte => parseInt(byte, 16)));

      if (mode === 'encrypt') {
        const { ciphertext, rounds } = aesEncrypt(textBytes, keyBytes);
        setResult(
          Array.from(ciphertext)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        );
        setRounds(rounds.slice(0, 11));
      } else {
        if (text.length % 32 !== 0) throw new Error('Văn bản giải mã phải có độ dài là bội của 32 ký tự!');
        const { plaintext, rounds } = aesDecrypt(textBytes, keyBytes);
        setResult(
          Array.from(plaintext)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        );
        setRounds(rounds.slice(0, 11));
      }
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi!');
    }
  };

  // Hàm chuyển đổi chuỗi hex của trạng thái (row-major) thành chuỗi hex tuyến tính
  const stateHexToLinearHex = (hex: string): string => {
    if (!hex) return '';
    const grid: string[][] = Array(4).fill(0).map(() => Array(4).fill(''));
    let index = 0;
    // Điền chuỗi hex vào ma trận theo thứ tự hàng (như cách stateToHex tạo ra)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (index < hex.length) {
          grid[i][j] = hex.slice(index, index + 2);
          index += 2;
        }
      }
    }
    // Đọc ma trận theo thứ tự cột để tạo chuỗi hex tuyến tính
    let result = '';
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        result += grid[i][j];
      }
    }
    return result;
  };

  const hexToGrid = (hex: string): string[][] => {
    const grid: string[][] = Array(4).fill(0).map(() => Array(4).fill(''));
    let index = 0;
    // Điền chuỗi hex vào ma trận theo thứ tự cột
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        if (index < hex.length) {
          grid[i][j] = hex.slice(index, index + 2);
          index += 2;
        }
      }
    }
    return grid;
  };

  useEffect(() => {
    document.querySelectorAll('.math').forEach((element) => {
      katex.render(element.textContent || '', element as HTMLElement, {
        throwOnError: false,
      });
    });
  }, [showRounds]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Mã hóa AES-128</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Văn bản (hex)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập chuỗi hex"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Khóa (32 ký tự hex)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Nhập khóa (32 ký tự hex)"
          />
        </div>
        <div className="flex gap-4">
          <button
            className={`btn-secondary ${mode === 'encrypt' ? 'btn-active' : ''}`}
            onClick={() => setMode('encrypt')}
          >
            Mã hóa
          </button>
          <button
            className={`btn-secondary ${mode === 'decrypt' ? 'btn-active' : ''}`}
            onClick={() => setMode('decrypt')}
          >
            Giải mã
          </button>
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Xử lý
        </button>
        {error && <p className="error-box">{error}</p>}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kết quả</label>
            <div className="output-box">{result}</div>
            <button
              className="btn-secondary mt-4"
              onClick={() => setShowRounds(!showRounds)}
            >
              {showRounds ? 'Ẩn chi tiết' : 'Xem chi tiết'}
            </button>
          </div>
        )}
        {showRounds && rounds.length > 0 && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Chi tiết các vòng</label>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-200 p-3 text-left">Round Number</th>
                    <th className="border border-gray-200 p-3 text-left">Start of Round</th>
                    <th className="border border-gray-200 p-3 text-left">After SubBytes</th>
                    <th className="border border-gray-200 p-3 text-left">After ShiftRows</th>
                    <th className="border border-gray-200 p-3 text-left">After MixColumns</th>
                    <th className="border border-gray-200 p-3 text-center">
                      <span className="math">\oplus</span>
                    </th>
                    <th className="border border-gray-200 p-3 text-left">Round Key Value</th>
                    <th className="border border-gray-200 p-3 text-center">
                      <span className="math">=</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round) => (
                    <tr key={round.roundNumber} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3 text-center">{round.roundNumber}</td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(stateHexToLinearHex(round.startOfRound)).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm flex justify-center items-center"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(stateHexToLinearHex(round.afterSubBytes || '')).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm flex justify-center items-center"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(stateHexToLinearHex(round.afterShiftRows || '')).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm flex justify-center items-center"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(stateHexToLinearHex(round.afterMixColumns || '')).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm flex justify-center items-center"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        <span className="math">\oplus</span>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(round.roundKeyValue).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm flex justify-center items-center"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        <span className="math">=</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}