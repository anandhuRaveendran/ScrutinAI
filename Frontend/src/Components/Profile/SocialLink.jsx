const SocialLink = ({ icon, label, url }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg
                       bg-white/5 border border-white/10
                       text-xs text-slate-300
                       hover:bg-white/10 hover:text-white transition"
        >
            {icon}
            {label}
        </a>
    );
};

export default SocialLink;
