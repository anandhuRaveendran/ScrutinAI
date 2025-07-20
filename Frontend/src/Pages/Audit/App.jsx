// Audit.js
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import WalletConnect from '../../Components/Shared/WalletConnect';
import AuditReportModal from '../../Components/Modal/AuditReportModal';

const postAudit = async (contract) => {
  const response = await fetch('http://localhost:3001/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: contract }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Audit failed');
  return data;
};

const Audit = () => {
  const [contract, setContract] = useState('');
  const [fileName, setFileName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const auditMutation = useMutation({
    mutationFn: postAudit,
    onSuccess: () => {
    setShowModal(true);
    setContract('');
    setFileName('');
  },
    onError: (err) => {
      alert('Audit failed: ' + err.message);
      console.error(err);
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.sol')) {
      setFileName(file.name);
      const text = await file.text();
      setContract(text);
    } else {
      alert('Please upload a valid Solidity (.sol) file.');
    }
  };

  const handleCloseModal = () => {
  setShowModal(false);
  auditMutation.reset();
};

  const handleAudit = () => {
    if (contract) auditMutation.mutate(contract);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">

      <h2 className="text-3xl font-bold text-white mb-6">Submit Smart Contract for Audit</h2>
      <WalletConnect />
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-semibold">Upload Solidity File (.sol):</label>
        <input type="file" accept=".sol" onChange={handleFileChange}
          className="block w-full text-white bg-[#1A2536] rounded p-2" />
        {fileName && (
          <div className="text-blue-400 mt-1 text-sm">Loaded: {fileName}</div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-semibold">Or paste your Solidity code:</label>
        <textarea
          className="w-full h-40 p-3 rounded bg-[#1A2536] text-white"
          placeholder="Paste your Solidity code here..."
          value={contract}
          onChange={e => setContract(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold flex justify-center items-center gap-2"
        onClick={handleAudit}
        disabled={!contract || auditMutation.isLoading}
      >
        {auditMutation.isLoading ? "Auditing..." : "Audit with AI"}
      </button>

      <AuditReportModal
        open={showModal}
        onClose={handleCloseModal}
        report={auditMutation.data}
      />
    </div>
  );
};

export default Audit;