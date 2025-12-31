import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../Components/Loader/app.jsx";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const { checkUser } = useAuth();

    useEffect(() => {
        const verify = async () => {
            await checkUser();
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
