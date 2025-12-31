const severityStyles = {
    High: "text-red-400 bg-red-500/10 border-red-500/20",
    Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Low: "text-green-400 bg-green-500/10 border-green-500/20",
};

const AuditCard = ({ audit }) => {
    return (
        <div className="bg-slate-900/80 border border-white/5 rounded-xl p-4 flex justify-between items-start">
            <div>
                <h3 className="text-white font-medium text-sm">
                    {audit.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    {audit.date}
                </p>
            </div>

            <span
                className={`px-3 py-1 rounded-full text-xs font-medium border
                ${severityStyles[audit.severity]}`}
            >
                {audit.severity}
            </span>
        </div>
    );
};

export default AuditCard;
