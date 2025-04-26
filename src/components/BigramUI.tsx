import { useState } from 'react';
import { bigramEncrypt, displayBigramTable } from '../algorithms/bigram';

export default function BigramUI() {
  const [text, setText] = useState('');
  const [key, setKey] = useState(import.meta.env.VITE_BIGRAM_DEFAULT_KEY || 'CRYPTO');
  const [result, setResult] = useState('');
  const [table, setTable] = useState<string[][] | null>(null);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [isPadded, setIsPadded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setResult('');
    setTable(null);
    setDuplicates([]);
    setIsPadded(false);
    try {
      if (!key) throw new Error('Vui lòng nhập khóa!');
      if (!text) throw new Error('Vui lòng nhập văn bản!');

      setTable(displayBigramTable(key));
      const { ciphertext, duplicates, isPadded } = bigramEncrypt(text, key);
      setResult(ciphertext);
      setDuplicates(duplicates);
      setIsPadded(isPadded);
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Mã Bigram (Playfair)</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Văn bản</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập văn bản để mã hóa"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Khóa</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Nhập khóa (ví dụ: CRYPTO)"
          />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Mã hóa
        </button>
        {error && <p className="error-box">{error}</p>}
        {table && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bảng Bigram (Key: {key})</label>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <tbody>
                  {table.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className="border border-gray-200 p-3 text-center font-mono text-sm"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {duplicates.length > 0 && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Cặp ký tự trùng</label>
            <p className="output-box">{duplicates.join(', ')}</p>
          </div>
        )}
        {isPadded && (
          <p className="text-gray-600 italic">Đã thêm ký tự đệm (padding).</p>
        )}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kết quả mã hóa</label>
            <textarea
              className="output-box w-full"
              rows={4}
              value={result}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}