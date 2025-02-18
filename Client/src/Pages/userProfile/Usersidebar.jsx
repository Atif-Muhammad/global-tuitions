import React from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Importing a profile icon from react-icons
import axios from "axios";
import Config from "../../../Config/Config";
// import API_URLS from '../../config/Config'

const Usersidebar = () => {
  const [userInfo, setUserInfo] = useState([]);

  const getDetails = async () => {
    Config.getUserInfo()
      .then((res) => {
        setUserInfo(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div className=" font-urbanist md:sticky top-0 left-0 md:w-1/5  w-full   text-black p-6 flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center gap-2 mb-6">
        <FaUserCircle size={40} className="text-black" />
        <div>
          <h3 className="text-lg font-semibold">{userInfo.student_name}</h3>
          {/* <p className="text-lg text-gray-400">Dummy Username</p> */}
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className="space-y-4">
        <NavLink
          to="/profile/homeuser"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg text-lg ${
              isActive ? "bg-[#64da93]" : "hover:bg-white"
            }`
          }
          end
        >
          Personal Information
        </NavLink>
        <NavLink
          to="/profile/coursesuser"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg text-lg ${
              isActive ? "bg-[#64da93]" : "hover:bg-white"
            }`
          }
        >
          Courses
        </NavLink>

        <NavLink
          to="/profile/course_inquery"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg text-lg ${
              isActive ? "bg-[#64da93]" : "hover:bg-white"
            }`
          }
        >
          Course Inquiry
        </NavLink>
        <NavLink
          to="/profile/general_inquery"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg text-lg ${
              isActive ? "bg-[#64da93]" : "hover:bg-white"
            }`
          }
        >
          General Inquiry
        </NavLink>

        <NavLink
          to="/profile/settings"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg text-lg ${
              isActive ? "bg-[#64da93]" : "hover:bg-white"
            }`
          }
        >
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Usersidebar;
