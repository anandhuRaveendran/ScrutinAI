import React from "react";
import { FaTwitter, FaLinkedin, FaSearch, FaBell } from "react-icons/fa";
import AuditPie from "../../Components/Charts/PieChart";

const user = {
  name: "Jane Doe",
  avatar: "https://i.pravatar.cc/120?img=5",
  title: "Smart Contract Auditor",
  location: "Berlin, Germany",
  audits: 12,
  accuracy: 97,
  rewards: 320,
  badges: [
    { name: "Top Auditor", icon: "🏆" },
    { name: "Bug Hunter", icon: "🔍" },
  ],
  history: [
    { id: 1, contract: "TokenVesting.sol", date: "2024-07-10", status: "Passed", score: 98 },
    { id: 2, contract: "NFTMarketplace.sol", date: "2024-07-08", status: "Issues Found", score: 85 },
    // add more rows as needed
  ],
};

const pieData = [
  { name: "Passed", value: 8 },
  { name: "Issues Found", value: 3 },
  { name: "Manual Review", value: 1 },
];

export default function Dashboard() {


  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FaSearch className="text-white text-xl" />

            <input
              className="bg-white/5 placeholder:text-slate-300 rounded-lg px-4 py-2 w-[420px] outline-none"
              placeholder="Search audits, contracts..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-300 hover:text-white">
              <FaBell />
              <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] text-white rounded-full px-1">2</span>
            </button>
            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-[#071021] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-sm text-slate-300 mt-1">
                    {user.title} • {user.location}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm">Connect</button>
                    <button className="px-3 py-1 rounded-full bg-white/5 text-slate-200 text-sm">Message</button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-blue-300">{user.audits}</div>
                  <div className="text-xs text-slate-400">Audits</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-300">{user.accuracy}%</div>
                  <div className="text-xs text-slate-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-yellow-300">{user.rewards}</div>
                  <div className="text-xs text-slate-400">Rewards</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm text-slate-300 mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((b) => (
                    <div
                      key={b.name}
                      className="bg-white/5 px-3 py-1 rounded-full text-sm text-slate-200 flex items-center gap-2"
                    >
                      <span>{b.icon}</span>
                      <span>{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm text-slate-300 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/30 px-2 py-1 text-xs rounded">Solidity</span>
                  <span className="bg-white/30 px-2 py-1 text-xs rounded">Ethers.js</span>
                  <span className="bg-white/30 px-2 py-1 text-xs rounded">Hardhat</span>
                </div>
              </div>
            </div>

            {/* real contribution heatmap */}
            <div className="bg-[#071021] rounded-2xl p-4 mt-6">
              <h4 className="text-white font-semibold mb-3">Certifications</h4>

              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Certified Solidity Auditor</li>
                <li>• Blockchain Security Engineer — Level 2</li>
                <li>• Web3 Security Researcher Certification</li>
              </ul>
            </div>

          </aside>

          {/* main content */}
          <main className="col-span-12 md:col-span-8 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Critical Issues Found */}
              <div className="bg-[#071021] p-4 rounded-xl">
                <div className="text-sm text-slate-400">Critical Issues Found</div>
                <div className="text-2xl font-bold text-red-400">14</div>
              </div>

              {/* Average Severity Score */}
              <div className="bg-[#071021] p-4 rounded-xl">
                <div className="text-sm text-slate-400">Average Severity Score</div>
                <div className="text-2xl font-bold text-yellow-300">8.7</div>
              </div>

              {/* Total Contracts Audited */}
              <div className="bg-[#071021] p-4 rounded-xl">
                <div className="text-sm text-slate-400">Contracts Audited</div>
                <div className="text-2xl font-bold text-blue-300">42</div>
              </div>
            </div>

            <div className="bg-[#071021] rounded-2xl p-4 mb-4">
              <h3 className="text-white font-semibold mb-3">About Auditor</h3>
              <div className="text-slate-300 text-sm">
                Specialized in smart contract security with expertise in Solidity, DeFi protocols, and EVM-based vulnerability
                analysis. Experienced in detecting reentrancy, access control flaws, flash-loan exploits, and economic attacks.
              </div>
            </div>

            <div className="bg-[#071021] rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3">Audit History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-sm">
                      <th className="px-4 py-2">Contract</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.history.map((item) => (
                      <tr key={item.id} className="border-t border-white/6">
                        <td className="px-4 py-3">{item.contract}</td>
                        <td className="px-4 py-3 text-slate-300">{item.date}</td>
                        <td
                          className={`px-4 py-3 ${item.status === "Passed" ? "text-green-400" : "text-yellow-300"}`}
                        >
                          {item.status}
                        </td>
                        <td className="px-4 py-3">{item.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </div>

            <div className="bg-[#071021] rounded-2xl p-4 mt-6">
              <h4 className="text-white font-semibold mb-3">Audit Insights</h4>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Most Common Vulnerability</span>
                  <span className="font-semibold text-red-400">Reentrancy</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Issues Found</span>
                  <span className="font-semibold text-yellow-300">54</span>
                </div>

                <div className="flex justify-between">
                  <span>Avg. Report Score</span>
                  <span className="font-semibold text-green-300">92%</span>
                </div>

                <div className="flex justify-between">
                  <span>Detection Accuracy</span>
                  <span className="font-semibold text-blue-300">96%</span>
                </div>
              </div>
            </div>

          </main>

          {/* right column - charts and stats */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              <AuditPie data={pieData} />

              <div className="bg-[#071021] rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Quick Stats</h4>

                <div className="space-y-3">
                  {/* High Severity Issues */}
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>High Severity Issues</span>
                    <span className="font-semibold text-red-400">12</span>
                  </div>

                  {/* Avg Audit Time */}
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Avg Audit Duration</span>
                    <span className="font-semibold text-blue-300">3.4 days</span>
                  </div>

                  {/* False Positive Rate */}
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>False Positive Rate</span>
                    <span className="font-semibold text-yellow-300">4%</span>
                  </div>

                  {/* Audits This Month */}
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Contracts Audited (This Month)</span>
                    <span className="font-semibold text-green-300">7</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#071021] rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Contacts</h4>
                <div className="flex items-center gap-3">
                  <button className="bg-white/5 px-3 py-2 rounded text-slate-200 flex items-center gap-2">
                    <FaTwitter /> Twitter
                  </button>
                  <button className="bg-white/5 px-3 py-2 rounded text-slate-200 flex items-center gap-2">
                    <FaLinkedin /> LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
