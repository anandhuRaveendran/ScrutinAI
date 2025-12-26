import React from "react";
import { Outlet } from "react-router-dom";
import VideoBackground from "../Components/VideoBackground";

const AuthLayout = () => {
    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            <VideoBackground />
            <div className="absolute inset-0 bg-black/40 z-[5] pointer-events-none" />

            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
