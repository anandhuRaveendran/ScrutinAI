import { Loader2, ShieldCheck } from "lucide-react";

const FullScreenLoader = ({
    show,
    text = "Analyzing contract with AI...",
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="relative">

                {/* Neon Glow Ring */}
                <div className="absolute inset-0 rounded-2xl blur-2xl opacity-60
          bg-gradient-to-r from-[#04d9ff] via-[#5eead4] to-[#04d9ff]
          animate-pulse"
                />

                {/* Card */}
                <div className="relative z-10 flex flex-col items-center gap-4
          bg-black/70 border border-white/10
          rounded-2xl px-10 py-8 shadow-2xl
        ">

                    {/* Icon */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-16 h-16 rounded-full border-2 border-[#04d9ff]/30 animate-spin-slow" />
                        <ShieldCheck className="w-8 h-8 text-[#04d9ff]" />
                    </div>

                    {/* Spinner */}
                    <Loader2 className="w-7 h-7 animate-spin text-white/90" />

                    {/* Text */}
                    <p className="text-white text-sm font-medium text-center">
                        {text}
                    </p>

                    {/* Subtext */}
                    <p className="text-xs text-white/60 text-center">
                        Deep security analysis in progress…
                    </p>

                    {/* Scan Line */}
                    <div className="relative w-full h-[2px] overflow-hidden rounded-full mt-2">
                        <div className="absolute inset-0 bg-white/10" />
                        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r
              from-transparent via-[#04d9ff] to-transparent
              animate-scan"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenLoader;
