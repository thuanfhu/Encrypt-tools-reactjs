import { useState } from 'react';
import { modInverse, extendedEuclid } from '../algorithms/euclid';

export default function EuclidUI() {
  const [a, setA] = useState('');
  const [m, setM] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [gcd, setGcd] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setResult(null);
    setGcd(null);
    try {
      const aBig = BigInt(a);
      const mBig = BigInt(m);
      const [gcdVal, _] = extendedEuclid(aBig, mBig);
      setGcd(gcdVal.toString());
      if (gcdVal !== 1n) {
        setResult('Nghịch đảo modulo không tồn tại!');
      } else {
        setResult(modInverse(aBig, mBig).toString());
      }
    } catch (e: any) {
      setError(e.message || 'Vui lòng nhập số hợp lệ!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Nghịch đảo Modulo Euclid</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Số (a)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Nhập số a"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Modulo (m)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={m}
            onChange={(e) => setM(e.target.value)}
            placeholder="Nhập modulo m"
          />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>
          Tính toán
        </button>
        {error && <p className="error-box">{error}</p>}
        {gcd && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">ƯCLN (GCD)</label>
            <p className="output-box">{gcd}</p>
          </div>
        )}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nghịch đảo modulo</label>
            <p className="output-box">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}