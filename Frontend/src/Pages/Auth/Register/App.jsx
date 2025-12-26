import React from "react";
import { Link } from "react-router-dom";
import {
    FaBrain,
    FaShieldAlt,
    FaGavel,
    FaWallet,
    FaGoogle,
    FaGithub,
    FaGitlab,
} from "react-icons/fa";

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div
                className="
          w-full max-w-6xl max-h-[90vh]
          grid grid-cols-1 lg:grid-cols-2
          bg-[#0b0f14]/90 backdrop-blur-xl
          rounded-2xl overflow-hidden
          shadow-2xl border border-white/10
        "
            >
                {/* LEFT INFO PANEL */}
                <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-[#0f172a] to-black">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Secure Smart Contracts with{" "}
                            <span className="text-[#04d9ff]">ScrutinAI</span>
                        </h1>

                        <p className="mt-[10%] text-gray-400 mb-6">
                            AI-powered auditing with immutable, verifiable security reports.
                        </p>

                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <FaBrain className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">
                                        AI vulnerability detection
                                    </h4>
                                    <p className="text-gray-400 leading-snug">
                                        Detect bugs, risks, and compliance issues in minutes using
                                        AI trained on real-world exploits.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FaShieldAlt className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">
                                        On-chain & IPFS audit proofs
                                    </h4>
                                    <p className="text-gray-400 leading-snug">
                                        Transparent, tamper-proof audit records stored on-chain and
                                        IPFS.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FaGavel className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">
                                        Governance & bug bounties
                                    </h4>
                                    <p className="text-gray-400 leading-snug">
                                        Human auditors review AI reports and earn rewards for
                                        verified issues.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FaWallet className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">
                                        Real-time wallet protection
                                    </h4>
                                    <p className="text-gray-400 leading-snug">
                                        Get warnings before interacting with risky or malicious
                                        contracts.
                                    </p>
                                </div>
                            </li>

                        </ul>

                        <p className="text-xs text-gray-500 mt-[20%]">
                            © {new Date().getFullYear()} ScrutinAI · built by Ledger Legends
                        </p>
                    </div>


                </div>

                {/* RIGHT FORM PANEL */}
                <div className="p-6 sm:p-8 border-l border-white/10 flex flex-col justify-center overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-2 text-center">
                        Create your ScrutinAI account
                    </h2>
                    <p className="text-sm text-gray-400 text-center mb-6">
                        Start auditing smart contracts with AI-powered security
                    </p>

                    {/* Social buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm transition">
                            <FaGoogle className="text-[#ea4335]" />
                            Google
                        </button>

                        <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm transition">
                            <FaGithub className="text-white" />
                            GitHub
                        </button>

                        <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm transition">
                            <FaGitlab className="text-[#fc6d26]" />
                            GitLab
                        </button>
                    </div>

                    <div className="text-center text-gray-400 text-sm mb-4">or</div>

                    {/* FORM */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" className="input" />
                            <input type="text" placeholder="Last Name" className="input" />
                        </div>

                        <input type="text" placeholder="Username" className="input" />
                        <input type="email" placeholder="Email" className="input" />
                        <input type="password" placeholder="Password" className="input" />

                        <p className="text-xs text-gray-400">
                            Minimum length is 8 characters.
                        </p>

                        <button
                            type="submit"
                            className="w-full bg-[#04d9ff] text-black font-semibold py-2 rounded hover:bg-[#00bcd4] transition"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-sm mt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#04d9ff] hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
