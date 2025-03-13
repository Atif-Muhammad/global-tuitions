import React from "react";
import BannerImages from "../../assets/images/banner-img.png";
import { Helmet } from "react-helmet-async";
const Banner = () => {
  return (
    <div>
      <Helmet>
        <title>
          Learn IT Skills | Online IT Training Courses - Global Tuition
        </title>
        <meta
          name="description"
          content="Master IT skills with Global Tuition. Join online courses and transform your future with expert-led IT training programs. Enroll today!"
        />
        <meta
          name="keywords"
          content="IT training, online IT courses, Global Tuition, learn IT skills, technology courses"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.globaltuition.co.uk/" />
      </Helmet>

      {/* <!-- banner section  --> */}
      <div className="bg-custombg w-full h-auto lg:rounded-bl-[300px] md:rounded-bl-[200px]">
        <div className="flex md:flex-row flex-col-reverse py-5 h-auto">
          <div className="md:w-[60%] w-full flex items-center">
            <div className="flex flex-col gap-5 md:justify-center justify-center px-5 md:px-[100px] lg:px-[120px] xl:px-[140px] 2xl:px-[170px]">
              <div className="font-bold font-readex text-black 2xl:text-[90px] xl:text-[80px] lg:text-[70px] md:text-[55px] text-[50px]">
                <h1 className=" lg:w-[100px]  leading-[70px] ">
                  Empowering IT skills, Transforming Futures.
                </h1>
              </div>
              <div>
                <h2 className="font-poppins text-[12px] md:text-[16px] tracking-normal  ">
                  Learn in-demand IT skills from expert instructors. Join Global
                  Tuition’s online courses and build your future in tech!
                </h2>
              </div>
            </div>
          </div>

          <div className="md:w-[40%] w-full flex justify-center md:justify-end">
            <img
              src={BannerImages}
              alt="Online IT Training Courses - Global Tuition"
              className="w-11/12 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
