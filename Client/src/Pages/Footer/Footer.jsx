import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Config from "../../../Config/Config";

const Footer = () => {
  const [freeCourses, setFreeCourses] = useState([]);

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

  useEffect(() => {
    getFreeCourses();
  });

  return (
    <div>
      {/* Footer Section */}
      <div className="w-full h-auto mx-auto bg-[#f9f9f9]">
        <div className="flex py-5 md:flex-row flex-col justify-center items-center gap-8">
          {/* Logo */}
          <div>
            <p className="font-poppins font-semibold text-[25px] md:text-[27px] lg:text-[30px] xl:text-[33px] 2xl:text-[35px] text-[#333]">
              Global Tuitions
            </p>
          </div>

          {/* Desktop Links */}
          <div>
            <div className="flex flex-row gap-8 uppercase font-mono text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] text-[#333]">
              <NavLink
                to="/"
                className="hover:text-[#A4DCAA] duration-300"
                activeClassName="text-[#A4DCAA]"
              >
                Home
              </NavLink>
              <NavLink
                to="/courses"
                className="hover:text-[#A4DCAA] duration-300"
                activeClassName="text-[#A4DCAA]"
              >
                Course
              </NavLink>
              <NavLink
                to="/inquiry"
                className="hover:text-[#A4DCAA] duration-300"
                activeClassName="text-[#A4DCAA]"
              >
                Inquiry
              </NavLink>
              {freeCourses.length > 0 && (
                <NavLink
                  to="/freeCourses"
                  className={({ isActive }) =>
                    `hover:text-[#A4DCAA] duration-300${
                      isActive ? "border-b-black border-b-2 " : "text-[#A4DCAA]"
                    }`
                  }
                >
                  Free
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="w-full h-auto flex justify-center items-center mx-auto container border-t-[1px] border-black bg-[#f9f9f9]">
        <div className="md:py-7 py-4 font-semibold text-center text-[#333]">
          <a
            href="mailto:info@globaltuitions.co.uk"
            className="text-[#333] hover:text-[#68c072] duration-300"
          >
            Copyright@globaltuitions.co.uk
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
