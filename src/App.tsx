import { useState } from 'react';
import BigramUI from './components/BigramUI';
import Sha256UI from './components/Sha256UI';
import DiffieHellmanUI from './components/DiffieHellmanUI';
import EuclidUI from './components/EuclidUI';
import Aes128UI from './components/Aes128UI';
import SchnorrUI from './components/SchnorrUI';

export default function App() {
  const [activeTab, setActiveTab] = useState('bigram');

  const tabs = [
    { id: 'bigram', name: 'Mã Bigram', component: <BigramUI /> },
    { id: 'sha256', name: 'SHA-256', component: <Sha256UI /> },
    { id: 'diffieHellman', name: 'Diffie-Hellman', component: <DiffieHellmanUI /> },
    { id: 'euclid', name: 'Euclid', component: <EuclidUI /> },
    { id: 'aes128', name: 'AES-128', component: <Aes128UI /> },
    { id: 'schnorr', name: 'Chữ ký Schnorr', component: <SchnorrUI /> },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-blue-800 text-white py-8 shadow-lg">
        <h1 className="text-4xl font-bold text-center tracking-tight">
          Công cụ Mật mã
        </h1>
      </header>
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <ul className="flex flex-wrap justify-center gap-4 p-4 max-w-5xl mx-auto">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id ? 'btn-active' : 'btn-secondary'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="container mx-auto p-6 max-w-5xl">
        <div className="fade-in">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </main>
    </div>
  );
}