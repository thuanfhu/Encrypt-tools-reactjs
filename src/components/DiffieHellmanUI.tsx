import { useState, useEffect } from 'react';
import { performDHExchange, DHDetails } from '../algorithms/diffie-hellman';
import katex from 'katex';

export default function DiffieHellmanUI() {
  const [p, setP] = useState(import.meta.env.VITE_DH_PRIME || '23');
  const [g, setG] = useState('9');
  const [privateKeyA, setPrivateKeyA] = useState('4');
  const [privateKeyB, setPrivateKeyB] = useState('3');
  const [result, setResult] = useState<DHDetails | null>(null);
  const [error, setError] = useState('');

  const handleExchange = () => {
    setError('');
    setResult(null);
    try {
      const params = { P: BigInt(p), G: BigInt(g) };
      const privateA = BigInt(privateKeyA);
      const privateB = BigInt(privateKeyB);

      const { details } = performDHExchange(params, privateA, privateB);
      setResult(details);
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi!');
    }
  };

  useEffect(() => {
    if (result) {
      document.querySelectorAll('.math').forEach((element) => {
        const latex = element.textContent || '';
        katex.render(latex, element as HTMLElement, {
          throwOnError: false,
          displayMode: false,
        });
      });
    }
  }, [result]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Trao đổi khóa Diffie-Hellman</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Số nguyên tố (P)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="Nhập số nguyên tố"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Căn nguyên thủy (G)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={g}
            onChange={(e) => setG(e.target.value)}
            placeholder="Nhập căn nguyên thủy"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Khóa riêng của Alice (a)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={privateKeyA}
            onChange={(e) => setPrivateKeyA(e.target.value)}
            placeholder="Nhập khóa riêng của Alice"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Khóa riêng của Bob (b)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={privateKeyB}
            onChange={(e) => setPrivateKeyB(e.target.value)}
            placeholder="Nhập khóa riêng của Bob"
          />
        </div>
        <button className="btn-primary" onClick={handleExchange}>
          Trao đổi khóa
        </button>
        {error && <p className="error-box">{error}</p>}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Các bước tính toán</label>
            <div className="output-box">
              {result.steps.map((step, index) => (
                <p key={index} className="math">
                  {step}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}