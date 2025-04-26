import { useState } from 'react';
import { generateSchnorrKeyPair, signSchnorr, verifySchnorr } from '../algorithms/schnorr';

export default function SchnorrUI() {
  const [p, setP] = useState('23');
  const [g, setG] = useState('5');
  const [privateKey, setPrivateKey] = useState('6');
  const [publicKey, setPublicKey] = useState('');
  const [message, setMessage] = useState('');
  const [r, setR] = useState('');
  const [s, setS] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerateKeys = () => {
    setError('');
    try {
      const { privateKey: newPrivateKey, publicKey: newPublicKey } = generateSchnorrKeyPair(BigInt(p), BigInt(g));
      setPrivateKey(newPrivateKey.toString());
      setPublicKey(newPublicKey.toString());
    } catch (e: any) {
      setError(e.message || 'Không thể tạo cặp khóa!');
    }
  };

  const handleSign = () => {
    setError('');
    setResult('');
    try {
      if (!message) throw new Error('Vui lòng nhập tin nhắn!');
      const signature = signSchnorr(message, BigInt(privateKey), BigInt(p), BigInt(g));
      setR(signature.r.toString());
      setS(signature.s.toString());
      setResult(`Chữ ký: (r=${signature.r}, s=${signature.s})`);
    } catch (e: any) {
      setError(e.message || 'Không thể ký tin nhắn!');
    }
  };

  const handleVerify = () => {
    setError('');
    setResult('');
    try {
      if (!message || !r || !s || !publicKey) throw new Error('Vui lòng nhập đầy đủ thông tin!');
      const isValid = verifySchnorr(message, { r: BigInt(r), s: BigInt(s) }, BigInt(publicKey), BigInt(p), BigInt(g));
      setResult(isValid ? 'Chữ ký hợp lệ!' : 'Chữ ký không hợp lệ!');
    } catch (e: any) {
      setError(e.message || 'Không thể xác minh chữ ký!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Chữ ký Schnorr</h2>
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
          <label className="block text-gray-700 font-medium mb-2">Khóa riêng</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập khóa riêng"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Khóa công khai</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Nhập khóa công khai"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tin nhắn</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Chữ ký (r)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={r}
            onChange={(e) => setR(e.target.value)}
            placeholder="Nhập r"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Chữ ký (s)</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={s}
            onChange={(e) => setS(e.target.value)}
            placeholder="Nhập s"
          />
        </div>
        <div className="flex gap-4">
          <button className="btn-primary" onClick={handleGenerateKeys}>
            Tạo khóa
          </button>
          <button className="btn-primary" onClick={handleSign}>
            Ký
          </button>
          <button className="btn-primary" onClick={handleVerify}>
            Xác minh
          </button>
        </div>
        {error && <p className="error-box">{error}</p>}
        {result && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kết quả</label>
            <p className="output-box">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}