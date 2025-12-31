import { useState, useRef, useEffect } from "react";
import {
    FaBell,
    FaUser,
    FaEdit,
    FaCog,
    FaSignOutAlt,
    FaTrash,
    FaCheckCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, onLogout, onEditProfile }) => {
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            text: "Ralph Edwards wants to edit Tetrisly Design System",
            time: "5 min ago",
            unread: true,
        },
        {
            id: 2,
            text: "New audit report generated",
            time: "1 hour ago",
            unread: true,
        },
        {
            id: 3,
            text: "Jenny Wilson mentioned you",
            time: "Yesterday",
            unread: false,
        },
    ]);

    /* 🔒 Close dropdowns on outside click */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setProfileOpen(false);
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, unread: false } : n
            )
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) =>
            prev.filter((n) => n.id !== id)
        );
    };

    const getInitials = (firstName, lastName) => {
        const f = firstName?.[0] || "";
        const l = lastName?.[0] || "";
        return (f + l).toUpperCase() || "U";
    };

    return (
        <div ref={wrapperRef} className="relative flex items-center gap-4">
            <button
                onClick={() => {
                    setNotifOpen(!notifOpen);
                    setProfileOpen(false);
                }}
                className="relative text-gray-300 hover:text-white"
            >
                <FaBell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] text-white rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {notifOpen && (
                <div className="absolute right-12 top-12 w-80 bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl shadow-2xl z-50">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
                        <h4 className="text-sm font-semibold text-white">
                            Notifications
                        </h4>
                        <span className="text-xs text-slate-400">
                            {unreadCount} unread
                        </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 && (
                            <p className="text-center text-slate-500 text-sm py-6">
                                No notifications
                            </p>
                        )}

                        {notifications.slice(0, 5).map((n) => (
                            <div
                                key={n.id}
                                className={`flex gap-3 px-4 py-3 border-b border-white/5 ${n.unread ? "bg-slate-700/40" : ""
                                    }`}
                            >
                                <FaBell className="text-blue-400 mt-1" />

                                <div className="flex-1">
                                    <p className="text-sm text-slate-200">
                                        {n.text}
                                    </p>
                                    <span className="text-xs text-slate-400">
                                        {n.time}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {n.unread && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="text-green-400 hover:text-green-300"
                                            title="Mark as read"
                                        >
                                            <FaCheckCircle size={12} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(n.id)}
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
                        onClick={() => {
                            setNotifOpen(false);
                            navigate("/notifications");
                        }}
                        className="w-full text-sm text-blue-400 hover:text-blue-300 py-2 border-t border-white/10"
                    >
                        View all notifications →
                    </button>
                </div>
            )}

            {/* 👤 Avatar */}
            <button
                onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                }}
                className="focus:outline-none"
            >
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-blue-400 object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {getInitials(user?.firstName, user?.lastName)}
                    </div>
                )}
            </button>

            {/* 👤 Profile Dropdown */}
            {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">
                            {user
                                ? `${user.firstName} ${user.lastName}`
                                : "Guest"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email || "No email"}
                        </p>
                    </div>

                    <ul className="py-1 text-sm">
                        <li>
                            <Link to='/profile'>
                                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white">
                                    <FaUser /> View Profile
                                </button>
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={() => {
                                    setProfileOpen(false);
                                    onEditProfile?.();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        </li>

                        <li>
                            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white">
                                <FaCog /> Settings
                            </button>
                        </li>

                        <li className="border-t border-white/10 mt-1">
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10"
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
