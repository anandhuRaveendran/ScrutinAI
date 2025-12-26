import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email && password) {
            localStorage.setItem("isAuth", "true");
            navigate("/dashboard");
        }
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    };

    const handleGithubLogin = () => {
        console.log("GitHub login clicked");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 ">
            <div className="w-full max-w-md  bg-[#0b0f14]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold">
                        Sign in to your account
                    </h2>
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
                            type="email"
                            placeholder="Email"
                            className="input mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-[#04d9ff] hover:underline"
                            >
                                Forgot?
                            </Link>
                        </div>

                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                className="input pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-[#04d9ff] text-black font-semibold py-2 rounded hover:bg-[#00bcd4] transition"
                    >
                        Sign in
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-xs text-gray-400 uppercase">
                        or sign in with
                    </span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* SOCIAL LOGIN */}
                <div className="flex gap-3">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex-1 flex items-center justify-center gap-2 
               bg-gray-800 hover:bg-gray-700 py-2 rounded-full text-sm transition"
                    >
                        <FaGoogle className="text-[#ea4335] " />
                        Google
                    </button>

                    <button
                        onClick={handleGithubLogin}
                        className="flex-1 flex items-center justify-center gap-2 
               bg-gray-800 hover:bg-gray-700 py-2 rounded-full text-sm transition"
                    >
                        <FaGithub className="text-white " />
                        GitHub
                    </button>
                </div>


            </div>
        </div>
    );
};

export default Login;
