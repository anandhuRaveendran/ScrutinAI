
const DashboardMainComponent = () => {

    const demoStats = {
        history: [
            { id: 1, contract: "0xAbC123...789", date: "2024-05-01", status: "Passed", score: 95 },
            { id: 2, contract: "0xDeF456...012", date: "2024-04-28", status: "Issues Found", score: 78 },
            { id: 3, contract: "0xGhI789...345", date: "2024-04-25", status: "Passed", score: 88 },
            { id: 4, contract: "0xJkL012...678", date: "2024-04-20", status: "Passed", score: 92 },

        ],

    };


    return (
        <main className="col-span-12 md:col-span-8 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#071021] p-4 rounded-xl">
                    <div className="text-sm text-slate-400">Critical Issues Found</div>
                    <div className="text-2xl font-bold text-red-400">14</div>
                </div>

                <div className="bg-[#071021] p-4 rounded-xl">
                    <div className="text-sm text-slate-400">Average Severity Score</div>
                    <div className="text-2xl font-bold text-yellow-300">8.7</div>
                </div>

                <div className="bg-[#071021] p-4 rounded-xl">
                    <div className="text-sm text-slate-400">Contracts Audited</div>
                    <div className="text-2xl font-bold text-blue-300">42</div>
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
                            {demoStats.history.map((item) => (
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
    );
};

export default DashboardMainComponent;