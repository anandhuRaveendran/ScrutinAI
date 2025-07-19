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
    <div className="w-full max-w-full border border-white rounded-lg shadow">
      <table className="w-full text-left">
        <thead>
          <tr className="text-white text-sm border-b">
            <th className="py-3 px-4 font-semibold">Auditor</th>
            <th className="py-3 px-4 font-semibold">Score</th>
            <th className="py-3 px-4 font-semibold">Audits</th>
          </tr>
        </thead>
        <tbody>
          {AUDITORS.map((auditor, idx) => (
            <tr
              key={auditor.email}
              className="border-b last:border-b-0  transition"
            >
              {/* Profile */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={auditor.img}
                    alt={auditor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-white">{auditor.name}</div>
                  </div>
                </div>
              </td>
              {/* Function */}
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium text-white">{auditor.score}</div>
                </div>
              </td>
              {/* audits */}
              <td className="py-3 px-4 text-white font-medium">{auditor.audits}</td>
              {/* Edit */}
              <td className="py-3 px-4">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <EyeIcon className="w-4 h-4 text-gray-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}