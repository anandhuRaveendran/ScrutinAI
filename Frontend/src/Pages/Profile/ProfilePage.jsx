import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../Components/Loader/app";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileTabContent from "./ProfileTabContent";

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("followers");

    if (!user) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 bg-black min-h-screen">
            <ProfileHeader user={user} />
            <ProfileTabs user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
            <ProfileTabContent user={user} activeTab={activeTab} />
        </div>
    );
};

export default ProfilePage;
