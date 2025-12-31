const UserCard = ({ user }) => {
    return (
        <div className="flex items-center justify-between bg-slate-900/80 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
                <img
                    src={user.avatar}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-[#04d9ff]">{user.role}</p>
                </div>
            </div>
            <button className="text-slate-400 hover:text-white">→</button>
        </div>
    );
};

export default UserCard;
