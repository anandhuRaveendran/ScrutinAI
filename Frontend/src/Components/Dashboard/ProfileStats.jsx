const ProfileStats = () => {
    return (
        <div
            className="
        w-[300px] h-20
        flex items-center justify-between
        px-4
        rounded-xl
        bg-gradient-to-br from-slate-900 to-slate-800
        border border-white/10
        shadow-lg
      "
        >
            {/* Audits */}
            <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-sm leading-none">
                    4
                </span>
                <span className="text-orange-500 text-xs">🛡️</span>
                <span className="text-slate-400 text-xs leading-none">
                    Audits
                </span>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-white/10" />

            {/* Followers */}
            <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-sm leading-none">
                    3
                </span>
                <span className="text-orange-500 text-xs">👥</span>
                <span className="text-slate-400 text-xs leading-none">
                    Followers
                </span>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-white/10" />

            {/* Following */}
            <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-sm leading-none">
                    4
                </span>
                <span className="text-orange-500 text-xs">➕</span>
                <span className="text-slate-400 text-xs leading-none">
                    Following
                </span>
            </div>
        </div>
    );
};

export default ProfileStats;
