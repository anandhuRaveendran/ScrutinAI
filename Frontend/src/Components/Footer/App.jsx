import React from "react";

const DashboardFooter = () => {
    return (
        <footer className="relative z-10 w-screen mt-0">
            {/* Top glow line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#04d9ff]/50 to-transparent" />

            <div
                className="
          w-full
          bg-black/50 backdrop-blur-xl
          border-t border-white/10
          px-6 py-8
        "
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left */}
                    <p className="text-sm text-white/70 text-center md:text-left">
                        © {new Date().getFullYear()}{" "}
                        <span className="text-white font-semibold">ScrutinAI</span>.
                        All rights reserved.
                    </p>

                    {/* Center */}
                    <p className="text-xs tracking-wide text-white/50 text-center">
                        Securing trust through transparency & intelligence
                    </p>

                    {/* Right */}
                    <p className="text-sm text-white/70 text-center md:text-right">
                        Designed by{" "}
                        <span className="font-semibold text-[#04d9ff] hover:drop-shadow-[0_0_6px_#04d9ff] transition">
                            Ledger Legends
                        </span>
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default DashboardFooter;
