import { useState, useRef, useEffect } from "react";
import {
    FaBell,
    FaUser,
    FaEdit,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

const ProfileMenu = ({ user, onLogout, onEditProfile }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (firstName, lastName) => {
        const f = firstName ? firstName[0] : "";
        const l = lastName ? lastName[0] : "";
        return (f + l).toUpperCase() || "U";
    };

    return (
        <div className="relative flex items-center gap-4" ref={menuRef}>
            {/* 🔔 Notifications */}
            <button className="relative text-gray-300 hover:text-white transition">
                <FaBell />
                <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] text-white rounded-full px-1">
                    2
                </span>
            </button>

            {/* 👤 Avatar */}
            <button onClick={() => setOpen(!open)} className="focus:outline-none">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-blue-400 transition object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-blue-400 transition bg-blue-900 flex items-center justify-center text-xs font-bold text-white">
                        {getInitials(user?.firstName, user?.lastName)}
                    </div>
                )}
            </button>

            {/* ⬇️ Dropdown */}
            {open && (
                <div className="absolute right-0 top-14 w-56 bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">
                            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email || "No email"}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <ul className="py-1 text-sm">
                        <li>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white"
                            >
                                <FaUser /> View Profile
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    if (onEditProfile) onEditProfile();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        </li>

                        <li>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white"
                            >
                                <FaCog /> Settings
                            </button>
                        </li>

                        <li className="border-t border-white/10 mt-1">
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
