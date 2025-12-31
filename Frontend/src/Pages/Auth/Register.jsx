import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaBrain,
    FaShieldAlt,
    FaGavel,
    FaWallet,
    FaGoogle,
    FaGithub,
    FaGitlab,
} from "react-icons/fa";
import { useRegister } from "../../hooks/userRegistration";
import { registerSchema } from "../../validation/registerSchema";
const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
    const navigate = useNavigate();
    const { mutate, isLoading, error } = useRegister();

    const handleGoogleRegister = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    const handleGithubRegister = () => {
        window.location.href = `${API_URL}/auth/github`;
    };

    const handleGitlabRegister = () => {
        window.location.href = `${API_URL}/auth/gitlab`;
    };


    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerSchema.validate(form, { abortEarly: false });
            setFormErrors({});

            mutate(form, {
                onSuccess: () => navigate("/login"),
            });
        } catch (validationError) {
            const errors = {};
            validationError.inner.forEach((err) => {
                errors[err.path] = err.message;
            });
            setFormErrors(errors);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-6xl max-h-[90vh] grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f14]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <div className="hidden lg:flex flex-col p-8 bg-gradient-to-br from-[#0f172a] to-black overflow-y-auto">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Secure Smart Contracts with{" "}
                            <span className="text-[#04d9ff]">ScrutinAI</span>
                        </h1>

                        <p className="text-gray-400 mb-6 mt-[10%]">
                            AI-powered auditing with immutable, verifiable security reports.
                        </p>

                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <FaBrain className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">AI vulnerability detection</h4>
                                    <p className="text-gray-400 leading-snug">
                                        Detect bugs, risks, and compliance issues in minutes.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FaShieldAlt className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">On-chain & IPFS proofs</h4>
                                    <p className="text-gray-400 leading-snug">
                                        Transparent, tamper-proof audit records.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FaGavel className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">Governance & rewards</h4>
                                    <p className="text-gray-400 leading-snug">
                                        Human auditors earn rewards for verified issues.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FaWallet className="mt-1 text-[#04d9ff]" />
                                <div>
                                    <h4 className="font-semibold text-white">Wallet protection</h4>
                                    <p className="text-gray-400 leading-snug">
                                        Get warnings before risky interactions.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <p className="text-xs text-gray-500 mt-auto">
                        © {new Date().getFullYear()} ScrutinAI · built by Ledger Legends
                    </p>
                </div>

                <div className="p-6 sm:p-8 border-l border-white/10 flex flex-col justify-center overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-2 text-center">
                        Create your ScrutinAI account
                    </h2>
                    <p className="text-sm text-gray-400 text-center mb-3">
                        Start auditing smart contracts with AI-powered security
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <button onClick={handleGoogleRegister} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm transition">
                            <FaGoogle className="text-[#ea4335]" /> Google
                        </button>
                        <button onClick={handleGithubRegister} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm transition">
                            <FaGithub className="text-white" /> GitHub
                        </button>
                        <button onClick={handleGitlabRegister} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm transition">
                            <FaGitlab className="text-[#fc6d26]" /> GitLab
                        </button>
                    </div>
                    <div className="text-center text-gray-400 text-sm mb-4">or</div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <input name="firstName" onChange={handleChange} placeholder="First Name" className="input" />
                                {formErrors.firstName && <p className="text-xs text-red-400">{formErrors.firstName}</p>}
                            </div>

                            <div>
                                <input name="lastName" onChange={handleChange} placeholder="Last Name" className="input" />
                                {formErrors.lastName && <p className="text-xs text-red-400">{formErrors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <input name="username" onChange={handleChange} placeholder="Username (e.g. johndoe123)" className="input" />
                            {formErrors.username && <p className="text-xs text-red-400">{formErrors.username}</p>}
                        </div>

                        <div>
                            <input name="email" type="email" onChange={handleChange} placeholder="Email" className="input" />
                            {formErrors.email && <p className="text-xs text-red-400">{formErrors.email}</p>}
                        </div>

                        <div>
                            <input name="password" type="password" onChange={handleChange} placeholder="Password" className="input" />
                            {formErrors.password && <p className="text-xs text-red-400">{formErrors.password}</p>}
                        </div>

                        {error && (
                            <p className="text-sm text-red-400">
                                {error.response?.data?.error || "Registration failed"}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#04d9ff] text-black font-semibold py-2 rounded hover:bg-[#00bcd4] transition disabled:opacity-50"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-sm mt-4 text-center">
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