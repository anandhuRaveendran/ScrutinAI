import React from 'react';

const user = {
  name: "Jane Doe",
  avatar: "https://i.pravatar.cc/100?img=5",
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
  ]
};

const Dashboard = () => (
  <div className="max-w-5xl mx-auto py-10 px-4">
    <div className="flex items-center space-x-6 mb-8">
      <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-500" />
      <div>
        <h2 className="text-3xl font-bold text-white">{user.name}</h2>
        <div className="flex space-x-2 mt-2">
          {user.badges.map(badge => (
            <span key={badge.name} className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="mr-1">{badge.icon}</span> {badge.name}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-[#1A2536] rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-blue-400">{user.audits}</div>
        <div className="text-gray-300 mt-2">Total Audits</div>
      </div>
      <div className="bg-[#1A2536] rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-green-400">{user.accuracy}%</div>
        <div className="text-gray-300 mt-2">Accuracy</div>
      </div>
      <div className="bg-[#1A2536] rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-yellow-400">{user.rewards}</div>
        <div className="text-gray-300 mt-2">Rewards</div>
      </div>
    </div>
    <h3 className="text-2xl text-white font-semibold mb-4">Audit History</h3>
    <div className="bg-[#1A2536] rounded-lg overflow-x-auto">
      <table className="min-w-full text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Contract</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {user.history.map(item => (
            <tr key={item.id} className="border-t border-[#22304a]">
              <td className="px-4 py-2">{item.contract}</td>
              <td className="px-4 py-2">{item.date}</td>
              <td className={`px-4 py-2 ${item.status === "Passed" ? "text-green-400" : "text-red-400"}`}>{item.status}</td>
              <td className="px-4 py-2">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;