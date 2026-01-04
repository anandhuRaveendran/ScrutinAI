import { Loader2 } from "lucide-react";
import LoadingVideo from "../../assets/Videos/fileLoading.mov";

const LoadingOverlay = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
            <div className="max-w-2xl w-full rounded-xl overflow-hidden border border-white/10">
                <div className="relative">
                    <video src={LoadingVideo} autoPlay loop muted className="h-56 w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-white w-6 h-6" />
                        <p className="text-white mt-2">Analyzing contract with AI…</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
