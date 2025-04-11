import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaBook,
  FaUserGraduate,
  FaInbox,
  FaLayerGroup,
  FaTrashAlt,
  FaGift,
  FaUsers,
  FaRegNewspaper,
  FaTags,
} from "react-icons/fa";
import Categories from "./Catagories/Categories";
import Course from "./Courses/Course";
import GeneralInquiry from "./inquiries/GeneralInquiry";
import CourseInquiries from "./inquiries/CourseInquiry";
import Enrollment from "./Enrollments/Enrollment";
import Config from "../../config/Config";
import FreeCourse from "./FreeCourses/FreeCourse";
import Subscriber from "./Subscribe/Subscriber";
import DeletedCategory from "./deletedCategories/DeletedCategory";
import DeletedCourses from "./deletedCourses/DeletedCourses";
import Admin_dashboard from "./dashboard/Admin_dashboard";
import Offers from "./offers/Offers";


const Sidebar = () => {
  const [totalRegs, setTotalRegs] = useState([]);
  const [GInqs, setGInqs] = useState([]);
  const [CInqs, setCInqs] = useState([]);

  const getCourseInqs = async () => {
    Config.courseInq()
      .then((res) => {
        const cleaned = res.filter((inq) => inq.viewed_flag === false);
        setCInqs(cleaned);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getGenInqs = async () => {
    Config.getGenInqs()
      .then((res) => {
        const cleaned = res.filter((inq) => inq.viewed_flag === false);
        setGInqs(cleaned);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getRegs = async () => {
    Config.getEnrollments()
      .then((res) => {
        const cleaned = res.filter((reg) => {
          return !reg.Approved && !reg.Rejected && !reg.replied_flag;
        });
        setTotalRegs(cleaned);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData = () => {
    getCourseInqs();
    getGenInqs();
    getRegs();
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <BrowserRouter>
      <div className="md:w-[20%] sticky top-0 z-50 h-full w-full bg-black py-4">
        <h2 className="text-white text-[40px] font-bold pl-2 font-poppins mb-4">
          Dashboard
        </h2>

        <ul className="md:flex md:flex-col flex flex-row flex-wrap pl-2 text-[20px] font-urbanist text-center no-underline">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaChartBar />
            Dashboard
          </NavLink>
          <NavLink
            to="/Categories"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaLayerGroup />
            Categories
          </NavLink>
          <NavLink
            to="/Course"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaBook />
            Courses
          </NavLink>
          <NavLink
            to="/freeCourses"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaGift />
            Free Courses
          </NavLink>

          <NavLink
            to="/enroll"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center justify-between gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <FaUserGraduate />
              Enrollments
            </div>
            <div className="bg-yellow-400 text-slate-900 select-none font-semibold rounded-full h-[1.2rem] w-[1.2rem] text-xs grid place-items-center">
              {totalRegs?.length}
            </div>
          </NavLink>

          <NavLink
            to="/genInq"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center justify-between gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <FaInbox />
              General Inquiries
            </div>
            <div className="bg-yellow-400 text-slate-900 font-semibold select-none rounded-full h-[1.2rem] w-[1.2rem] text-xs grid place-items-center">
              {GInqs?.length}
            </div>
          </NavLink>

          <NavLink
            to="/courseInq"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center justify-between  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <FaBook />
              Course Inquiries
            </div>
            <div className="bg-yellow-400 text-slate-900 font-semibold select-none rounded-full h-[1.2rem] w-[1.2rem] text-xs grid place-items-center">
              {CInqs?.length}
            </div>
          </NavLink>

          <NavLink
            to="/deletedCategories"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaTrashAlt />
            Deleted Categories
          </NavLink>

          <NavLink
            to="/deletedCourses"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaTrashAlt />
            Deleted Courses
          </NavLink>

          <NavLink
            to="/subscriber"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaRegNewspaper />
            Subscribers
          </NavLink>

          <NavLink
            to="/Offers"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaTags />
            Offers
          </NavLink>

          <NavLink
            to="/Users"
            className={({ isActive }) =>
              `text-white w-full px-2 py-2 mb-2 flex items-center  gap-3 duration-300 ${
                isActive ? "bg-[#282828]" : "hover:bg-[#333333]"
              }`
            }
          >
            <FaUsers />
            Users
          </NavLink>
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<Admin_dashboard />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/deletedCategories" element={<DeletedCategory />} />
        <Route path="/deletedCourses" element={<DeletedCourses />} />
        <Route path="/Course" element={<Course />} />
        <Route path="/genInq" element={<GeneralInquiry />} />
        <Route path="/courseInq" element={<CourseInquiries />} />
        <Route path="/enroll" element={<Enrollment />} />
        <Route path="/freeCourses" element={<FreeCourse />} />
        <Route path="/subscriber" element={<Subscriber />} />
        <Route path="/Offers" element={<Offers/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Sidebar;
