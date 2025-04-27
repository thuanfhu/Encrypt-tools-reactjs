import { useState } from 'react';
import { generateKeyPair, signMessage, verifySignature, SchnorrSignature } from '../algorithms/schnorr';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function SchnorrUI() {
  const [p, setP] = useState('23');
  const [q, setQ] = useState('11');
  const [a, setA] = useState('2');
  const [s, setS] = useState('');
  const [v, setV] = useState('');
  const [message, setMessage] = useState('');
  const [fixedPrivateKey, setFixedPrivateKey] = useState('');
  const [fixedR, setFixedR] = useState('');
  const [inputE, setInputE] = useState('');
  const [inputY, setInputY] = useState('');
  const [testCase, setTestCase] = useState('none'); // none, invalid
  const [signature, setSignature] = useState<SchnorrSignature | null>(null);
  const [verification, setVerification] = useState<{ isValid: boolean; xPrime: bigint } | null>(null);
  const [error, setError] = useState('');

  const validateInputs = (params: { p?: string; q?: string; a?: string; s?: string; r?: string; e?: string; y?: string }): { p?: bigint; q?: bigint; a?: bigint; s?: bigint; r?: bigint; e?: bigint; y?: bigint } => {
    const result: any = {};
    if (params.p) {
      if (!/^\d+$/.test(params.p)) throw new Error('p phải là số nguyên dương');
      const pVal = BigInt(params.p);
      if (pVal < 23n) throw new Error('p phải lớn hơn hoặc bằng 23 (trong thực tế cần ~1024-bit)');
      result.p = pVal;
    }
    if (params.q) {
      if (!/^\d+$/.test(params.q)) throw new Error('q phải là số nguyên dương');
      const qVal = BigInt(params.q);
      if (qVal < 11n) throw new Error('q phải lớn hơn hoặc bằng 11 (trong thực tế cần ~160-bit)');
      result.q = qVal;
    }
    if (params.p && params.q) {
      const pVal = BigInt(params.p);
      const qVal = BigInt(params.q);
      if ((pVal - 1n) % qVal !== 0n) throw new Error('q phải là ước của p-1');
    }
    if (params.a) {
      if (!/^\d+$/.test(params.a)) throw new Error('a phải là số nguyên dương');
      result.a = BigInt(params.a);
    }
    if (params.s) {
      if (!/^\d+$/.test(params.s)) throw new Error('s phải là số nguyên dương');
      result.s = BigInt(params.s);
    }
    if (params.r) {
      if (!/^\d+$/.test(params.r)) throw new Error('r phải là số nguyên dương');
      result.r = BigInt(params.r);
    }
    if (params.e) {
      if (!/^\d+$/.test(params.e)) throw new Error('e phải là số nguyên dương');
      result.e = BigInt(params.e);
    }
    if (params.y) {
      if (!/^\d+$/.test(params.y)) throw new Error('y phải là số nguyên dương');
      result.y = BigInt(params.y);
    }
    return result;
  };

  const handleTestCaseChange = (value: string) => {
    setTestCase(value);
    if (value === 'invalid') {
      setP('23');
      setQ('11');
      setA('2');
      setFixedPrivateKey('7');
      setFixedR('4');
      setInputE('3'); // Chữ ký không hợp lệ: e = 3
      setInputY('7');
      setMessage('test');
    } else {
      setP('23');
      setQ('11');
      setA('2');
      setFixedPrivateKey('');
      setFixedR('');
      setInputE('');
      setInputY('');
      setMessage('');
    }
  };

  const handleGenerateKeys = () => {
    setError('');
    setSignature(null);
    setVerification(null);
    try {
      const { p: pVal, q: qVal, a: aVal } = validateInputs({ p, q, a });
      if (!pVal || !qVal || !aVal) throw new Error('Vui lòng nhập đầy đủ p, q, a');
      const fixedKey = testCase === 'invalid' && fixedPrivateKey ? BigInt(fixedPrivateKey) : undefined;
      const { privateKey: newS, publicKey: newV } = generateKeyPair(pVal, aVal, qVal, fixedKey);
      setS(newS.toString());
      setV(newV.toString());
    } catch (e: any) {
      setError(e.message || 'Không thể tạo cặp khóa!');
    }
  };

  const handleSign = () => {
    setError('');
    setSignature(null);
    setVerification(null);
    try {
      if (!message) throw new Error('Vui lòng nhập tin nhắn!');
      const { p: pVal, q: qVal, a: aVal, e: eVal, y: yVal } = validateInputs({ p, q, a, e: inputE, y: inputY });
      if (!pVal || !qVal || !aVal) throw new Error('Vui lòng nhập đầy đủ p, q, a');
      if (!s) throw new Error('Vui lòng tạo khóa trước!');
      let sig: SchnorrSignature;
      if (testCase === 'invalid' && eVal !== undefined && yVal !== undefined) {
        sig = { e: eVal, y: yVal };
      } else if (inputE && inputY && eVal !== undefined && yVal !== undefined) {
        sig = { e: eVal, y: yVal }; // Sử dụng e, y thủ công
      } else {
        const fixedRVal = testCase === 'invalid' && fixedR ? BigInt(fixedR) : undefined;
        sig = signMessage(message, BigInt(s), pVal, aVal, qVal, fixedRVal);
      }
      setSignature(sig);
    } catch (e: any) {
      setError(e.message || 'Không thể ký tin nhắn!');
    }
  };

  const handleVerify = () => {
    setError('');
    setVerification(null);
    try {
      if (!signature) throw new Error('Vui lòng ký tin nhắn trước!');
      const { p: pVal, q: qVal, a: aVal } = validateInputs({ p, q, a });
      if (!pVal || !qVal || !aVal) throw new Error('Vui lòng nhập đầy đủ p, q, a');
      const ver = verifySignature(signature, BigInt(v), message, pVal, aVal, qVal);
      setVerification(ver);
      console.log('Verification:', { xPrime: ver.xPrime.toString(), isValid: ver.isValid });
    } catch (e: any) {
      setError(e.message || 'Không thể xác minh chữ ký!');
    }
  };

  const renderKatex = (expression: string) => {
    return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(expression, { throwOnError: false }) }} />;
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg fade-in max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Chữ ký số Schnorr</h2>

      {/* Hướng dẫn */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          <strong>Hướng dẫn:</strong> Nhập số nguyên tố p, số nguyên tố q (ước của p-1), và căn nguyên thủy a (bậc q modulo p). Thực hiện các bước để kiểm tra chữ ký:
          <ul className="list-disc ml-6 mt-2">
            <li>
              <strong>Thành công</strong>: Nhập p=23, q=11, a=2, tin nhắn="test". Nhấn "Tạo khóa", "Ký", "Xác minh" → Kết quả: Hợp lệ.
            </li>
            <li>
              <strong>Thất bại (chữ ký giả)</strong>: Sau khi ký, sửa e hoặc y (ví dụ, e=3) rồi nhấn "Ký", "Xác minh" → Kết quả: Không hợp lệ.
            </li>
            <li>
              <strong>Thất bại (văn bản chỉnh sửa)</strong>: Sau khi ký, sửa tin nhắn (ví dụ, thành "test2") rồi nhấn "Xác minh" → Kết quả: Không hợp lệ.
            </li>
            <li>
              <strong>Test case không hợp lệ</strong>: Chọn "Không hợp lệ" để điền p=23, q=11, a=2, s=7, r=4, e=3, y=7, tin nhắn="test" → Kết quả: Không hợp lệ.
            </li>
          </ul>
        </p>
      </div>

      {/* Chọn Test Case */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Chọn Test Case</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="testCase"
              value="none"
              checked={testCase === 'none'}
              onChange={() => handleTestCaseChange('none')}
              className="accent-blue-500"
            />
            Không dùng
          </label>
          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="testCase"
              value="invalid"
              checked={testCase === 'invalid'}
              onChange={() => handleTestCaseChange('invalid')}
              className="accent-blue-500"
            />
            Không hợp lệ
          </label>
        </div>
      </div>

      {/* Ô nhập liệu */}
      <div className="grid gap-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Số nguyên tố (p)</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="Nhập p (1024-bit)"
              disabled={testCase === 'invalid'}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">B阶 nhóm con (q)</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nhập q (160-bit)"
              disabled={testCase === 'invalid'}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Căn nguyên thủy (a)</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="Nhập a"
              disabled={testCase === 'invalid'}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Tin nhắn (M)</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn"
              disabled={testCase === 'invalid'}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Chữ ký e</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={inputE}
              onChange={(e) => setInputE(e.target.value)}
              placeholder="Nhập e (tùy chọn)"
              disabled={testCase === 'invalid'}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Chữ ký y</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={inputY}
              onChange={(e) => setInputY(e.target.value)}
              placeholder="Nhập y (tùy chọn)"
              disabled={testCase === 'invalid'}
            />
          </div>
        </div>
        {testCase === 'invalid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Khóa riêng cố định (s)</label>
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                value={fixedPrivateKey}
                onChange={(e) => setFixedPrivateKey(e.target.value)}
                placeholder="Nhập s cố định"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Số ngẫu nhiên cố định (r)</label>
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                value={fixedR}
                onChange={(e) => setFixedR(e.target.value)}
                placeholder="Nhập r cố định"
                disabled
              />
            </div>
          </div>
        )}
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleGenerateKeys}>
            Tạo khóa
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleSign}>
            Ký
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleVerify}>
            Xác minh
          </button>
        </div>
      </div>

      {/* Hiển thị các bước tính toán */}
      <div className="space-y-8">
        {/* Bước 1: Các giá trị công khai */}
        <div>
          <h3 className="text-xl font-semibold mb-4">1. Các giá trị công khai</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">p số nguyên tố (1024-bit)</td>
                  <td className="border border-gray-300 px-4 py-2">{p}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">q (160-bit) là ước nguyên tố của p - 1</td>
                  <td className="border border-gray-300 px-4 py-2">{q}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">a thỏa {renderKatex('a^q \\equiv 1 \\pmod{p}')}</td>
                  <td className="border border-gray-300 px-4 py-2">{a}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bước 2: Người gửi tạo khóa */}
        {s && v && (
          <div>
            <h3 className="text-xl font-semibold mb-4">2. Người gửi tạo khóa</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Chọn s</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('0 \\leq s < q')}</td>
                    <td className="border border-gray-300 px-4 py-2">{s}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tính v</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('v = a^{-s} \\pmod{p}')}</td>
                    <td className="border border-gray-300 px-4 py-2">{v}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Khóa công khai</td>
                    <td className="border border-gray-300 px-4 py-2">PU = v</td>
                    <td className="border border-gray-300 px-4 py-2">{v}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Khóa riêng</td>
                    <td className="border border-gray-300 px-4 py-2">PR = s</td>
                    <td className="border border-gray-300 px-4 py-2">{s}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bước 3: Người gửi ký vào tin nhắn M */}
        {signature && (
          <div>
            <h3 className="text-xl font-semibold mb-4">3. Người gửi ký vào tin nhắn M</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tính e</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('e = H(M \\| x)')}</td>
                    <td className="border border-gray-300 px-4 py-2">{signature.e}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tính y</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('y = (r + s \\cdot e) \\pmod{q}')}</td>
                    <td className="border border-gray-300 px-4 py-2">{signature.y}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Chữ ký số</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('(e, y)')}</td>
                    <td className="border border-gray-300 px-4 py-2">({signature.e}, {signature.y})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bước 4: Người nhận xác minh chữ ký của người gửi */}
        {verification && signature && (
          <div>
            <h3 className="text-xl font-semibold mb-4">4. Người nhận xác minh chữ ký của người gửi</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Chữ ký số</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('(e, y)')}</td>
                    <td className="border border-gray-300 px-4 py-2">({signature.e}, {signature.y})</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tính x'</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('x\' = a^y \\cdot v^e \\pmod{p}')}</td>
                    <td className="border border-gray-300 px-4 py-2">{verification.xPrime}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Xác minh</td>
                    <td className="border border-gray-300 px-4 py-2">{renderKatex('H(M \\| x\') == e')}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {verification.isValid ? 'Hợp lệ' : 'Không hợp lệ'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}