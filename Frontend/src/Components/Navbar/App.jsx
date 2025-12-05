import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <div
        className="
          mx-auto max-w-4xl w-full
          px-4
          pointer-events-auto
          flex items-center justify-between
        "
      >
        <div
          className="
            w-full flex items-center justify-between
            bg-black/50 backdrop-blur-md
            border border-white/20
            rounded-xl
            px-6 py-3
            shadow-[0_4px_20px_rgba(255,255,255,0.1),0_0_10px_rgba(0,0,0,0.4)]
            transition-all
          "
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7v6c0 5.25 3.75 10 10 10s10-4.75 10-10V7l-10-5z" fill="#04d9ff" />
              </svg>
            </span>
            <span className="text-white font-semibold text-lg">ScrutinAI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
            <Link to="/audit" className="text-white hover:text-blue-400 transition">Audit</Link>
            <Link to="/governance" className="text-white hover:text-blue-400 transition">Governance</Link>
          </div>

          <div className="flex items-center">
            <button className="border border-white rounded px-4 py-2 text-white hover:bg-[#04d9ff] hover:text-[#101828] transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
