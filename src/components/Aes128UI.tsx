import { useState } from 'react';
import { aesEncrypt, aesDecrypt, AesRound } from '../algorithms/aes128bit';

export default function Aes128UI() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState('');
  const [rounds, setRounds] = useState<AesRound[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setResult('');
    setRounds([]);
    try {
      if (!text) throw new Error('Vui lòng nhập văn bản!');
      if (key.length !== 32) throw new Error('Khóa phải dài đúng 32 ký tự!');

      const textBytes = mode === 'encrypt'
        ? new TextEncoder().encode(text)
        : new Uint8Array((text.match(/.{1,2}/g) || []).map(byte => parseInt(byte, 16)));
      const keyBytes = new TextEncoder().encode(key.slice(0, 16));

      if (mode === 'encrypt') {
        const { ciphertext, rounds } = aesEncrypt(textBytes, keyBytes);
        setResult(
          Array.from(ciphertext)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        );
        setRounds(rounds);
      } else {
        const { plaintext, rounds } = aesDecrypt(textBytes, keyBytes);
        setResult(new TextDecoder().decode(plaintext));
        setRounds(rounds);
      }
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi!');
    }
  };

  const hexToGrid = (hex: string): string[][] => {
    const grid: string[][] = Array(4).fill(0).map(() => Array(4).fill(''));
    let index = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (index < hex.length) {
          grid[j][i] = hex.slice(index, index + 2);
          index += 2;
        } else {
          grid[j][i] = '';
        }
      }
    }
    return grid;
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Mã hóa AES-128</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Văn bản</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Nhập văn bản để mã hóa' : 'Nhập hex để giải mã'}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Khóa (16 ký tự)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Nhập khóa"
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
        {rounds.length > 0 && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Chi tiết các vòng</label>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-200 p-3 text-left">ROUND NUMBER</th>
                    <th className="border border-gray-200 p-3 text-left">Start of Round</th>
                    <th className="border border-gray-200 p-3 text-left">After SubBytes</th>
                    <th className="border border-gray-200 p-3 text-left">After ShiftRows</th>
                    <th className="border border-gray-200 p-3 text-left">After MixColumns</th>
                    <th className="border border-gray-200 p-3 text-left">ROUND KEY VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round) => (
                    <tr key={round.roundNumber} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3 text-center">{round.roundNumber}</td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(round.startOfRound).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(round.afterSubBytes || '').map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(round.afterShiftRows || '').map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        {round.afterMixColumns ? (
                          <div className="grid grid-cols-4 gap-1">
                            {hexToGrid(round.afterMixColumns).map((row, rowIndex) =>
                              row.map((cell, colIndex) => (
                                <div
                                  key={`${rowIndex}-${colIndex}`}
                                  className="border border-gray-300 p-2 text-center font-mono text-sm"
                                >
                                  {cell}
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 italic">N/A</div>
                        )}
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="grid grid-cols-4 gap-1">
                          {hexToGrid(round.roundKeyValue).map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className="border border-gray-300 p-2 text-center font-mono text-sm"
                              >
                                {cell}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">OUTPUT</label>
            <div className="grid grid-cols-4 gap-1">
              {hexToGrid(result).map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-gray-300 p-2 text-center font-mono text-sm bg-slate-100"
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}