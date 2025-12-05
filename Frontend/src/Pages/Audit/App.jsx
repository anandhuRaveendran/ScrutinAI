// src/Pages/Audit/Audit.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import WalletConnect from '../../Components/Shared/WalletConnect';
import AuditReportModal from '../../Components/Modal/AuditReportModal';
import LoadingVideo from '../../assets/Videos/fileLoading.mov';
import { Loader2, Upload, Code } from 'lucide-react';

const postAudit = async (contract) => {
  const response = await fetch('http://localhost:3001/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: contract }),
  });

  // parse JSON (guard if not JSON)
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    // if server returns plain text, keep raw
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Audit failed');
  }

  // Normalize: if server nested audit under `audit`, return that; otherwise return data
  if (data.audit) return data.audit;
  return data;
};

// Loading overlay component (video + message)
const LoadingOverlay = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-xl overflow-hidden bg-transparent border border-white/10 shadow-xl">
        <div className="relative">
          <video
            src={LoadingVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin w-6 h-6 text-white" />
              <h3 className="text-white text-lg font-semibold">Analyzing contract with AI…</h3>
            </div>
            <p className="text-sm text-white/80 mt-2">This may take ~15–30 seconds depending on contract size.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Audit = () => {
  const [contract, setContract] = useState('');
  const [fileName, setFileName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [fileError, setFileError] = useState(''); // validation error message

  // store the normalized report locally so modal shows correct data even if mutation data shape varies
  const [reportData, setReportData] = useState(null);

  const auditMutation = useMutation({
    mutationFn: postAudit,
    onMutate: () => {
      setLocalLoading(true);
    },
    onSuccess: (data) => {
      // data here is the normalized audit object returned from postAudit
      setReportData(data);
      setShowModal(true);
      setLocalLoading(false);
    },
    onError: (err) => {
      setLocalLoading(false);
      alert('Audit failed: ' + (err?.message || 'Unknown error'));
      console.error(err);
    },
    onSettled: () => {
      // safety clear
      setLocalLoading(false);
    }
  });

  const isLoading = localLoading || auditMutation.isLoading;

  // STRONG Solidity detector: rejects common non-solidity formats and checks for solidity indicators
  const looksLikeSolidity = (text = '') => {
    if (!text || text.trim().length < 10) return false;

    const lower = text.toLowerCase();

    // Hard rejections for non-Solidity code formats (common JS/HTML/JSON markers)
    const forbiddenPatterns = [
      /(^|\s)function\s*\(/,      // likely JS function (but note: solidity has function too; we keep simple)
      /(^|\s)const\s+\w+\s*=/,    // JS const assignment
      /(^|\s)var\s+\w+\s*=/,      // JS var
      /(^|\s)let\s+\w+\s*=/,      // JS let
      /(^|\s)import\s+["']/,      // JS import (but solidity uses import too — however solidity imports often look different)
      /<html>|<\/html>/,          // HTML
      /^\s*{[\s\S]*}\s*$/m,       // JSON object content
      /<[^>]+>/                   // any HTML/XML tag
    ];
    if (forbiddenPatterns.some((p) => p.test(lower))) {
      // allow "import" as it's valid in solidity; so special-case: if import is present but also solidity indicators exist, continue
      if (!/import\s+["']/.test(lower)) return false;
    }

    // Solidity must contain one of these indicators (strong signals)
    const solidityIndicators = [
      /pragma\s+solidity/,
      /\bcontract\s+\w+/,
      /\blibrary\s+\w+/,
      /\binterface\s+\w+/,
      /\bstruct\s+\w+/,
      /\benum\s+\w+/,
      /mapping\s*\(/,
      /uint(8|16|32|64|128|256)/,
      /\baddress\b/,
      /modifier\s+\w+/,
      /event\s+\w+/,
      /override\b/,
      /assembly\s*\{/
    ];

    if (solidityIndicators.some((p) => p.test(lower))) {
      // Basic Solidity body structure must exist
      if (text.includes('{') && text.includes('}')) return true;
    }

    return false;
  };

  const handleFileChange = async (e) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // accept only .sol files by extension
    if (!file.name.toLowerCase().endsWith('.sol')) {
      setFileName('');
      setContract('');
      setFileError('Only Solidity (.sol) files are allowed. Please upload a .sol file.');
      return;
    }

    // read file and also validate the content contains solidity constructs
    const text = await file.text();
    if (!looksLikeSolidity(text)) {
      setFileName('');
      setContract('');
      setFileError('Uploaded file does not appear to contain valid Solidity code.');
      return;
    }

    // all good
    setFileName(file.name);
    setContract(text);
    setFileError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setContract('');
    setFileName('');
    setReportData(null);
    auditMutation.reset();
    setFileError('');
  };

  const handleAudit = () => {
    // Validate before sending: must have contract text and it must look like solidity
    if (!contract) {
      setFileError('No contract provided. Please upload a .sol file or paste Solidity code.');
      return;
    }

    if (!looksLikeSolidity(contract)) {
      setFileError('Pasted code does not look like valid Solidity.');
      return;
    }

    setFileError('');
    // mutate will call onMutate synchronously (sets localLoading)
    auditMutation.mutate(contract);
  };

  const handleClear = () => {
    setContract('');
    setFileName('');
    setFileError('');
  };

  // If you want to prefer the locally stored reportData (set in onSuccess), pass that to modal.
  const normalizedReport = reportData || (auditMutation.data?.audit ? auditMutation.data.audit : auditMutation.data) || null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* loading overlay uses combined isLoading */}
      <LoadingOverlay show={isLoading} />

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Submit Smart Contract for Audit
          </h2>
        </div>

        <div className="mt-2 md:mt-0">
          <WalletConnect />
        </div>
      </div>


      {/* File Upload Section */}
      <div className="mb-6 mt-6">
        <label className="block text-gray-300 mb-2 font-semibold">
          Upload Solidity File (.sol):
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".sol"
            onChange={handleFileChange}
            className="
              block w-full text-white bg-[#1A2536] rounded p-3 
              border border-gray-700 hover:border-[#04d9ff] 
              transition-colors
              file:mr-4 file:py-2 file:px-4 file:rounded 
              file:border-0 file:text-sm file:font-semibold 
              file:bg-[#04d9ff] file:text-black 
              hover:file:bg-[#16e0ff]
              cursor-pointer"
            disabled={isLoading}
          />
          {fileName && (
            <div className="flex items-center gap-2 text-blue-400 mt-2 text-sm">
              <Upload size={16} />
              <span>Loaded: {fileName}</span>
            </div>
          )}
          {fileError && (
            <div className="mt-2 text-sm text-red-400">
              {fileError}
            </div>
          )}
        </div>
      </div>

      {/* Code Textarea Section */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 font-semibold">
          Or paste your Solidity code:
        </label>
        <div className="relative">
          <textarea
            className="w-full h-48 p-4 rounded bg-[#1A2536] text-white border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
            placeholder={`pragma solidity ^0.8.0;

contract MyContract {
    // Your smart contract code here...
}`}
            value={contract}
            onChange={(e) => {
              const value = e.target.value;
              setContract(value);
              setFileName('');

              if (value.trim() === '') {
                setFileError('');
                return;
              }

              if (!looksLikeSolidity(value)) {
                setFileError('❌ Pasted code is not valid Solidity.');
              } else {
                setFileError('');
              }
            }}
            disabled={isLoading}
            aria-busy={isLoading}
          />
          {contract && (
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {contract.length} characters
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors flex-1
            ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#04D9FF] hover:bg-[#16e0ff]'}
          `}
          onClick={handleAudit}
          disabled={!contract || !!fileError || isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Analyzing Contract...</span>
            </>
          ) : (
            <>
              <Code size={20} />
              <span>Audit with AI</span>
            </>
          )}
        </button>

        {contract && !isLoading && (
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      {/* Info Box */}
      {!contract && (
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Upload a .sol file or paste your Solidity smart contract code above.
            Our AI will analyze it for security vulnerabilities, gas optimization opportunities, and best practice violations.
          </p>
        </div>
      )}

      {/* Loading State Info (redundant if overlay visible, but kept for accessibility) */}
      {isLoading && (
        <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-300 text-sm">
            ⏳ <strong>Analyzing your contract...</strong> This may take 15-30 seconds.
            We're performing a comprehensive security audit using advanced AI analysis.
          </p>
        </div>
      )}

      {/* Error State */}
      {auditMutation.isError && (
        <div className="mt-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">
            ❌ <strong>Audit Failed:</strong> {auditMutation.error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* Audit Report Modal */}
      <AuditReportModal
        open={showModal}
        onClose={handleCloseModal}
        report={normalizedReport}
      />
    </div>
  );
};

export default Audit;
