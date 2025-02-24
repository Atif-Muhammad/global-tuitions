import React, { useEffect, useState } from "react";
import Cards from "../../Components/Cards";
import Config from "../../../Config/Config";
import SkeletonCard from "../Skeletons/SkeletonCard";
import NoSkeleton from "../Skeletons/NoSkeleton";
import { Helmet } from "react-helmet-async";
import Lines from "../../assets/images/Vector 6.jpg";

const CoursesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default to "All Categories"
  const [selectedLevels, setSelectedLevels] = useState({
    all: true, // "All" is selected by default
    beginner: false,
    intermediate: false,
    advanced: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(9);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    setLoading(true);
    Config.get_enabled_categories()
      .then((res) => {
        const filteredCategories = res.filter((category) => {
          return (
            category.courses &&
            category.courses.filter((course) => course.enabled_flag === true)
              .length > 0 &&
            category.category_name !== "Free Courses"
          );
        });
        setCategories(filteredCategories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });

    return () => setCategories([]); // Clean up on unmount
  }, []);

  // Handle category selection
  const handleCategoryChange = (cid) => {
    setSelectedCategory((prev) => (prev === cid ? "all" : cid)); // Toggle category, default to "all"
    setSelectedLevels({
      all: true,
      beginner: false,
      intermediate: false,
      advanced: false,
    });
    setCurrentPage(1); // Reset to the first page when the category changes
  };

  const handleLevelChange = (level) => {
    setSelectedLevels((prev) => {
      if (level === "all") {
        // If "All Levels" is selected, reset all levels and only select "All"
        return {
          all: true,
          beginner: false,
          intermediate: false,
          advanced: false,
        };
      }

      // If the clicked level is already selected, unselect it and default to "All Levels"
      if (prev[level]) {
        return {
          all: true,
          beginner: false,
          intermediate: false,
          advanced: false,
        };
      }

      // Select only the clicked level and unselect all others
      return {
        all: false,
        beginner: level === "beginner",
        intermediate: level === "intermediate",
        advanced: level === "advance",
      };
    });
  };

  // Filter categories and courses based on the selected category and levels
  const filteredCategories = categories
    .map((category) => {
      if (selectedCategory !== "all" && category._id !== selectedCategory) {
        return null;
      }

      const filteredCourses = category.courses.filter((course) => {
        if (
          selectedLevels.beginner &&
          course.course_level.toLowerCase() === "beginner"
        )
          return true;
        if (
          selectedLevels.intermediate &&
          course.course_level.toLowerCase() === "intermediate"
        )
          return true;
        if (
          selectedLevels.advanced &&
          course.course_level.toLowerCase() === "advance"
        )
          return true;

        // Include all courses if no level is selected
        return selectedLevels.all;
      });

      return filteredCourses.length > 0
        ? {
            ...category,
            courses: filteredCourses,
          }
        : null;
    })
    .filter((category) => category !== null); // Remove empty categories

  // Flatten filtered courses for pagination
  const allFilteredCourses = filteredCategories.flatMap((category) =>
    category.courses.map((course) => ({
      ...course,
      category_name: category.category_name,
      category_id: category._id,
    }))
  );

  // Paginate the courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = allFilteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(allFilteredCourses.length / coursesPerPage);

  return (
    <>
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

      {/* Header */}
      <div className="w-auto h-auto bg-[#A4DCAA] mb-2 mt-12 lg:mx-12 mx-6 py-3 px-5 rounded-lg shadow-lg border">
        <p className="font-readex xl:tracking-[1px] text-[16px] md:text-[20px] lg:text-[24px]">
          <span className="font-bold">Explore Our Courses:</span> Elevate Your
          IT Skills - Building Tomorrow’s Tech Innovators
        </p>
      </div>

      {/* Content */}
      <div className="h-auto lg:mx-12 pt-5 md:mx-8">
        <div className="flex lg:flex-row md:flex-row flex-col md:justify-start">
          {/* Filter Sidebar */}
          {categories.length > 0 ? (
            <div className="border-2 md:sticky top-0  h-full z-30 w-full md:w-[25%] bg-[#FFFFFF] ">
              <div className="flex flex-col px-4 py-2 gap-2 relative">
                <p className="font-readex xl:text-[24px] 2xl:text-[27px] lg:text-[20px] md:text-[17px] text-[16px]">
                  Categories
                </p>
                <img
                  src={Lines}
                  alt="line"
                  className=" absolute lg:top-8 w-36 md:top-6 top-5 md:left-6 -z-10"
                />

                <div className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
                  <div className="flex flex-col gap-1">
                    <ul className="space-y-2">
                      <li className="border-b pb-2">
                        <div className="flex gap-10 items-center">
                          <label>
                            <input
                              type="checkbox"
                              onChange={() => handleCategoryChange("all")}
                              checked={selectedCategory === "all"}
                            />
                            <span className="text-md tracking-wide font-semibold w-full font-urbanist ml-2 cursor-pointer">
                              All Categories
                            </span>
                          </label>
                        </div>
                      </li>
                      {categories.map((category) => (
                        <li key={category?._id} className="border-b pb-1">
                          <div className="">
                            <label className="flex gap-x-2">
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCategoryChange(category?._id)
                                }
                                checked={selectedCategory === category?._id}
                              />
                              <span className="text-md tracking-wide font-semibold w-full font-urbanist cursor-pointer">
                                {category?.category_name}
                              </span>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Level Filters */}
              <div className="flex flex-col px-4 pt-2 gap-2 relative">
                <p className="font-readex xl:text-[24px] 2xl:text-[27px] lg:text-[20px] md:text-[17px] text-[16px]">
                  Levels
                </p>
                <img
                  src={Lines}
                  alt="line"
                  className=" absolute lg:top-8 w-36 md:top-6 top-5 md:left-6 -z-10"
                />

                <div className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
                  <div className="flex flex-col gap-1">
                    <label className="border-b pb-2">
                      <input
                        type="checkbox"
                        onChange={() => handleLevelChange("all")}
                        checked={selectedLevels.all}
                      />
                      <span className="text-md tracking-wide font-semibold font-urbanist ml-2 cursor-pointer">
                        All Levels
                      </span>
                    </label>
                    <label className="border-b pb-2 flex gap-x-2">
                      <input
                        type="checkbox"
                        onChange={() => handleLevelChange("beginner")}
                        checked={selectedLevels.beginner}
                      />
                      <span className="text-md tracking-wide font-semibold font-urbanist cursor-pointer">
                        Beginner
                      </span>
                    </label>
                    <label className="border-b pb-2 flex gap-x-2">
                      <input
                        type="checkbox"
                        onChange={() => handleLevelChange("intermediate")}
                        checked={selectedLevels.intermediate}
                      />
                      <span className="text-md tracking-wide font-semibold font-urbanist cursor-pointer">
                        Intermediate
                      </span>
                    </label>
                    <label className="border-b pb-2 flex gap-x-2">
                      <input
                        type="checkbox"
                        onChange={() => handleLevelChange("advance")}
                        checked={selectedLevels.advanced}
                      />
                      <span className="text-md tracking-wide font-semibold font-urbanist cursor-pointer">
                        Advanced
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div class="border-2 sticky top-0 h-full z-30 w-full md:w-1/4 bg-white animate-pulse">
              <div class="flex flex-col px-4 gap-2 pt-8">
                <div class="h-10 bg-gray-200 rounded"></div>
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
              </div>
              <div class="flex flex-col px-4 gap-2 pt-8">
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
              </div>
            </div>
          )}

          {/* Courses */}
          <div className="w-full flex flex-col">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-3 max-w-[1450px] mx-auto">
              {loading ? (
                [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
              ) : currentCourses.length === 0 ? (
                <NoSkeleton message={"Courses Not Available"} />
              ) : currentCourses.length === 0 ? (
                <NoSkeleton message={"Courses Not Available"} />
              ) : (
                currentCourses
                  .filter(
                    (course) =>
                      course.deleted === false && course.enabled_flag === true
                  )
                  .map((course, index) => <Cards key={index} course={course} />)
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center py-10">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo({
                    top: 0, // Adjust the position as needed
                    behavior: "smooth", // Adds a smooth scrolling effect
                  });
                }}
                className={`px-4 py-2 border ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CoursesPage;
