import FollowersTab from "../../Components/Profile/FollowersTab";
import FollowingTab from "../../Components/Profile/FollowingTab";
import AuditsTab from "../../Components/Profile/AuditsTab";
import SkillsTab from "../../Components/Profile/SkillsTab";
import CertificationsTab from "../../Components/Profile/CertificationsTab";

const ProfileTabContent = ({ user, activeTab }) => {
    return (
        <div className="mt-8">
            {activeTab === "followers" && <FollowersTab />}
            {activeTab === "following" && <FollowingTab />}
            {activeTab === "audits" && <AuditsTab />}
            {activeTab === "skills" && <SkillsTab skills={user.skills} />}
            {activeTab === "certifications" && (
                <CertificationsTab certifications={user.certifications} />
            )}
        </div>
    );
};

export default ProfileTabContent;
