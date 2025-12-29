import { FaBell, FaCheckCircle, FaTrash } from "react-icons/fa";

const notifications = [
    {
        id: 1,
        text: "Ralph Edwards wants to edit Tetrisly Design System",
        date: "2025-01-01",
        time: "10:30 AM",
        unread: true,
    },
    {
        id: 2,
        text: "New audit report generated",
        date: "2025-01-01",
        time: "9:00 AM",
        unread: false,
    },
    {
        id: 3,
        text: "Jenny Wilson mentioned you",
        date: "2024-12-31",
        time: "6:20 PM",
        unread: false,
    },
    {
        id: 4,
        text: "Jacob Jones started following you",
        date: "2024-12-30",
        time: "11:00 AM",
        unread: false,
    },
];

// 🔹 Group by date
const grouped = notifications.reduce((acc, n) => {
    acc[n.date] = acc[n.date] || [];
    acc[n.date].push(n);
    return acc;
}, {});

const Notifications = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-white">
                    Notifications
                </h1>
                <p className="text-slate-400 text-sm">
                    Your activity & updates
                </p>
            </div>

            {/* Day-wise Notifications */}
            <div className="space-y-8">
                {Object.keys(grouped).map((date) => (
                    <div key={date}>
                        {/* Date */}
                        <h3 className="text-sm font-semibold text-slate-400 mb-3">
                            {new Date(date).toDateString()}
                        </h3>

                        {/* List */}
                        <div className="space-y-3">
                            {grouped[date].map((n) => (
                                <div
                                    key={n.id}
                                    className={`flex gap-4 p-4 rounded-lg border border-white/5 ${n.unread
                                            ? "bg-slate-700/40"
                                            : "bg-slate-800/40"
                                        }`}
                                >
                                    <FaBell className="text-blue-400 mt-1" />

                                    <div className="flex-1">
                                        <p className="text-slate-200">
                                            {n.text}
                                        </p>
                                        <span className="text-xs text-slate-400">
                                            {n.time}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        {n.unread && (
                                            <button className="text-green-400 hover:text-green-300">
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                        <button className="text-red-400 hover:text-red-300">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
