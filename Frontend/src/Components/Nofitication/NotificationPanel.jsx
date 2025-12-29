import { useState } from "react";
import {
    FaUserPlus,
    FaFileAlt,
    FaBell,
    FaTrash,
    FaCheckCircle,
} from "react-icons/fa";

const initialNotifications = [
    {
        id: 1,
        text: "Ralph Edwards wants to edit Tetrisly Design System",
        time: "5 min ago",
        unread: true,
        icon: <FaUserPlus className="text-blue-400" />,
    },
    {
        id: 2,
        text: "Robert Fox added file to Dark mode",
        time: "1 hour ago",
        unread: true,
        icon: <FaFileAlt className="text-purple-400" />,
    },
    {
        id: 3,
        text: "New audit report generated",
        time: "Today",
        unread: false,
        icon: <FaBell className="text-green-400" />,
    },
    {
        id: 4,
        text: "Jacob Jones started following you",
        time: "Yesterday",
        unread: false,
        icon: <FaUserPlus className="text-cyan-400" />,
    },
    {
        id: 5,
        text: "Jenny Wilson mentioned you in a comment",
        time: "Yesterday",
        unread: false,
        icon: <FaBell className="text-yellow-400" />,
    },
];

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, unread: false } : n
            )
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Notifications</h4>
                <span className="text-xs text-slate-400">
                    {notifications.filter((n) => n.unread).length} unread
                </span>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {notifications.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-6">
                        No notifications
                    </p>
                )}

                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`flex gap-3 p-3 rounded-lg transition-all hover:scale-[1.01]
              ${n.unread ? "bg-slate-700/40" : "bg-slate-800/40"}
            `}
                    >
                        {/* Icon */}
                        <div className="mt-1">{n.icon}</div>

                        {/* Content */}
                        <div className="flex-1">
                            <p className="text-sm text-slate-200 leading-snug">
                                {n.text}
                            </p>
                            <span className="text-xs text-slate-400">
                                {n.time}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            {n.unread && (
                                <button
                                    onClick={() => markAsRead(n.id)}
                                    title="Mark as read"
                                    className="text-green-400 hover:text-green-300"
                                >
                                    <FaCheckCircle size={14} />
                                </button>
                            )}
                            <button
                                onClick={() => deleteNotification(n.id)}
                                title="Delete"
                                className="text-red-400 hover:text-red-300"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
