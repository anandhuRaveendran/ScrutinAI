import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ProfileMenu from "../../Components/Dashboard/ProfileMenu";
import EditProfileModal from "../../Components/Modal/EditProfileModal";
import { useAuth } from "../../context/AuthContext";
import DasnboardLeftComponent from "../../Components/Dashboard/DashboardLeftComponent";
import DashboardMainComponent from "../../Components/Dashboard/DashboardMainComponent";
import DashboardRightComponent from "../../Components/Dashboard/DashboardRightComponent";
import SearchComponent from "../../Components/Dashboard/SearchComponent";


export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <SearchComponent />
          <div className="flex items-center gap-4">
            <ProfileMenu user={user} onLogout={logout} onEditProfile={() => setIsEditModalOpen(true)} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <DasnboardLeftComponent />
          <DashboardMainComponent />
          <DashboardRightComponent />
        </div>
        <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      </div>
    </div>
  );
}
