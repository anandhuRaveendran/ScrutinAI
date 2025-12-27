import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaGitlab } from "react-icons/fa";
import { useLogin } from "../../../hooks/userRegistration";
import { useAuth } from "../../../context/AuthContext";
import { loginSchema } from "../../../validation/loginSchema";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { mutate, isLoading, error } = useLogin();

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await loginSchema.validate(form, { abortEarly: false });
            setFormErrors({});

            mutate(form, {
                onSuccess: (data) => {
                    login(data.user);
                    navigate("/dashboard");
                },
            });
        } catch (validationError) {
            const errors = {};
            validationError.inner.forEach((err) => {
                errors[err.path] = err.message;
            });
            setFormErrors(errors);
        }
    };


    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    const handleGithubLogin = () => {
        window.location.href = `${API_URL}/auth/github`;
    };

    const handleGitlabLogin = () => {
        window.location.href = `${API_URL}/auth/gitlab`;
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#0b0f14]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold">Sign in to your account</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Don’t have an account yet?{" "}
                        <Link to="/register" className="text-[#04d9ff] hover:underline">
                            Register
                        </Link>
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input mt-1"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && (
                            <p className="text-xs text-red-400">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Password</label>
                            <Link to="/forgot-password" className="text-xs text-[#04d9ff] hover:underline">
                                Forgot?
                            </Link>
                        </div>

                        <div className="relative mt-1">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                className="input pr-10"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {formErrors.password && (
                            <p className="text-xs text-red-400">{formErrors.password}</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">
                            {error.response?.data?.error || "Login failed"}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#04d9ff] text-black font-semibold py-2 rounded hover:bg-[#00bcd4] transition disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-xs text-gray-400 uppercase">or sign in with</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* SOCIAL LOGIN */}
                <div className="flex gap-3">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-full text-sm transition"
                    >
                        <FaGoogle className="text-[#ea4335]" /> Google
                    </button>

                    <button
                        onClick={handleGithubLogin}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-full text-sm transition"
                    >
                        <FaGithub className="text-white" /> GitHub
                    </button>
                    <button
                        onClick={handleGitlabLogin}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-full text-sm transition"
                    >
                        <FaGitlab className="text-[#fc6d26]" /> GitLab
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Login;
