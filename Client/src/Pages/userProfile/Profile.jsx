import React from "react";
import { Outlet } from "react-router-dom";
import Usersidebar from "../../Pages/userProfile/Usersidebar";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col bg-[#c4fad9] md:flex-row  overflow-y-hidden w-full h-full">
      {/* Sidebar */}
      <Usersidebar />

      {/* Dynamic Content */}
      <div className="flex-1  bg-gray-100 overflow-y-auto h-full">
        <Outlet /> {/* Renders child routes */}
      </div>
    </div>
  );
};

export default ProfileLayout;
