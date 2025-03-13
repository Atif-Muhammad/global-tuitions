import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Cards from "../../Components/Cards";
import Config from "../../../Config/Config";
import { FaLessThan } from "react-icons/fa";
import { FaGreaterThan } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
const PopularCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const swiperRef = useRef(null);

  useEffect(() => {
    Config.get_enabled_popular_courses()
      .then((res) => {
        // console.log(res);
        setCourses(
          res.filter((course) => course.category_id?.enabled_flag === true)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Update button states based on active slide
  const handleSlideChange = (swiper) => {
    setIsPrevDisabled(swiper.isBeginning); // Disable prev button on first slide
    setIsNextDisabled(swiper.isEnd); // Disable next button on last slide
  };

  return (
    <>
      <Helmet>
        <title>Popular Online Courses - Global Tuition</title>
        <meta
          name="description"
          content="Explore the most popular online courses at Global Tuition. Find courses from various subjects, available with discounts and special offers. Start learning today!"
        />
        <meta
          name="keywords"
          content="popular online courses, online tuition, education, courses, study online, Global Tuition"
        />
        <meta
          property="og:title"
          content="Popular Online Courses - Global Tuition"
        />
        <meta
          property="og:description"
          content="Explore the most popular online courses at Global Tuition. Find courses from various subjects, available with discounts and special offers. Start learning today!"
        />
        <meta
          property="og:image"
          content="URL_TO_IMAGE" // Add an appropriate image URL for the Open Graph preview
        />
        <meta
          property="og:url"
          content="https://www.globaltuition.co.uk/popular-courses"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Popular Online Courses - Global Tuition"
        />
        <meta
          name="twitter:description"
          content="Explore the most popular online courses at Global Tuition. Find courses from various subjects, available with discounts and special offers. Start learning today!"
        />
        <meta
          name="twitter:image"
          content="URL_TO_IMAGE" // Add an appropriate image URL for the Twitter preview
        />
      </Helmet>

      {courses.length > 0 && (
        <div>
          {/* Popular Courses Section */}
          <div className="bg-custombg pb-9 relative">
            {/* Heading */}
            <div className="w-full h-auto flex justify-center items-center md:py-7 py-5 bg-[#A4DCAA]">
              <div className="lg:text-[55px] md:text-[45px] text-[35px] font-extrabold font-readex uppercase text-center">
                <h1>Popular Courses</h1>
              </div>
            </div>

            {/* Custom Navigation Buttons */}
            <div className="absolute top-[55%] lg:left-[1.5%] xl:left-[4%] md:left-[1%] -translate-y-[50%] z-10">
              <button
                className={`swiper-button-prev-custom p-3 text-white rounded-full shadow  transition-all duration-300 ${
                  isPrevDisabled ? "bg-gray-600 " : "bg-black"
                }`}
                disabled={isPrevDisabled} // Disable previous button when on the first slide
              >
                {/* Left Arrow Icon */}
                <FaLessThan size={18} />
              </button>
            </div>

            <div className="absolute top-[55%] lg:right-[1.5%] xl:right-[4%] md:right-[1%] right-0 -translate-y-[50%] z-10">
              <button
                className={`swiper-button-next-custom p-3 text-white rounded-full shadow  transition-all duration-300 ${
                  isNextDisabled ? "bg-gray-600 " : "bg-black"
                }`}
                disabled={isNextDisabled} // Disable next button when on the last slide
              >
                {/* Right Arrow Icon */}
                <FaGreaterThan size={18} />
              </button>
            </div>

            {/* Swiper Slider */}
            <div className="px-10">
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                spaceBetween={20} // Space between cards
                slidesPerView={3} // Default: Show 3 cards
                breakpoints={{
                  320: { slidesPerView: 1 }, // 1 card for very small screens
                  640: { slidesPerView: 1 }, // 1 card for small screens
                  768: { slidesPerView: 2 }, // 2 cards for medium screens
                  1024: { slidesPerView: 3 }, // 3 cards for large screens
                }}
                onSlideChange={handleSlideChange} // Track slide change
                className="popular-courses-slider"
              >
                {courses
                  .filter((course) => course.deleted === false)
                  .map((course, index) => (
                    <SwiperSlide key={index}>
                      <div className="h-full py-5 px-2">
                        <Cards course={course} />
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopularCourses;
