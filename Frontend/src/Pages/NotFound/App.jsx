import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center text-center relative z-10">
            <div>
                <h1 className="text-6xl font-bold mb-4">404</h1>

                <p className="text-lg mb-6 text-gray-300">
                    Oops! The page you are looking for does not exist.
                </p>

                <Link
                    to="/"
                    className="px-6 py-2 bg-[#04d9ff] rounded hover:bg-[#00bcd4] transition-colors duration-300"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
