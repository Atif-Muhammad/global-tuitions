import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { FaBookmark } from "react-icons/fa6";
import { MdPlayArrow } from "react-icons/md";

const Card = (props) => {
  const navigate = useNavigate()
  const descriptionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % 2);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + 2) % 2);
  };

  const handleNavigate = (id)=>{
    navigate(`/Course_detail/${id}`)  
  }

  useEffect(() => {
    // console.log(":::", props.course);
  }, []);

  return (
    <div class="relative overflow-hidden font-urbanist bg-white w-full h-full flex flex-col  p-0 rounded-xl shadow-black shadow-lg ">
      <div class="flex w-full transition-transform  duration-300 ease-in-out gap-0">
        <div
          class=" w-full flex-shrink-0 h-full p-2 "
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.7s ease-in-out",
          }}
        >
          <div className="w-full h-72 bg-custombg rounded-t-xl">
            <div className="flex justify-between bg-black text-white rounded-t-lg items-center p-3.5">
              <h3 className="text-2xl font-medium">
                Duration:{" "}
                <span className="font-normal">
                  {props.course?.course_duration} Hours
                </span>
              </h3>
              <FaBookmark />
            </div>
            <div className="flex  items-center   h-48 ">
              <h3 className=" px-2 md:text-3xl  text-[32px] font-bold">
                {props.course?.course_name}
              </h3>
            </div>
          </div>
        </div>
        <div
          class="w-full flex-shrink-0 h-full p-2"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.7s ease-in-out",
          }}
        >
          <div className="w-full h-72 bg-custombg rounded-t-xl  ">
            <div className="flex justify-between items-center p-3.5 bg-black text-white rounded-t-lg">
              {props.course?.price ? (
                <h3 className="text-2xl font-bold">
                  Charges:{" "}
                  <span className="font-normal">{props.course?.price}£/hr</span>
                </h3>
              ) : (
                <p className="text-2xl font-medium">
                  {new Date(
                    `1970-01-01T${props.course?.time}:00`
                  ).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}{" "}
                  ,{"  "}
                  {new Date(props.course?.date).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              <FaBookmark />
            </div>
            <div ref={descriptionRef} className="text-xl ml-5 mr-5">
              <p className="text-lg col-span-10  flex-grow text-left tracking-wide overflow-hidden text-ellipsis break-words py-3 ">
                <div
                  className="line-clamp-6 "
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      props.course?.course_description
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className={`absolute left-2 top-1/2  transform -translate-y-1/2 text-2xl font-semibold rotate-180  ${
          currentIndex === 0 ? "hidden" : ""
        }`}
        style={{
          top: "52%",
          height: "72px",
          marginTop: "-36px",
        }}
      >
        <MdPlayArrow />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className={`absolute right-2 top-1/2  transform -translate-y-1/2 text-2xl font-semibold ${
          currentIndex === 1 ? "hidden" : ""
        }`}
        style={{
          top: "52%",
          height: "72px",
          marginTop: "-36px",
        }}
      >
        <MdPlayArrow />
      </button>
      {/* Footer */}
      <div className="flex flex-row justify-between  items-center w-full overflow-hidden px-2 py-5">
        <div>
          <p className="text-2xl font-bold">
            {props.course?.category_id?.category_name ||
              props.course?.category_name ||
              "Unknown Category"}
          </p>
        </div>
        <div>
          {/* <Link to="/Course_detail" state={props.course._id}>
            <button className="btnbutton">Details</button>
          </Link> */}
          <button onClick={() => handleNavigate(props.course._id)}>
            <button className="btnbutton">Details</button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
