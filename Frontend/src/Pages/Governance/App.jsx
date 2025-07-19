import React, { useState } from "react";
import { FaUserTie, FaFileAlt } from "react-icons/fa";
import Auditors from "../../Components/Tables/Auditors"; // Adjust the path as needed
import AuditReports from "../../Components/Tables/AuditReports"; // Adjust the path as needed

const Community = () => {
  const [selected, setSelected] = useState("auditors");

  return (
    <div className="flex min-h-screen bg-[#101828]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#22304a] p-6 flex flex-col gap-2">
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition ${
            selected === "auditors"
              ? "bg-[#22304a] text-white"
              : "text-gray-300 hover:bg-[#22304a]"
          }`}
          onClick={() => setSelected("auditors")}
        >
          <FaUserTie /> Auditors
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition ${
            selected === "reports"
              ? "bg-[#22304a] text-white"
              : "text-gray-300 hover:bg-[#22304a]"
          }`}
          onClick={() => setSelected("reports")}
        >
          <FaFileAlt /> Audit Reports
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {selected === "auditors" && <Auditors />}
        {selected === "reports" && <AuditReports />}
      </main>
    </div>
  );
};

export default Community;