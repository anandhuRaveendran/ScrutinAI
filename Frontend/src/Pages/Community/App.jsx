import React from 'react';

const leaderboard = [
  { name: "Jane Doe", points: 320, audits: 12 },
  { name: "John Smith", points: 280, audits: 10 },
  { name: "Alice", points: 250, audits: 9 },
];

const Community = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h2 className="text-3xl font-bold text-white mb-6">Leaderboard</h2>
    <div className="bg-[#1A2536] rounded-lg p-6 mb-8">
      <table className="min-w-full text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2">Points</th>
            <th className="px-4 py-2">Audits</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, i) => (
            <tr key={i} className="border-t border-[#22304a]">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.points}</td>
              <td className="px-4 py-2">{user.audits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <h3 className="text-xl text-white font-semibold mb-2">Community Voting</h3>
    <div className="bg-[#1A2536] rounded-lg p-6">
      <p className="text-gray-300 mb-2">Vote on the next feature:</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2">Real-time Chat</button>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">More Tutorials</button>
    </div>
  </div>
);

export default Community;