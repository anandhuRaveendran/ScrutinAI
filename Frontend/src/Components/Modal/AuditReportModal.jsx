import React, { useState } from "react";
import { FaExpand, FaDownload } from "react-icons/fa";
import { cleanAudit } from "../../utils/CleanAudit";


export default function AuditReportModal({ open, onClose, report }) {
  const [fullscreen, setFullscreen] = useState(false);

  const handleDownloadPDF = () => {
    alert("Download PDF feature coming soon!");
  };

  if (!open || !report) return null;

  const auditText = report.audit || report.summary || 'No report available';
  const cleanedReport = cleanAudit(auditText);

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
            {cleanedReport}
          </p>
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