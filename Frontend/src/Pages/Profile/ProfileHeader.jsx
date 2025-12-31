import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaGithub,
    FaLinkedin,
    FaDiscord,
    FaTwitter,
} from "react-icons/fa";
import SocialLink from "../../components/profile/SocialLink";

const ProfileHeader = ({ user }) => {
    return (
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
                <p className="text-sm text-slate-300 mt-3 max-w-xl">{user.about}</p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                        <FaMapMarkerAlt /> {user.location}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaEnvelope /> {user.email}
                    </span>
                </div>
            </div>

            {user.socialLinks && (
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
    );
};

export default ProfileHeader;
