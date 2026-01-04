import { useState } from "react";
import ProfileMenu from "../../Components/Dashboard/ProfileMenu";
import EditProfileModal from "../../Components/Modal/EditProfileModal";
import { useAuth } from "../../context/AuthContext";
import DashboardLeftComponent from "../../Components/Dashboard/DashboardLeftComponent";
import DashboardMainComponent from "../../Components/Dashboard/DashboardMainComponent";
import SearchComponent from "../../Components/Dashboard/SearchComponent";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-gray-950 text-gray-100 pb-10">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <SearchComponent />
          <ProfileMenu
            user={user}
            onLogout={logout}
            onEditProfile={() => setIsEditModalOpen(true)}
          />
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Sidebar */}
          <div className="lg:w-[300px] w-full shrink-0">
            <DashboardLeftComponent />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <DashboardMainComponent />
          </div>

        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    </div>
  );
}
