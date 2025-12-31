const SkillsTab = ({ skills }) => {
    if (!skills.length) {
        return <p className="text-slate-400 text-sm">No skills added.</p>;
    }

    return (
        <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
                <span
                    key={skill}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
};

export default SkillsTab;
