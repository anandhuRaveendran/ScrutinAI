import { useAuth } from "../../context/AuthContext";

const demoStats = {
    audits: 12,
    accuracy: 97,
    rewards: 320,
    badges: [
        { name: "Top Auditor", icon: "🏆" },
        { name: "Bug Hunter", icon: "🔍" },
    ],
};

const DashboardProfile = () => {
    const { user } = useAuth();

    const getInitials = (firstName, lastName) => {
        const f = firstName ? firstName[0] : "";
        const l = lastName ? lastName[0] : "";
        return (f + l).toUpperCase() || "U";
    };

    return (
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-[#071021] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-600 object-cover" />
                    ) : (
                        <div className="w-20 h-20 rounded-full border-4 border-blue-600 bg-blue-900 flex items-center justify-center text-xl font-bold text-white">
                            {getInitials(user?.firstName, user?.lastName)}
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-white">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</h2>
                        <p className="text-sm text-slate-300 mt-1">
                            {user?.role || "user"} • {user?.location || "Unknown"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-lg font-semibold text-blue-300">{demoStats.audits}</div>
                        <div className="text-xs text-slate-400">Audits</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-green-300">{demoStats.accuracy}%</div>
                        <div className="text-xs text-slate-400">Accuracy</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-yellow-300">{demoStats.rewards}</div>
                        <div className="text-xs text-slate-400">Rewards</div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm text-slate-300 mb-2">Badges</h4>
                    <div className="flex flex-wrap gap-2">
                        {demoStats.badges.map((b) => (
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
            </div>

            <div className=" mt-4 bg-[#071021] rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Quick Stats</h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>High Severity Issues</span>
                        <span className="font-semibold text-red-400">12</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Avg Audit Duration</span>
                        <span className="font-semibold text-blue-300">3.4 days</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>False Positive Rate</span>
                        <span className="font-semibold text-yellow-300">4%</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Contracts Audited (This Month)</span>
                        <span className="font-semibold text-green-300">7</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardProfile;