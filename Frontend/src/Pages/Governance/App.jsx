import React, { useState } from "react";
import { FaUserTie, FaFileAlt } from "react-icons/fa";
import Auditors from "../../Components/Tables/Auditors";
import AuditReports from "../../Components/Tables/AuditReports";

const Community = () => {
  const [selected, setSelected] = useState("auditors");

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 hidden md:flex flex-col gap-4">
            <div className="bg-[#071021] border border-[#152231] rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-400 mb-3">Community</div>

              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => setSelected("auditors")}
                  className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition
                    ${selected === "auditors"
                      ? "bg-gradient-to-r from-[#05122a] to-[#0a2a3d] text-white shadow-md ring-1 ring-white/5"
                      : "text-gray-300 hover:bg-[#081826]"}
                  `}
                >
                  <FaUserTie className="w-5 h-5 text-[#7dd3fc]" />
                  <span className="font-medium">Auditors</span>
                </button>

                <button
                  onClick={() => setSelected("reports")}
                  className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition
                    ${selected === "reports"
                      ? "bg-gradient-to-r from-[#05122a] to-[#0a2a3d] text-white shadow-md ring-1 ring-white/5"
                      : "text-gray-300 hover:bg-[#081826]"}
                  `}
                >
                  <FaFileAlt className="w-5 h-5 text-[#fda4af]" />
                  <span className="font-medium">Audit Reports</span>
                </button>
              </nav>
            </div>

            {/* small help/info card */}
            <div className="bg-[#071021] border border-[#152231] rounded-xl p-4 text-sm text-gray-300">
              <div className="font-semibold text-white mb-1">Community Tips</div>
              <p className="text-xs leading-relaxed">
                Connect with auditors, review past reports, and reward accurate findings.
                Use the "View" action to inspect each report in detail.
              </p>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <div className="bg-transparent rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold">Community Dashboard</h1>
                <div className="text-sm text-gray-400 hidden sm:block">
                  {selected === "auditors" ? "Directory of registered auditors" : "All published audit reports"}
                </div>
              </div>

              <div className="space-y-6">
                {selected === "auditors" && <Auditors />}
                {selected === "reports" && <AuditReports />}
              </div>
            </div>
          </main>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden mt-6">
          <div className="bg-[#071021] border border-[#152231] rounded-xl p-3 flex justify-around">
            <button
              onClick={() => setSelected("auditors")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${selected === "auditors" ? "bg-[#083047] text-white" : "text-gray-300"}`}
            >
              <FaUserTie /> <span className="text-sm">Auditors</span>
            </button>
            <button
              onClick={() => setSelected("reports")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${selected === "reports" ? "bg-[#083047] text-white" : "text-gray-300"}`}
            >
              <FaFileAlt /> <span className="text-sm">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
