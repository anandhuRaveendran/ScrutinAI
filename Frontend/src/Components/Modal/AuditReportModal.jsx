import React, { useState } from "react";
import { FaExpand, FaDownload } from "react-icons/fa";

const report = {
  summary: `This Solidity smart contract provides a mechanism to mint an ERC721 for a membership into a particular organization or club. First, the contract imports OpenZeppelin's ERC721 contract and all necessary functions are provided for for minting and managing the token. Security features have been implemented which provide only the owner to call certain functions during the minting procedure. The contract consists of several data structures. The first is a 'Membership' struct which provides the id, name, cost, and date for a membership type available to mint. A 'UserMembership' struct stores data specific to a particular user's account such as the id, membershipid, address, cost and expire date. In addition, several mappings are used to organize the data. The 'list()' function is used to register a new membership type. Here the owner enters the name, cost and date for the new type and the information is added to the 'Membership' struct. Next the 'mint()' function is used to actually create the ERC721 token. Here the owner must enter the membershipID, user address, and expire.`,
  issues: [
    { severity: 'High', desc: 'Reentrancy vulnerability in withdraw()' },
    { severity: 'Medium', desc: 'Unrestricted write to storage variable' },
  ],
  suggestions: [
    'Use reentrancy guard modifier.',
    'Add access control to sensitive functions.',
  ],
  score: 85,
};

export default function AuditReportModal({ open, onClose, report }) {
  const [fullscreen, setFullscreen] = useState(false);

  const handleDownloadPDF = () => {
    alert("Download PDF feature coming soon!");
  };

  if (!open || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div
        className={`relative bg-[#1A2536] text-white rounded-xl shadow-2xl flex flex-col
          ${fullscreen ? "w-[90vw] h-[90vh]" : "w-[500px] h-[600px]"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-white z-10"
        >
          &times;
        </button>
        <div className="text-2xl font-bold text-center py-5 border-b border-[#23262F]">
          Audit Report
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <p className="text-purple-200 mb-6 text-center leading-relaxed">
            {report.summary}
          </p>
          <div className="mb-2 text-yellow-400 text-lg font-semibold">Score: {report.score}</div>
          <div className="mb-2">
            <span className="text-white font-semibold">Issues:</span>
            <ul className="list-disc ml-6">
              {report.issues && report.issues.map((issue, i) => (
                <li key={i} className={issue.severity === 'High' ? 'text-red-400' : 'text-yellow-300'}>
                  [{issue.severity}] {issue.desc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-white font-semibold">Suggestions:</span>
            <ul className="list-disc ml-6 text-blue-300">
              {report.suggestions && report.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
        <div className="absolute bottom-4 right-6 flex gap-4">
          <button
            onClick={() => setFullscreen(f => !f)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            title={fullscreen ? "Exit Fullscreen" : "View Fullscreen"}
          >
            <FaExpand />
            {fullscreen ? "Exit Fullscreen" : "View Fullscreen"}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white"
            title="Download PDF"
          >
            <FaDownload />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}