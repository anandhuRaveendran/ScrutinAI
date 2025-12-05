import React from "react";
import { FaEye, FaDownload } from "react-icons/fa";

const REPORTS = [
  { id: 1, name: "ERC721 Membership Audit", date: "12/07/24", status: "Resolved" },
  { id: 2, name: "DeFi Staking Contract Audit", date: "10/07/24", status: "Resolved" },
  { id: 3, name: "DAO Governance Audit", date: "05/07/24", status: "Informational" },
];

const TABLE_HEAD = ["Report Name", "Date", "Status", "Actions"];

export default function AuditReports() {
  const handleView = (report) => {
    alert(`View report: "${report.name}"`);
  };

  const handleDownload = (report) => {
    alert(`Download for "${report.name}" coming soon!`);
  };

  return (
    <div className="bg-[#071021] border border-[#152231] rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#152231] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Audit Reports</h3>
          <p className="text-sm text-gray-400">Recent published audits</p>
        </div>
        <div className="text-sm text-gray-400">Total: {REPORTS.length}</div>
      </div>

      <div className="p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase">
              {TABLE_HEAD.map((h) => (
                <th key={h} className="py-3 px-4">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#0e1a28]">
            {REPORTS.map((report, idx) => (
              <tr key={report.id} className="hover:bg-[#081627] transition">
                <td className="py-4 px-4">
                  <div className="font-medium text-white">{report.name}</div>
                </td>
                <td className="py-4 px-4 text-gray-300">{report.date}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-4 px-4 flex gap-3">
                  <button onClick={() => handleView(report)} className="p-2 rounded-md bg-[#082233] hover:bg-[#0b2f42]">
                    <FaEye className="text-gray-200" />
                  </button>
                  <button onClick={() => handleDownload(report)} className="p-2 rounded-md bg-[#082233] hover:bg-[#0b2f42]">
                    <FaDownload className="text-gray-200" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
