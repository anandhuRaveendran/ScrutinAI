import { useState } from "react";
import { Upload, Loader2, Code } from "lucide-react";
import { looksLikeSolidity } from "./SolidityValidator";

const AuditForm = ({ onSubmit, isLoading }) => {
    const [contract, setContract] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState("");

    /* ---------------- File Upload ---------------- */
    const handleFileChange = async (e) => {
        setFileError("");
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".sol")) {
            reset();
            setFileError("Only Solidity (.sol) files are allowed.");
            return;
        }

        const text = await file.text();
        if (!looksLikeSolidity(text)) {
            reset();
            setFileError("Uploaded file does not appear to be valid Solidity.");
            return;
        }

        setFileName(file.name);
        setContract(text);
    };

    /* ---------------- Submit ---------------- */
    const handleSubmit = () => {
        if (!contract) {
            setFileError("Please upload or paste Solidity code.");
            return;
        }

        if (!looksLikeSolidity(contract)) {
            setFileError("Provided code does not look like valid Solidity.");
            return;
        }

        setFileError("");
        onSubmit(contract);
    };

    const reset = () => {
        setContract("");
        setFileName("");
    };

    /* ---------------- UI ---------------- */
    return (
        <>
            {/* Upload */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-300">
                    Upload Solidity File (.sol)
                </label>

                <input
                    type="file"
                    accept=".sol"
                    disabled={isLoading}
                    onChange={handleFileChange}
                    className="
            w-full text-white bg-[#1A2536] rounded p-3
            border border-gray-700 hover:border-[#04d9ff]
            transition-colors
            file:mr-4 file:py-2 file:px-4 file:rounded
            file:border-0 file:text-sm file:font-semibold
            file:bg-[#04d9ff] file:text-black
            hover:file:bg-[#16e0ff]
            cursor-pointer
          "
                />

                {fileName && (
                    <p className="mt-2 text-sm text-blue-400 flex items-center gap-2">
                        <Upload size={16} /> Loaded: {fileName}
                    </p>
                )}

                {fileError && (
                    <p className="mt-2 text-sm text-red-400">{fileError}</p>
                )}
            </div>

            {/* Paste Code */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-300">
                    Or paste Solidity code
                </label>

                <textarea
                    value={contract}
                    disabled={isLoading}
                    onChange={(e) => {
                        setContract(e.target.value);
                        setFileName("");

                        if (!e.target.value.trim()) {
                            setFileError("");
                        } else if (!looksLikeSolidity(e.target.value)) {
                            setFileError("❌ Code does not look like Solidity.");
                        } else {
                            setFileError("");
                        }
                    }}
                    placeholder={`pragma solidity ^0.8.0;

contract MyContract {
  // ...
}`}
                    className="
            w-full h-48 p-4 rounded
            bg-[#1A2536] text-white
            border border-gray-700
            focus:border-[#04d9ff]
            focus:outline-none
            font-mono text-sm
          "
                />

                {contract && (
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        {contract.length} characters
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !!fileError || !contract}
                    className={`
            flex-1 px-6 py-3 rounded-lg font-semibold
            flex items-center justify-center gap-2
            transition
            ${isLoading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#04d9ff] hover:bg-[#16e0ff] text-black"
                        }
          `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Analyzing…
                        </>
                    ) : (
                        <>
                            <Code size={20} />
                            Audit with AI
                        </>
                    )}
                </button>

                {contract && !isLoading && (
                    <button
                        onClick={reset}
                        className="
              px-6 py-3 rounded-lg font-semibold
              bg-gray-700 hover:bg-gray-600
              transition
            "
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Tip */}
            {!contract && (
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                        💡 Upload a <strong>.sol</strong> file or paste Solidity code to start an AI-powered security audit.
                    </p>
                </div>
            )}
        </>
    );
};

export default AuditForm;
