import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-[#101828] border-b border-[#1A2536]">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7v6c0 5.25 3.75 10 10 10s10-4.75 10-10V7l-10-5z" fill="#3B82F6"/>
            </svg>
          </span>
          <span className="text-white font-semibold text-xl">Web3AuditAI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
          <Link to="/dashboard" className="text-white hover:text-blue-400 transition">Dashboard</Link>
          <Link to="/audit" className="text-white hover:text-blue-400 transition">Audit</Link>
          <Link to="/community" className="text-white hover:text-blue-400 transition">Community</Link>
          <button className="border border-white rounded px-4 py-2 text-white hover:bg-white hover:text-[#101828] transition">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;