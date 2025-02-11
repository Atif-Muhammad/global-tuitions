import React, { useRef } from "react";
import findcoursesImg from "../../assets/images/findcourses-img.png";
import { MdExpandLess } from "react-icons/md";
import FreeCourses from "./FreeCourses";

const FreeCoursesBanner = () => {
  const nextSectionRef = useRef(null);

  const scrollToSection = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      
      {/* Banner Section */}
      <div className="w-full h-auto  bg-[#A4DCAA]">
        <div className=" mx-auto flex flex-col md:flex-row items-center">
          {/* Text Section */}
          <div className="md:w-1/2 w-full md:px-10 px-6 lg:pl-12 flex">
            {/* Text and Button */}
            <div className="flex flex-col gap-6 text-center md:text-left">
              <h1
                className="font-extrabold leading-[1] tracking-tighter font-readex 
          lg:text-[48px] md:text-[38px] text-[28px] xl:text-[56px] 2xl:text-[64px]"
              >
                Avail from a wide range of free training, <br /> workshops, and
                tuitions.
              </h1>
              <div className="flex justify-center md:justify-start">
                <button
                  className="btnbutton flex items-center gap-1"
                  onClick={scrollToSection}
                >
                  SCROLL DOWN
                  <MdExpandLess className="text-[25px] rotate-180" />
                </button>
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 w-full flex justify-center items-center">
            <img
              src={findcoursesImg}
              alt="Banner Image"
              className="w-[300px] h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] 
          xl:w-[600px] xl:h-[600px] 2xl:w-[700px] 2xl:h-[700px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Next Section */}
      <div ref={nextSectionRef}>
        <FreeCourses />
      </div>
    </>
  );
};

export default FreeCoursesBanner;
