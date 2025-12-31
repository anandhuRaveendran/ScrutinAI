import { auditsData } from "../../data/ProfileMockData";
import AuditCard from "./AuditCard";

const AuditsTab = () => {
    if (!auditsData.length) {
        return (
            <p className="text-slate-400 text-sm">
                No audits available.
            </p>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {auditsData.map(audit => (
                <AuditCard key={audit._id} audit={audit} />
            ))}
        </div>
    );
};

export default AuditsTab;
