import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdWarning } from "react-icons/io";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-bodyColor text-black">
      <div className="text-center">
        {/* Icon */}
        <IoMdWarning className="text-6xl mb-6 mx-auto" />

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">Oops! Page Not Found</h1>

        {/* Message */}
        <p className="text-lg mb-6">
          The page you're looking for doesn't exist or has been moved. Don't
          worry, let's get you back home.
        </p>

        {/* Button */}
        <button
          onClick={handleGoHome}
          className="bg-yellow-500 text-gray-900 py-2 px-6 rounded-lg text-xl hover:bg-yellow-600 transition duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
