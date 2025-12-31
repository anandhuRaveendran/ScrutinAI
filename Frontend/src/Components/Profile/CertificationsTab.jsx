const CertificationsTab = ({ certifications }) => {
    if (!certifications.length) {
        return <p className="text-slate-400 text-sm">No certifications added.</p>;
    }

    return (
        <div className="space-y-4">
            {certifications.map(cert => (
                <div
                    key={cert._id}
                    className="bg-slate-900/80 border border-white/5 rounded-xl p-4"
                >
                    <p className="text-white font-medium">{cert.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                        Issued by {cert.issuer}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CertificationsTab;
