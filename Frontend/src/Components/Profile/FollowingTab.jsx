import { followingData } from "../../data/ProfileMockData";
import UserCard from "./UserCard";

const FollowingTab = () => (
    <div className="grid md:grid-cols-3 gap-4">
        {followingData.map(user => (
            <UserCard key={user._id} user={user} />
        ))}
    </div>
);

export default FollowingTab;
