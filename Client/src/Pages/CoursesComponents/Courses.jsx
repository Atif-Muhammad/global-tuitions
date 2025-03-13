import React, { useEffect, useState } from "react";
import Cards from "../../Components/Cards";
import Config from "../../../Config/Config";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import SkeletonCard from "../Skeletons/SkeletonCard";
import { Helmet } from "react-helmet-async";
const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    Config.get_courses_for_front_page()
      .then((res) => {
        // console.log(res)
        const data = res.filter((item) => {
          return (
            item.category_id?.category_name != "Free Courses" &&
            item.category_id?.enabled_flag === true
          );
        });

        setCourses(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Online Courses - Global Tuition</title>
        <meta
          name="description"
          content="Explore a variety of online courses offered by Global Tuition. Enhance your skills with quality online tuition across Europe."
        />
        <meta
          name="keywords"
          content="online courses, tuition, learn online, European tuition, courses for students"
        />
        <meta property="og:title" content="Online Courses - Global Tuition" />
        <meta
          property="og:description"
          content="Explore a variety of online courses offered by Global Tuition. Enhance your skills with quality online tuition across Europe."
        />
        <meta property="og:image" content="image_url_here" />
      </Helmet>
      {/* Home page courses cards section */}
      <div>
        {/* Courses heading */}
        <div className="w-full h-auto flex justify-center items-center md:py-7 py-5">
          <div className="lg:text-[55px] md:text-[45px] text-[35px] font-extrabold font-readex uppercase">
            <h1>Courses</h1>
          </div>
        </div>

        {/* Cards */}
        <div className="card-grid">
          {courses.length > 0 ? (
            <>
              {courses?.slice(0, 6).map((course) => (
                <Cards course={course} />
              ))}
            </>
          ) : (
            <>
              {[...Array(6)].map((index, _) => (
                <SkeletonCard key={index} />
              ))}
            </>
          )}
        </div>

        {/* Courses "More" button */}
        <div className="w-full   md:pt-3 md:pb-8 pt-2 pb-6 px-5 flex justify-end">
          <div className=" w-1/2 flex justify-end mx-12 mt-2 ">
            <NavLink
              to="/courses"
              className="flex items-center justify-center gap-2 text-[20px] md:text-[30px] font-readex  transition"
              aria-label="View more courses on Global Tuition"
            >
              <span aria-label="More courses">More</span>
              <IoIosArrowRoundForward />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
