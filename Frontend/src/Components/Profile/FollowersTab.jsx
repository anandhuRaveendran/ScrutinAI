import { followersData } from "../../data/ProfileMockData";
import UserCard from "./UserCard";

const FollowersTab = () => (
    <div className="grid md:grid-cols-3 gap-4">
        {followersData.map(user => (
            <UserCard key={user._id} user={user} />
        ))}
    </div>
);

export default FollowersTab;
