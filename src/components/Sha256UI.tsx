import { useState } from 'react';
import { sha256 } from '../algorithms/sha256';

export default function Sha256UI() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setResult('');
    try {
      if (!text) throw new Error('Vui lòng nhập văn bản!');
      setResult(sha256(text));
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Hàm băm SHA-256</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Văn bản</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập văn bản để băm"
          />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Tính băm
        </button>
        {error && <p className="error-box">{error}</p>}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kết quả băm (hex)</label>
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