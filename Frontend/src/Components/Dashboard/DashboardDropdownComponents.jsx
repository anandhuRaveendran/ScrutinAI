import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileAvatar from "./ProfileAvatar";
import ProfileDropdown from "./ProfileDropdown";
import useOutsideClick from "../../hooks/useOutsideClick";

const ProfileMenu = ({ user, onLogout, onEditProfile }) => {
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, text: "Ralph Edwards wants to edit Tetrisly Design System", time: "5 min ago", unread: true },
        { id: 2, text: "New audit report generated", time: "1 hour ago", unread: true },
        { id: 3, text: "Jenny Wilson mentioned you", time: "Yesterday", unread: false },
    ]);

    useOutsideClick(wrapperRef, () => {
        setProfileOpen(false);
        setNotifOpen(false);
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, unread: false } : n)
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div ref={wrapperRef} className="relative flex items-center gap-4">
            <NotificationBell
                unreadCount={unreadCount}
                onClick={() => {
                    setNotifOpen(!notifOpen);
                    setProfileOpen(false);
                }}
            />

            {notifOpen && (
                <NotificationsDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    markAsRead={markAsRead}
                    deleteNotification={deleteNotification}
                    onViewAll={() => {
                        setNotifOpen(false);
                        navigate("/notifications");
                    }}
                />
            )}

            <ProfileAvatar
                user={user}
                onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                }}
            />

            {profileOpen && (
                <ProfileDropdown
                    user={user}
                    onLogout={onLogout}
                    onEditProfile={onEditProfile}
                />
            )}
        </div>
    );
};

export default ProfileMenu;
