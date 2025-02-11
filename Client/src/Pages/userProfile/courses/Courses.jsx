import React, { useEffect, useState } from "react";
// import API_URLS from '../../../config/Config';
import axios from "axios";
import Config from "../../../../Config/Config";
import FeedBack from "./Feedback"

const Courses = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state to handle API call status
  const [error, setError] = useState(null); // Add error state to capture any errors
  const [feedBack, setFeedBack] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState({})
  const [info, setInfo] = useState({})

  const getDetails = async () => {
    Config.getUserInfo()
      .then((res) => {
        setUserInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleView = (course, info)=>{
    setFeedBack(true)
    setSelectedCourse(course)
    setInfo(info)
  }
  if (error) {
    return <div>{error}</div>; // Display the error if any
  }

  return (
    <div className="w-full font-urbanist bg-[#c4fad9]">
      <div className="py-16 px-6">
        <div className=" text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-left text-gray-800 pb-8">
          <p className="underline">Courses</p>
        </div>

        <div className="flex flex-col gap-8 lg:gap-10 overflow-y-auto md:max-h-[70vh] h-full scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
          {userInfo.map((info, userIndex) => {
            return [...info?.courses_availed] // Create a shallow copy of courses_availed
              .reverse()
              .map((course, index) => (
                <div
                  key={`${userIndex}-${index}`}
                  className="flex flex-col p-6 lg:p-8 bg-[#FFF6DE] rounded-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="font-poppins text-2xl md:text-3xl lg:text-4xl font-light text-gray-700">
                      <p>{course.for_course?.course_name}</p>
                    </div>
                    <div className="font-urbanist text-lg md:text-xl lg:text-2xl text-gray-800">
                      <p>${course.for_course?.price} per hour</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-3 text-sm md:text-base lg:text-lg text-gray-700">
                    <div className="flex flex-row gap-2">
                      <span className="font-semibold">Preferred Date:</span>
                      <p>
                        {new Date(course?.preferred_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long", // Full month name (e.g., "June")
                            day: "numeric", // Numeric day (e.g., "3")
                            year: "numeric", // Full year (e.g., "2024")
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span className="font-semibold">Category:</span>
                      <p>{course.for_course?.category_id?.category_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center mt-4">
                    <div className="flex flex-row items-center gap-2 text-sm md:text-base lg:text-lg text-green-500">
                      <i className="fa-solid fa-check"></i>
                      <p>Completed</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleView(course, info)}
                        className="py-3 px-5 bg-black text-white text-sm md:text-base lg:text-lg rounded-lg hover:bg-gray-800 transition-all"
                      >
                        Give Feedback
                      </button>
                    </div>
                  </div>
                </div>
              ));
          })}
        </div>
      </div>
      {feedBack && (
        <FeedBack
          course={selectedCourse}
          info={info}
          closeFeedback={() => setFeedBack(false)}
        />
      )}
    </div>
  );
};

export default Courses;
