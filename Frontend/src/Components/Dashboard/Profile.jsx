import { useState } from "react";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaGithub,
    FaLinkedin,
    FaDiscord,
    FaLink,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import ProfileStats from "./ProfileStats";


const followersData = [
    {
        _id: "1",
        name: "Ajay Thampi",
        avatar: "https://i.pravatar.cc/100?img=1",
        role: "Lead Blockchain Developer",
    },
    {
        _id: "2",
        name: "Anandu Raveendran",
        avatar: "https://i.pravatar.cc/100?img=2",
        role: "Software Engineer",
    },
    {
        _id: "3",
        name: "Rahul Sajeevan",
        avatar: "https://i.pravatar.cc/100?img=3",
        role: "Freelancer",
    },
];

const followingData = [
    {
        _id: "4",
        name: "web3_hacker",
        avatar: "https://i.pravatar.cc/100?img=4",
        role: "Protocol Engineer",
    },
    {
        _id: "5",
        name: "audit_master",
        avatar: "https://i.pravatar.cc/100?img=5",
        role: "Lead Auditor",
    },
];

const auditsData = [
    {
        _id: "a1",
        title: "ERC20 Smart Contract Audit",
        severity: "High",
        date: "Jan 2025",
    },
    {
        _id: "a2",
        title: "Rust Program Security Review",
        severity: "Medium",
        date: "Dec 2024",
    },
    {
        _id: "a3",
        title: "NFT Marketplace Audit",
        severity: "Low",
        date: "Nov 2024",
    },
];


const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("followers");

    if (!user) {
        return (
            <div className="p-6 text-sm text-slate-400">
                Loading user...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 bg-black min-h-screen">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-black border border-white/10 rounded-2xl p-6 flex gap-6">
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-28 h-28 rounded-2xl object-cover border border-white/10"
                />

                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-white">
                        {user.firstName} {user.lastName}
                    </h1>

                    <p className="text-sm text-slate-400 mt-1">
                        {user.role}
                    </p>

                    <p className="text-sm text-slate-300 mt-3 max-w-xl">
                        {user.about}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                            <FaMapMarkerAlt /> {user.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaEnvelope /> {user.email}
                        </span>
                    </div>
                </div>
            </div>

            {/* <div className="mt-4">
                <ProfileStats />
            </div> */}

            <div className="flex gap-8 mt-10 border-b border-white/10">
                {[
                    { key: "followers", label: "Followers", count: followersData.length },
                    { key: "following", label: "Following", count: followingData.length },
                    { key: "audits", label: "Audits", count: auditsData.length },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-3 text-sm font-medium transition ${activeTab === tab.key
                            ? "text-[#04d9ff] border-b-2 border-orange-400"
                            : "text-slate-400 hover:text-white"
                            }`}
                    >
                        {tab.label}
                        <span className="ml-2 text-xs opacity-70">
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-8">
                {activeTab === "followers" && <FollowersTab />}
                {activeTab === "following" && <FollowingTab />}
                {activeTab === "audits" && <AuditsTab />}
            </div>
        </div>
    );
};


const FollowersTab = () => (
    <div className="grid md:grid-cols-3 gap-4">
        {followersData.map((u) => (
            <UserCard key={u._id} user={u} />
        ))}
    </div>
);

const FollowingTab = () => (
    <div className="grid md:grid-cols-3 gap-4">
        {followingData.map((u) => (
            <UserCard key={u._id} user={u} />
        ))}
    </div>
);

const AuditsTab = () => (
    <div className="space-y-4">
        {auditsData.map((audit) => (
            <div
                key={audit._id}
                className="bg-slate-900/80 border border-white/5 rounded-xl p-4"
            >
                <p className="text-white font-medium">
                    {audit.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Severity: {audit.severity} • {audit.date}
                </p>
            </div>
        ))}
    </div>
);


const UserCard = ({ user }) => (
    <div className="flex items-center justify-between bg-slate-900/80 border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-3">
            <img
                src={user.avatar}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div>
                <p className="text-white text-sm font-medium">
                    {user.name}
                </p>
                <p className="text-xs text-[#04d9ff]">
                    {user.role}
                </p>
            </div>
        </div>

        <button className="text-slate-400 hover:text-white">
            →
        </button>
    </div>
);

export default ProfilePage;
