import React from "react";
import whatweofferImg from "../../assets/images/whatweoffer-img.png";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const WhatWeOffers = () => {
  return (
    <div>
      <Helmet>
        <title>
          What We Offer | IT Courses & Online Learning | Global Tuition
        </title>
        <meta
          name="description"
          content="Learn IT skills with expert-led courses in programming, web development, and more. Join Global Tuition and boost your tech career today!"
        />
        <meta
          name="keywords"
          content="IT courses, online learning, programming, web development, database management, tech training"
        />
      </Helmet>

      {/* <!-- What we offer section --> */}
      <div className="w-full h-auto py-12">
        <div className="flex lg:flex-row font-urbanist flex-col-reverse gap-10">
          {/* Image Section */}
          <div className="lg:w-[40%] w-full flex justify-center lg:pl-8 md:py-0 py-8">
            <img
              src={whatweofferImg}
              alt="Global Tuition - Online IT Courses and Training"
              className="w-full max-w-[400px] object-cover rounded-xl "
            />
          </div>

          {/* Text Section */}
          <div className="lg:w-[60%] w-full lg:px-16 md:px-12 px-8 md:py-0 py-8 flex text-justify lg:text-start">
            <div className="flex flex-col gap-6">
              {/* Heading */}
              <div className="font-bold font-readex text-[32px] md:text-[38px] lg:text-[45px] xl:text-[50px] 2xl:text-[55px] text-start text-[#333]">
                <h1>What Can We Offer?</h1>
              </div>

              {/* Description */}
              <div>
                <h2 className="lg:w-full leading-relaxed font-poppins md:text-[16px] xl:text-[18px] 2xl:text-[20px] text-gray-700">
                  At Global Tuitions, we offer comprehensive IT tuition services
                  tailored to your needs. Our expert instructors provide courses
                  in programming languages, software development, database
                  management, web development, and more. Whether you're a
                  beginner looking to kickstart your IT journey or a seasoned
                  professional seeking to enhance your skills, we have the
                  resources and expertise to help you succeed. With hands-on
                  training, personalized attention, and flexible scheduling
                  options, we’re committed to empowering you to excel in the
                  ever-evolving world of technology. Explore our range of
                  courses and start your journey towards tech mastery today!
                </h2>
              </div>

              {/* Courses Button */}
              <div>
                <NavLink
                  to="/courses"
                  className="btnbutton"
                  aria-label="Explore our online IT courses and enroll today"
                  title="Explore our IT Courses"
                >
                  Explore Courses
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffers;
