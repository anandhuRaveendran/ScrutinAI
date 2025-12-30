import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../Components/Loader/app.jsx";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const { checkUser } = useAuth();

    useEffect(() => {
        // Wait for cookie to be ready, then check user
        const verify = async () => {
            await checkUser();
            // After checking, navigate. If the check succeeded, 'user' is set and specific routes are unlocked.
            // If check failed, 'user' is null.
            navigate("/dashboard", { replace: true });
        };
        verify();
    }, [navigate, checkUser]);


    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <Loader />
        </div>
    );
};

export default OAuthSuccess;
