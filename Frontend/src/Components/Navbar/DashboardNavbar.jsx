import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();

    const API = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,
    });

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
        } catch (err) {
            console.warn("Logout failed");
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/", { replace: true });
        }
    };

    return (
        <nav className="relative z-10 w-full">
            <div className="mx-auto max-w-4xl px-4 py-4">
                <div
                    className="
            flex items-center justify-between
            bg-black/50 backdrop-blur-md
            border border-white/20
            rounded-xl
            px-6 py-3
            shadow-[0_4px_20px_rgba(255,255,255,0.1),0_0_10px_rgba(0,0,0,0.4)]
          "
                >
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                            <path
                                d="M12 2L2 7v6c0 5.25 3.75 10 10 10s10-4.75 10-10V7l-10-5z"
                                fill="#04d9ff"
                            />
                        </svg>
                        <span className="text-white font-semibold text-lg">
                            ScrutinAI
                        </span>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/dashboard" className="text-white hover:text-blue-400 transition">
                            Home
                        </Link>
                        <Link to="/audit" className="text-white hover:text-blue-400 transition">
                            Audit
                        </Link>
                        <Link to="/governance" className="text-white hover:text-blue-400 transition">
                            Governance
                        </Link>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="
              flex items-center gap-2
              border border-white/40
              rounded-lg px-4 py-2
              text-white text-sm
              hover:bg-[#04d9ff]
              hover:text-[#101828]
              hover:border-[#04d9ff]
              transition-all duration-300
            "
                    >
                        <FiLogOut className="text-lg" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
