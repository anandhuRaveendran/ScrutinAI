import { Link } from "react-router-dom";
import {
    FaUser,
    FaEdit,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

const ProfileDropdown = ({ user, onLogout, onEditProfile }) => {
    return (
        <div className="absolute right-0 top-12 w-56 bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl z-50">
            <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">
                    {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                    {user?.email || "No email"}
                </p>
            </div>

            <ul className="py-1 text-sm">
                <li>
                    <Link to="/profile">
                        <button className="menu-btn">
                            <FaUser /> View Profile
                        </button>
                    </Link>
                </li>

                <li>
                    <button onClick={onEditProfile} className="menu-btn">
                        <FaEdit /> Edit Profile
                    </button>
                </li>

                <li>
                    <button className="menu-btn">
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
    );
};

export default ProfileDropdown;
