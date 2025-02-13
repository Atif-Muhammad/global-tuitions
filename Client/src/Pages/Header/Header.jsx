import React, { useState, useEffect, useContext, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";
import Config from "../../../Config/Config";
import { CgProfile } from "react-icons/cg";
import { FaTimes } from "react-icons/fa"; // Import the cross icon
import { TbLogout } from "react-icons/tb";
import valueContext from "../../Context/context";

const Header = () => {
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  // State to manage mobile menu visibility

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [btns, setBtns] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [courses, setCourses] = useState([]);
  // fre courses
  const [freeCourses, setFreeCourses] = useState([]);
  const [show, setshow] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [offers, setOffers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
    btns: false,
  });

  const { userExists } = useContext(valueContext);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleResize = () => {
    if (window.innerWidth >= 767) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    Config.logout()
      .then((res) => {
        console.log(res);
        setBtns(false);
        setShowLogoutModal(false);
        checkSession();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkSession = async () => {
    try {
      const res = await Config.checkSession();
      const expiration = res.exp;
      const expiryDate = new Date(expiration * 1000);
      const currentDate = new Date();

      if (currentDate < expiryDate) {
        setUserInfo({
          name: res.student_name,
          email: res.email,
          role: res.role,
          btns: true,
        });
        setBtns(true);
      } else {
        setUserInfo((prev) => ({ ...prev, btns: false }));
      }
    } catch {
      setUserInfo((prev) => ({ ...prev, btns: false }));
    } finally {
      setLoading(false); // Loading complete
    }
    getOffers();
    getFreeCourses();
    getCourses();
    // console.log(res.data)
  };

  const getOffers = () => {
    Config.getOffers()
      .then((res) => {
        if (res.status === 200) {
          setOffers(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getFreeCourses = async () => {
    Config.get_enabled_courses()
      .then((res) => {
        const data = res.filter((item) => {
          return (
            item.category_id?.category_name === "Free Courses" &&
            item.category_id?.enabled_flag === true &&
            new Date(item.date) > new Date()
          );
        });
        setFreeCourses(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCourses = () => {
    Config.get_enabled_courses()
      .then((res) => {
        setCourses(res);
        setFilteredCourses(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenu(false); // Close the menu if click is outside
    }
  };
  useEffect(() => {
    checkSession();
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userExists]);

  useEffect(() => {
    if (!location.pathname.includes("/Course_detail")) {
      setSearch("");
    }
  }, [location.pathname]);

  const handleView = () => {
    setMenu(!menu);
  };

  const handleEditProfile = () => {
    setMenu(false); // Close the menu
  };

  const checkCourseName = (e) => {
    setSearch(e.target.value);

    // refine the courses array
    setFilteredCourses(
      courses.filter((course) =>
        course.course_name
          .toLowerCase()
          .trim()
          .startsWith(e.target.value.toLowerCase().trim())
      )
    );
  };

  const handleRedirect = (course_name) => {
    console.log(course_name);
    setshow(false);
    setSearch(course_name);
    setCourseName(course_name);
  };

  const handleBlur = (e) => {
    // Delay hiding the dropdown to allow NavLink click to register
    setTimeout(() => {
      setshow(false);
    }, 150);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full h-auto py-3 lg:px-8 xl:px-12 px-6 shadow-lg bg-[#95d39b]">
        <div className="flex items-center justify-between font-urbanist px-4 ">
          {/* Logo */}
          <div className="w-1/3 lg:w-[25%] flex justify-centerlg:justify-start">
            <NavLink to="/">
              <p className="font-urbanist font-bold text-xl md:text-2xl xl:text-4xl">
                Global Tuitions
              </p>
            </NavLink>
          </div>

          {/* Desktop links */}
          <div className="lg:w-[30%] hidden lg:flex items-center justify-center">
            <div className="flex flex-row gap-6 font-bold uppercase text-[14px] md:text-[12px] lg:text-[18px]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-white duration-300 border-[#77bd7f] ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `hover:text-white duration-300 border-[#77bd7f] ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Course
              </NavLink>
              <NavLink
                to="/inquiry"
                className={({ isActive }) =>
                  `hover:text-white duration-300 border-[#68c072] ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Inquiry
              </NavLink>
              {freeCourses.length > 0 && (
                <NavLink
                  to="/freeCourses"
                  className={({ isActive }) =>
                    `hover:text-white duration-300 border-[#68c072] ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  Free
                </NavLink>
              )}
              {offers.length > 0 && (
                <NavLink
                  to="/offers"
                  className={({ isActive }) =>
                    `hover:text-white duration-300 border-[#68c072] ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  Offers
                </NavLink>
              )}
            </div>
          </div>

          {/* Buttons for large screens */}
          <div className="lg:w-[27%] hidden lg:flex items-center justify-end gap-3 text-[17px] lg:text-[20px] xl:text-[24px]">
            {/* Search bar for large screens */}
            <div className="relative w-full hidden lg:flex items-center justify-center">
              <div className="w-full">
                <span className="absolute right-3 top-1/4 flex z-20 text-md">
                  <FaSearch size={20} className="text-black cursor-pointer" />
                </span>
                <input
                  type="search"
                  onFocus={() => setshow(true)}
                  onBlur={handleBlur}
                  value={search}
                  onChange={checkCourseName}
                  placeholder="Search For Courses"
                  className="inline-block border-[1px] border-b-4 drop-shadow-lg border-black rounded-lg py-2 hover:bg-slate-100 duration-500 px-3 focus:outline-none text-sm w-full"
                />

                {show && (
                  <div className="absolute z-10 -left-2 top-14 w-[20rem] max-h-[35vh] overflow-scroll overflow-x-hidden  h-fit bg-[#7acc82] border-2">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course, index) => (
                        <NavLink
                          to="/Course_detail"
                          state={course._id}
                          onClick={() => handleRedirect(course.course_name)}
                          className="w-full px-2 py-2 text-sm tracking-wide flex items-center justify-start hover:bg-[#A4DCAA] cursor-pointer border-b-2"
                          key={index}
                        >
                          {console.log(course._id)}
                          {course.course_name}
                        </NavLink>
                      ))
                    ) : (
                      <div className="w-full px-2 py-2 text-sm flex items-center justify-start hover:bg-[#A4DCAA] cursor-pointer border-b-2">
                        "No matching courses
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {loading ? (
              <></>
            ) : // <p>Loading...</p> // Placeholder or spinner during the loading state
            !btns ? (
              <>
                <NavLink
                  to="/signin"
                  className=" text-sm py-2 px-3 bg-black border text-white text-center rounded-lg border-white w-1/3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/signup"
                  className=" text-sm py-2 px-3 bg-black border text-white text-center rounded-lg border-white w-1/3"
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <div className="flex gap-6">
                <p
                  className=" btnbutton text-[23px] cursor-pointer"
                  onClick={handleView}
                >
                  {menu ? (
                    <FaTimes /> // Cross icon when menu is open
                  ) : (
                    <p>
                      <CgProfile />
                    </p>
                  )}
                </p>
                {menu && (
                  <div
                    ref={menuRef}
                    className="bg-white font-urbanist shadow-lg z-10 absolute h-auto w-64 right-16 top-16 flex flex-col items-center justify-between py-6 px-4 rounded-lg border border-gray-200"
                  >
                    {/* Profile Picture */}
                    <div className="pic bg-gray-300 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                      <span className="text-gray-500 text-sm">Your Pic</span>
                    </div>

                    {/* User Information */}
                    <div className="email text-gray-700 text-sm font-medium mb-1">
                      {userInfo?.email || "No Email"}
                    </div>
                    <div className="name text-gray-900 text-lg font-semibold mb-4">
                      {userInfo?.name || "Guest User"}
                    </div>

                    {/* Buttons */}
                    <NavLink
                      // onClick={handleView}
                      to="/profile"
                      className="w-full text-lg text-center hover:bg-gray-100 text-gray-700 border border-gray-300 py-2 rounded-md mb-2 transition duration-300"
                      onClick={handleEditProfile}
                    >
                      View Profile
                    </NavLink>
                    {userInfo?.role === "Admin" && (
                      <NavLink
                        to="http://51.24.30.180:5174/"
                        target="_blank"
                        className="w-full text-lg text-center hover:bg-gray-100 text-gray-700 border border-gray-300 py-2 rounded-md mb-2 transition duration-300"
                        onClick={handleEditProfile}
                      >
                        Admin Panel
                      </NavLink>
                    )}
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-lg bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile menu bar/cross icon */}
            <div className="cursor-pointer" onClick={toggleMenu}>
              {isMenuOpen ? (
                <IoMdClose className="text-black w-7 h-7" />
              ) : (
                <RiMenu3Fill className="text-black w-7 h-7" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu content */}
        {isMenuOpen && (
          <div className="lg:hidden absolute flex-col left-0 z-40 bg-[#A4DCAA] font-urbanist p-4 w-full rounded-md shadow-lg">
            <div className="flex flex-col justify-center uppercase font-mono gap-5 text-[14px] md:text-[15px] lg:text-[17px] xl:text-[22px] 2xl:text-[28px]">
              {/* Mobile search bar */}
              <div className="mt-4">
                <input
                  type="search"
                  onFocus={() => setshow(true)}
                  onBlur={handleBlur}
                  value={search}
                  onChange={checkCourseName}
                  placeholder="Search For Courses"
                  className="inline-block border-[1px] border-b-4 drop-shadow-lg border-black rounded-lg py-2 hover:bg-slate-100 duration-500 pl-8 focus:outline-none w-full"
                />

                {show && (
                  <div className="absolute z-10 left-0 top-20 w-full  max-h-[35vh] overflow-scroll overflow-x-hidden  h-fit bg-[#7acc82] border-2">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course, index) => (
                        <NavLink
                          to="/Course_detail"
                          state={course}
                          onClick={() => handleRedirect(course.course_name)}
                          className="w-full px-2 py-3 flex items-center justify-start hover:bg-[#A4DCAA] cursor-pointer border-b-2"
                          key={index}
                        >
                          {course.course_name}
                        </NavLink>
                      ))
                    ) : (
                      <div className="w-full px-2 py-3 flex items-center justify-start hover:bg-[#A4DCAA] cursor-pointer border-b-2">
                        "No matching courses
                      </div>
                    )}
                  </div>
                )}
              </div>
              <NavLink
                to="/profile"
                className="hover:text-white duration-300 border-b py-2"
              >
                Profile
              </NavLink>
              <NavLink
                to="/courses"
                className="hover:text-white duration-300 border-b py-2"
              >
                Course
              </NavLink>
              {freeCourses.length > 0 && (
                <NavLink
                  to="/freeCourses"
                  className={({ isActive }) =>
                    `hover:text-white duration-300  border-b py-2 ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  Free
                </NavLink>
              )}
              {offers.length > 0 && (
                <NavLink
                  to="/offers"
                  className={({ isActive }) =>
                    `hover:text-white duration-300  border-b py-2 ${
                      isActive ? "text-white" : ""
                    }`
                  }
                >
                  Offers
                </NavLink>
              )}
              <NavLink
                to="/inquiry"
                className="hover:text-white duration-300 border-b py-2"
              >
                Inquiry
              </NavLink>
            </div>

            {/* Mobile buttons */}
            <div className="flex justify-end gap-3 mt-4 border-b py-2">
              {!btns ? (
                <>
                  <NavLink to="/signin" className="btnbutton">
                    Sign in
                  </NavLink>
                  <NavLink to="/signup" className="btnbutton">
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 font-urbanist bg-black/60 flex justify-center items-center z-50"
          role="dialog"
          aria-labelledby="logout-modal-title"
          aria-describedby="logout-modal-description"
        >
          <div className="bg-white p-7 rounded-lg shadow-2xl max-w-sm w-full">
            {/* Icon and Title */}
            <div className="flex items-center justify-center mb-6">
              <TbLogout className="w-12 h-12 text-red-500" />
            </div>
            <h2
              id="logout-modal-title"
              className="text-center text-2xl font-semibold text-gray-800 mb-4"
            >
              Confirm Logout
            </h2>
            <p
              id="logout-modal-description"
              className="text-center text-gray-600 mb-6"
            >
              Are you sure you want to log out? You will be redirected to the
              login page.
            </p>
            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                onClick={() => setShowLogoutModal(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="w-full bg-red-500 text-black py-2 rounded-md hover:bg-red-600 transition"
                onClick={handleLogout} // Proceed with logout
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
