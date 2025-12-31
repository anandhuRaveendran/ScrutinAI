import { followersData, followingData, auditsData } from "../../data/ProfileMockData";

const ProfileTabs = ({ user, activeTab, setActiveTab }) => {
    const tabs = [
        { key: "followers", label: "Followers", count: followersData.length },
        { key: "following", label: "Following", count: followingData.length },
        { key: "audits", label: "Audits", count: auditsData.length },
        { key: "skills", label: "Skills", count: user.skills.length },
        { key: "certifications", label: "Certifications", count: user.certifications.length },
    ];

    return (
        <div className="flex flex-wrap gap-8 mt-10 border-b border-white/10">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 text-sm font-medium transition ${activeTab === tab.key
                        ? "text-[#04d9ff] border-b-2 border-[#04d9ff]"
                        : "text-slate-400 hover:text-white"
                        }`}
                >
                    {tab.label}
                    <span className="ml-2 text-xs opacity-70">{tab.count}</span>
                </button>
            ))}
        </div>
    );
};

export default ProfileTabs;