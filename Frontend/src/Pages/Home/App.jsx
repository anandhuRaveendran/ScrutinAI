import React from 'react';
import { Link } from 'react-router-dom';
import HomeImage from '../../../public/Images/Home2.png';

const features = [
  {
    title: "AI-Powered Audits",
    desc: "Scan your smart contracts instantly for vulnerabilities using advanced AI models.",
    icon: "🤖",
  },
  {
    title: "Collaborative Auditing",
    desc: "Review, validate, and discuss findings with the community in real time.",
    icon: "🤝",
  },
  {
    title: "Gamified Rewards",
    desc: "Earn points, NFT badges, and leaderboard status for accurate audits.",
    icon: "🏆",
  },
  {
    title: "Educational Library",
    desc: "Browse vulnerability patterns, best practices, and interactive tutorials.",
    icon: "📚",
  },
  {
    title: "Visual Reports",
    desc: "Get detailed, severity-based reports with contract logic diagrams and fix suggestions.",
    icon: "📊",
  },
  {
    title: "BNB Testnet Focus",
    desc: "Optimized for BNB testnet smart contract security and developer experience.",
    icon: "🟡",
  },
];

const Home = () => (
  <main className="max-w-7xl mx-auto px-6 py-16">
    {/* Hero Section */}
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex-1">
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
          AI-Powered Smart Contract Auditing<br className="hidden md:block" />
          for BNB Testnet
        </h1>
        <p className="text-[#B0B8C1] text-lg mb-8 max-w-xl">
          Secure your blockchain projects with instant, automated AI audits and real-time community collaboration. Submit your contract, get detailed vulnerability reports, and join a gamified, educational security platform built for everyone.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/audit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold text-lg transition"
          >
            Start Audit
          </Link>
          <Link
            to="/dashboard"
            className="border border-[#B0B8C1] text-white px-6 py-3 rounded font-semibold text-lg hover:bg-[#1A2536] transition"
          >
            My Dashboard
          </Link>
        </div>
      </div>
      {/* IMAGE IS HERE */}
      <div className="flex-1 flex justify-center mt-12 md:mt-0">
        <img
          // src="https://i.ibb.co/6bQ7Q6d/shield-logo.png" // 
          src={HomeImage} 
          alt="Shield Logo"
          className="w-[350px] h-[350px] object-contain"
        />
      </div>
    </div>

    {/* <div className="mt-20">
      <h2 className="text-3xl text-white font-bold mb-8 text-center">Platform Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-[#1A2536] rounded-lg p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <div className="text-xl text-blue-400 font-semibold mb-2">{f.title}</div>
            <div className="text-gray-300">{f.desc}</div>
          </div>
        ))}
      </div>
    </div> */}
  </main>
);

export default Home;