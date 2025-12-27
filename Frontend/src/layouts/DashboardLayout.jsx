import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/DashboardNavbar";
import PreventBackForward from "../utils/PreventBackForward";
import VideoBackground from "../Components/VideoBackground";

const DashboardLayout = () => {
    return (
        <div className="relative min-h-screen overflow-hidden text-white pt-[8%]">
            <VideoBackground />
            <div className="absolute inset-0 bg-black/20 z-[5] pointer-events-none" />

            <PreventBackForward />
            <Navbar />

            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
