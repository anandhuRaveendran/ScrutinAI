import { useState } from "react";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaGithub,
    FaLinkedin,
    FaDiscord,
    FaTwitter,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader/app.jsx";

/* ---------------- HARD-CODED DATA ---------------- */

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
        return <Loader />;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 bg-black min-h-screen">
            {/* ================= PROFILE HEADER ================= */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-black border border-white/10 rounded-2xl p-6 flex gap-6">
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-28 h-28 rounded-2xl object-cover border border-white/10"
                />

                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-white">
                        {user.firstName} {user.lastName}
                    </h1>

                    <p className="text-sm text-slate-400 mt-1">{user.role}</p>

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

                {/* Social Links */}
                {user.socialLinks &&
                    Object.values(user.socialLinks).some(Boolean) && (
                        <div className="absolute bottom-4 right-6 flex gap-3">
                            {user.socialLinks.github && (
                                <SocialLink icon={<FaGithub />} label="GitHub" url={user.socialLinks.github} />
                            )}
                            {user.socialLinks.linkedin && (
                                <SocialLink icon={<FaLinkedin />} label="LinkedIn" url={user.socialLinks.linkedin} />
                            )}
                            {user.socialLinks.discord && (
                                <SocialLink icon={<FaDiscord />} label="Discord" url={user.socialLinks.discord} />
                            )}
                            {user.socialLinks.twitter && (
                                <SocialLink icon={<FaTwitter />} label="Twitter" url={user.socialLinks.twitter} />
                            )}
                        </div>
                    )}
            </div>

            {/* ================= TABS ================= */}
            <div className="flex flex-wrap gap-8 mt-10 border-b border-white/10">
                {[
                    { key: "followers", label: "Followers", count: followersData.length },
                    { key: "following", label: "Following", count: followingData.length },
                    { key: "audits", label: "Audits", count: auditsData.length },
                    { key: "skills", label: "Skills", count: user.skills.length },
                    { key: "certifications", label: "Certifications", count: user.certifications.length },
                ].map((tab) => (
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

            {/* ================= TAB CONTENT ================= */}
            <div className="mt-8">
                {activeTab === "followers" && <FollowersTab />}
                {activeTab === "following" && <FollowingTab />}
                {activeTab === "audits" && <AuditsTab />}
                {activeTab === "skills" && <SkillsTab skills={user.skills} />}
                {activeTab === "certifications" && (
                    <CertificationsTab certifications={user.certifications} />
                )}
            </div>
        </div>
    );
};

/* ---------------- TAB COMPONENTS ---------------- */

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
                <p className="text-white font-medium">{audit.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                    Severity: {audit.severity} • {audit.date}
                </p>
            </div>
        ))}
    </div>
);

const SkillsTab = ({ skills }) => (
    <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
            <span
                key={skill}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300"
            >
                {skill}
            </span>
        ))}
    </div>
);

const CertificationsTab = ({ certifications }) => (
    <div className="space-y-4">
        {certifications.map((cert) => (
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

/* ---------------- SHARED COMPONENTS ---------------- */

const UserCard = ({ user }) => (
    <div className="flex items-center justify-between bg-slate-900/80 border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-xs text-[#04d9ff]">{user.role}</p>
            </div>
        </div>
        <button className="text-slate-400 hover:text-white">→</button>
    </div>
);

const SocialLink = ({ icon, label, url }) => (
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

export default ProfilePage;
