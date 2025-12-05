import React from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

const AUDITORS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    score: "120",
    audits: "23",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    score: "200",
    audits: "04",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    score: "2020",
    audits: "209",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    score: "10",
    audits: "01",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    score: "20",
    audits: "01",
  },
];

export default function AuditorsTable() {
  return (
    <div className="bg-[#071021] border border-[#152231] rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#152231] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Trusted Auditors</h3>
          <p className="text-sm text-gray-400">Top contributors and their activity</p>
        </div>
        <div className="text-sm text-gray-400">Total: {AUDITORS.length}</div>
      </div>

      <div className="p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase">
              <th className="py-3 px-4">Auditor</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Audits</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0e1a28]">
            {AUDITORS.map((auditor, idx) => (
              <tr key={auditor.name} className="hover:bg-[#081627] transition">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={auditor.img} alt={auditor.name} className="w-12 h-12 rounded-full object-cover ring-1 ring-white/5" />
                    <div>
                      <div className="font-medium text-white">{auditor.name}</div>
                      <div className="text-xs text-gray-400">Lead auditor</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-white">{auditor.score}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white font-medium">{auditor.audits}</div>
                </td>
                <td className="py-4 px-4">
                  <button className="p-2 rounded-md bg-[#082233] hover:bg-[#0b2f42] transition" aria-label={`View ${auditor.name}`}>
                    <EyeIcon className="w-4 h-4 text-gray-300" />
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
