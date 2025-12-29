import { FaTrash, FaCheckCircle } from "react-icons/fa";

const NotificationDropdown = ({
    notifications,
    onRead,
    onDelete,
    onViewAll,
}) => {
    return (
        <div className="absolute right-12 top-12 w-80 bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl shadow-2xl z-50">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
                <h4 className="text-white text-sm font-semibold">
                    Notifications
                </h4>
                <span className="text-xs text-slate-400">
                    {notifications.filter((n) => n.unread).length} unread
                </span>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-6">
                        No notifications
                    </p>
                )}

                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`flex gap-3 px-4 py-3 border-b border-white/5
              ${n.unread ? "bg-slate-700/40" : ""}
            `}
                    >
                        <div className="mt-1">{n.icon}</div>

                        <div className="flex-1">
                            <p className="text-sm text-slate-200 leading-snug">
                                {n.text}
                            </p>
                            <span className="text-xs text-slate-400">
                                {n.time}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {n.unread && (
                                <button
                                    onClick={() => onRead(n.id)}
                                    className="text-green-400 hover:text-green-300"
                                    title="Mark as read"
                                >
                                    <FaCheckCircle size={12} />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(n.id)}
                                className="text-red-400 hover:text-red-300"
                                title="Delete"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <button
                onClick={onViewAll}
                className="w-full text-sm text-blue-400 hover:text-blue-300 py-2 border-t border-white/10"
            >
                View all notifications →
            </button>
        </div>
    );
};

export default NotificationDropdown;
