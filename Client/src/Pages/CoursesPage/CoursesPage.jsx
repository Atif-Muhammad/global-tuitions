import React, { useEffect, useState } from "react";
import Cards from "../../Components/Cards";
import Config from "../../../Config/Config";
import SkeletonCard from "../Skeletons/SkeletonCard";
import NoSkeleton from "../Skeletons/NoSkeleton";
import { Helmet } from "react-helmet-async";

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
                <svg
                  className="absolute gl:top-9 md:top-6 top-5 md:left-6 -z-10"
                  width="113"
                  height="21"
                  viewBox="0 0 113 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M51.9767 3.05845C51.5686 3.0946 51.1609 3.13357 50.7531 3.16972C45.348 3.50621 39.9416 3.90943 34.5296 4.40722C31.1303 4.71868 28.7632 4.95506 26.8162 5.17197C18.0115 5.90335 9.22828 6.96011 0.505889 8.45068C0.345599 8.47849 0.264377 8.5285 0.254203 8.53684C0.0235862 8.70648 0.00377363 8.99852 0.000382208 9.14035C-0.0040802 9.34057 0.027872 9.60471 0.238319 9.7799C0.263487 9.79937 0.319538 9.84665 0.415747 9.85778C0.455195 9.86334 0.934271 9.81055 1.84032 9.7021C1.79212 9.85783 1.78998 10.008 1.80819 10.1442C1.8264 10.2777 1.90619 10.667 2.24212 10.7088C2.51415 10.7421 4.39871 10.3194 5.13054 10.2082C7.67108 9.82441 10.2082 9.38224 12.7505 9.02629C16.728 8.46732 20.7083 7.96123 24.6891 7.46901C27.4029 7.12974 30.117 6.79879 32.8323 6.4762C36.2422 6.14249 39.6537 5.8338 43.0661 5.5557C52.8709 5.14135 62.6761 5.04678 72.4255 5.12187C84.0439 5.21364 95.7229 5.06624 107.266 7.20477L106.691 7.23817L106.486 7.24931C101.463 6.53183 95.4212 7.088 91.1659 7.02125C72.8432 6.7376 54.8117 7.66364 36.5593 9.93843C29.3953 10.8339 22.2353 12.0826 15.1096 13.5147C12.6451 14.0125 6.2456 15.1832 5.37436 15.6198C5.07681 15.7672 4.99666 16.087 4.97935 16.1983C4.95329 16.3651 4.96454 16.5264 5.01541 16.6849C5.04843 16.7878 5.10448 16.9075 5.21407 16.9992C5.25584 17.0354 5.33153 17.0826 5.44987 17.1076C5.55804 17.1299 5.75046 17.1438 6.03927 17.1438C29.3191 16.9964 52.5104 12.7166 75.7509 10.8812C84.3277 10.2027 92.9044 9.56027 101.483 8.93456C103.163 8.8122 104.844 8.73153 106.525 8.63698C106.879 8.68982 107.225 8.74819 107.566 8.81493L103.703 9.132C96.0049 9.76326 88.3278 10.6587 80.6435 11.6432C62.8474 13.9207 45.1328 17.7111 27.3215 19.6105C27.0759 19.6383 26.8901 19.9692 26.9069 20.353C26.9237 20.7367 27.137 21.026 27.3826 20.9981C45.1978 19.0988 62.9171 15.3056 80.7167 13.0281C88.392 12.0464 96.0602 11.1509 103.75 10.5197C106.484 10.2972 110.313 9.98291 111.043 9.91895C111.131 9.91061 111.181 9.9051 111.19 9.90232C111.4 9.86616 111.475 9.67146 111.486 9.64921C111.595 9.44064 111.604 9.22651 111.57 9.02907C111.548 8.90671 111.493 8.65087 111.266 8.54519C111.206 8.51738 111.145 8.48956 111.082 8.46453C111.754 8.44785 112.314 8.42564 112.469 8.37003C112.798 8.25045 112.85 7.85552 112.857 7.71092C112.864 7.55797 112.844 7.3939 112.766 7.23261C112.734 7.16586 112.68 7.07686 112.584 7.00455C112.535 6.97118 112.427 6.91557 112.236 6.86829C106.092 5.35825 99.9015 4.59911 93.6934 4.20422L97.5435 4.25147C97.5971 4.25147 97.6221 4.24869 97.6274 4.24869C97.8541 4.2181 97.9326 4.00118 97.9505 3.96224C98.0362 3.77592 98.0522 3.58403 98.0219 3.39493C98.0201 3.38102 97.9701 3.01115 97.7309 2.89435L100.228 2.84431C100.735 2.83597 100.987 2.82489 101.031 2.81933C101.251 2.78595 101.329 2.58567 101.345 2.5523C101.451 2.34651 101.462 2.13238 101.422 1.92381C101.406 1.8376 101.351 1.52614 101.081 1.44272C101.067 1.43715 100.997 1.4233 100.876 1.42052C99.7676 1.38993 91.7674 1.41491 88.6901 1.44272C83.7476 1.48721 78.8032 1.53452 73.8607 1.69026C70.2675 1.80149 66.678 1.97665 63.0884 2.20469C52.9862 1.82648 42.8944 1.18411 32.9227 0.00222002C32.6771 -0.0283701 32.4626 0.260859 32.4438 0.641845C32.4253 1.02561 32.6095 1.35931 32.8549 1.3899C39.1901 2.13796 45.5737 2.67468 51.9767 3.05845ZM89.9592 8.39501C72.0757 8.16976 54.4588 9.10138 36.6305 11.3261C29.4808 12.216 22.3352 13.4647 15.2238 14.894C14.3077 15.0804 12.8387 15.3557 11.3199 15.6505C32.811 14.9719 54.2373 11.1871 75.7063 9.49074C80.4561 9.11532 85.2077 8.75097 89.9592 8.39501Z"
                    fill="#EA5"
                  />
                </svg>
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
                <svg
                  className="absolute gl:top-9 md:top-6 top-5 md:left-6 -z-10"
                  width="113"
                  height="21"
                  viewBox="0 0 113 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M51.9767 3.05845C51.5686 3.0946 51.1609 3.13357 50.7531 3.16972C45.348 3.50621 39.9416 3.90943 34.5296 4.40722C31.1303 4.71868 28.7632 4.95506 26.8162 5.17197C18.0115 5.90335 9.22828 6.96011 0.505889 8.45068C0.345599 8.47849 0.264377 8.5285 0.254203 8.53684C0.0235862 8.70648 0.00377363 8.99852 0.000382208 9.14035C-0.0040802 9.34057 0.027872 9.60471 0.238319 9.7799C0.263487 9.79937 0.319538 9.84665 0.415747 9.85778C0.455195 9.86334 0.934271 9.81055 1.84032 9.7021C1.79212 9.85783 1.78998 10.008 1.80819 10.1442C1.8264 10.2777 1.90619 10.667 2.24212 10.7088C2.51415 10.7421 4.39871 10.3194 5.13054 10.2082C7.67108 9.82441 10.2082 9.38224 12.7505 9.02629C16.728 8.46732 20.7083 7.96123 24.6891 7.46901C27.4029 7.12974 30.117 6.79879 32.8323 6.4762C36.2422 6.14249 39.6537 5.8338 43.0661 5.5557C52.8709 5.14135 62.6761 5.04678 72.4255 5.12187C84.0439 5.21364 95.7229 5.06624 107.266 7.20477L106.691 7.23817L106.486 7.24931C101.463 6.53183 95.4212 7.088 91.1659 7.02125C72.8432 6.7376 54.8117 7.66364 36.5593 9.93843C29.3953 10.8339 22.2353 12.0826 15.1096 13.5147C12.6451 14.0125 6.2456 15.1832 5.37436 15.6198C5.07681 15.7672 4.99666 16.087 4.97935 16.1983C4.95329 16.3651 4.96454 16.5264 5.01541 16.6849C5.04843 16.7878 5.10448 16.9075 5.21407 16.9992C5.25584 17.0354 5.33153 17.0826 5.44987 17.1076C5.55804 17.1299 5.75046 17.1438 6.03927 17.1438C29.3191 16.9964 52.5104 12.7166 75.7509 10.8812C84.3277 10.2027 92.9044 9.56027 101.483 8.93456C103.163 8.8122 104.844 8.73153 106.525 8.63698C106.879 8.68982 107.225 8.74819 107.566 8.81493L103.703 9.132C96.0049 9.76326 88.3278 10.6587 80.6435 11.6432C62.8474 13.9207 45.1328 17.7111 27.3215 19.6105C27.0759 19.6383 26.8901 19.9692 26.9069 20.353C26.9237 20.7367 27.137 21.026 27.3826 20.9981C45.1978 19.0988 62.9171 15.3056 80.7167 13.0281C88.392 12.0464 96.0602 11.1509 103.75 10.5197C106.484 10.2972 110.313 9.98291 111.043 9.91895C111.131 9.91061 111.181 9.9051 111.19 9.90232C111.4 9.86616 111.475 9.67146 111.486 9.64921C111.595 9.44064 111.604 9.22651 111.57 9.02907C111.548 8.90671 111.493 8.65087 111.266 8.54519C111.206 8.51738 111.145 8.48956 111.082 8.46453C111.754 8.44785 112.314 8.42564 112.469 8.37003C112.798 8.25045 112.85 7.85552 112.857 7.71092C112.864 7.55797 112.844 7.3939 112.766 7.23261C112.734 7.16586 112.68 7.07686 112.584 7.00455C112.535 6.97118 112.427 6.91557 112.236 6.86829C106.092 5.35825 99.9015 4.59911 93.6934 4.20422L97.5435 4.25147C97.5971 4.25147 97.6221 4.24869 97.6274 4.24869C97.8541 4.2181 97.9326 4.00118 97.9505 3.96224C98.0362 3.77592 98.0522 3.58403 98.0219 3.39493C98.0201 3.38102 97.9701 3.01115 97.7309 2.89435L100.228 2.84431C100.735 2.83597 100.987 2.82489 101.031 2.81933C101.251 2.78595 101.329 2.58567 101.345 2.5523C101.451 2.34651 101.462 2.13238 101.422 1.92381C101.406 1.8376 101.351 1.52614 101.081 1.44272C101.067 1.43715 100.997 1.4233 100.876 1.42052C99.7676 1.38993 91.7674 1.41491 88.6901 1.44272C83.7476 1.48721 78.8032 1.53452 73.8607 1.69026C70.2675 1.80149 66.678 1.97665 63.0884 2.20469C52.9862 1.82648 42.8944 1.18411 32.9227 0.00222002C32.6771 -0.0283701 32.4626 0.260859 32.4438 0.641845C32.4253 1.02561 32.6095 1.35931 32.8549 1.3899C39.1901 2.13796 45.5737 2.67468 51.9767 3.05845ZM89.9592 8.39501C72.0757 8.16976 54.4588 9.10138 36.6305 11.3261C29.4808 12.216 22.3352 13.4647 15.2238 14.894C14.3077 15.0804 12.8387 15.3557 11.3199 15.6505C32.811 14.9719 54.2373 11.1871 75.7063 9.49074C80.4561 9.11532 85.2077 8.75097 89.9592 8.39501Z"
                    fill="#EA5"
                  />
                </svg>
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
