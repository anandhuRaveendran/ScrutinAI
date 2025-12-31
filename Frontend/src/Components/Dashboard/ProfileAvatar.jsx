const ProfileAvatar = ({ user, onClick }) => {
    const getInitials = (first, last) =>
        ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "U";

    return (
        <button onClick={onClick} className="focus:outline-none">
            {user?.avatar ? (
                <img
                    src={user.avatar}
                    className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-blue-400 object-cover"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(user?.firstName, user?.lastName)}
                </div>
            )}
        </button>
    );
};

export default ProfileAvatar;
