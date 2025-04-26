import { useState } from 'react';
import { performDHExchange, generateDHParameters, DHDetails } from '../algorithms/diffie-hellman';

export default function DiffieHellmanUI() {
  const [p, setP] = useState('23');
  const [g, setG] = useState('5');
  const [otherPublicKey, setOtherPublicKey] = useState('15');
  const [result, setResult] = useState<DHDetails | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setResult(null);
    try {
      const params = { P: BigInt(p), G: BigInt(g) };
      const otherPubKey = BigInt(otherPublicKey);
      const { details } = performDHExchange(params, otherPubKey);
      setResult(details);
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi!');
    }
  };

  const handleGenerateParams = () => {
    setError('');
    try {
      const params = generateDHParameters();
      setP(params.P.toString());
      setG(params.G.toString());
    } catch (e: any) {
      setError(e.message || 'Không thể tạo tham số!');
    }
  };

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
          <label className="block text-gray-700 font-medium mb-2">Khóa công khai khác</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={otherPublicKey}
            onChange={(e) => setOtherPublicKey(e.target.value)}
            placeholder="Nhập khóa công khai của bên kia"
          />
        </div>
        <div className="flex gap-4">
          <button className="btn-primary" onClick={handleGenerateParams}>
            Tạo tham số
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Tính toán
          </button>
        </div>
        {error && <p className="error-box">{error}</p>}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kết quả</label>
            <div className="output-box">
              <p>Số nguyên tố (P): {result.P.toString()}</p>
              <p>Căn nguyên thủy (G): {result.G.toString()}</p>
              <p>Khóa riêng: {result.privateKey.toString()}</p>
              <p>Khóa công khai: {result.publicKey.toString()}</p>
              <p>Khóa công khai bên kia: {result.otherPublicKey.toString()}</p>
              <p>Bí mật chung: {result.sharedSecret.toString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}