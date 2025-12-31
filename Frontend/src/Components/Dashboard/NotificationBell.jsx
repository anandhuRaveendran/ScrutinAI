import { FaBell } from "react-icons/fa";

const NotificationBell = ({ unreadCount, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="relative text-gray-300 hover:text-white"
        >
            <FaBell size={18} />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] text-white rounded-full px-1">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;
