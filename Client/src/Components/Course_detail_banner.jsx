import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Config from "../../Config/Config";
import ArrowImg from "./../assets/images/arrow.svg";
import LineImg from "./../assets/images/linedesign.svg";
import DetailCourseSkeleton from "../Pages/Skeletons/DetailCourseSkeleton";

const Course_detail_banner = (props) => {
  const [course, setCourse] = useState([]);

  const location = useLocation();
  const id = location.state || props.id;
  console.log("from state: ", id);

  useEffect(() => {
    console.log("in details", id);
    Config.get_enabled_contents(id)
      .then((res) => {
        setCourse(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleDownloadPDF = async () => {
    const page = pageRef.current;
    const canvas = await html2canvas(page, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("page.pdf");
  };

  const pageRef = useRef();

  // if (!course) return <Loader />;

  return (
    <>
      {course.length === 0 ? (
        <DetailCourseSkeleton />
      ) : (
        <div ref={pageRef}>
          {/* <!-- Banner Section - Course Detail --> */}
          <div className="bg-[#a4dcaa] py-8 font-readex">
            <div className="px-6 md:px-8 lg:px-10 xl:px-20 2xl:px-28">
              {/* <!-- Main Container --> */}
              <div className="flex flex-col lg:flex-row gap-8 lg:justify-between justify-center items-center relative">
                {/* <!-- HTML for Beginners Section --> */}
                <div className="lg:w-[45%] md:w-[80%] w-[90%] flex flex-col gap-6">
                  {/* <!-- Title --> */}
                  <div className=" font-extrabold  leading-[0.9] text-[50px] md:text-[60px] lg:text-[70px] xl:text-[80px] 2xl:text-[90px] w-full">
                    <p>{course?.course_name}</p>
                    <img
                      src={LineImg}
                      alt="arrow"
                      class="mt-[px] md:mt-[px] lg:mt-[-20px] xl:mt-[px] 2xl:mt-[px] w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[450px]"
                    />
                  </div>
                  {/* <!-- Description --> */}
                  <div className="tracking-tighter  leading-tight text-[px] md:text-[px] lg:text-[20px] xl:text-[px] 2xl:text-[px] font-light">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(course?.course_description),
                      }}
                    ></p>
                  </div>
                  <div
                    class="absolute top-0 xl:top-0 -rotate-12 xl:right-1/3 right-1/3 hidden lg:flex
"
                  >
                    <img src={ArrowImg} alt="" className="" />
                  </div>
                </div>

                {/* <!-- Course Detail Card --> */}
                <div className="lg:w-[55%] w-full flex justify-center lg:justify-end">
                  <div className="max-w-[470px] w-full bg-[#90c896] p-4 md:p-6 border-[2px] border-black border-b-4 border-r-4 shadow-lg rounded-lg">
                    <div className="flex flex-col gap-5">
                      {/* <!-- Course Title --> */}
                      <div className="flex flex-col gap-2">
                        {course?.category_id?.category_name ===
                          "Free Courses" ||
                        course?.category_name === "Free Courses" ? (
                          <p className="text-[30px] md:text-[33px] lg:text-[35px] xl:text-[37px] 2xl:text-[42px] font-bold">
                            Free Course
                          </p>
                        ) : (
                          <p className="text-[30px] md:text-[33px] lg:text-[35px] xl:text-[37px] 2xl:text-[42px] font-bold">
                            {course?.category_id?.category_name ||
                              course?.category_name ||
                              "Unknown Category"}
                          </p>
                        )}
                        <div className="w-full h-[2px] bg-slate-100 opacity-50"></div>
                      </div>
                      {/* <!-- Course Details --> */}
                      <div className="flex flex-col gap-3 text-[20px] md:text-[23px] lg:text-[25px] xl:text-[28px] 2xl:text-[32px]">
                        <div>
                          {course?.course_level
                            ? `${course.course_level
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")} Level`
                            : ""}
                        </div>
                        {course?.price ? (
                          <div> {course?.price}$ per hour</div>
                        ) : (
                          <p>
                            {new Date(
                              `1970-01-01T${course?.time}:00`
                            ).toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                            3{" "}
                            {new Date(course?.date).toLocaleDateString(
                              "en-US",
                              {
                                timeZone: "UTC",
                                month: "long", // Full month name (e.g., "June")
                                day: "numeric", // Numeric day (e.g., "3")
                                year: "numeric", // Full year (e.g., "2024")
                              }
                            )}{" "}
                          </p>
                        )}
                        <div>
                          {" "}
                          {course?.course_duration} hour (approximately)
                        </div>
                        {course?.price && <div>Flexible Schedule</div>}
                      </div>

                      {/* <!-- Action Buttons --> */}
                      <div className="flex flex-row  md:gap-2 md:justify-between mt-4">
                        <Link
                          to="/avail"
                          state={{ course }}
                          className="btnbutton"
                        >
                          Enroll
                        </Link>
                        <Link
                          to="/inquiry"
                          state={{ course }}
                          className="btnbutton"
                        >
                          Inquiry
                        </Link>
                        <button
                          onClick={handleDownloadPDF}
                          className="btnbutton"
                        >
                          PDF
                        </button>
                        {/* Print Button */}
                        <button
                          className="btnbutton"
                          onClick={() => window.print()} // Add the onClick handler
                        >
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* <!-- What You Will Learn Section --> */}
            <div className="w-full font-urbanist h-auto bg-gray-50 py-10">
              <div className="max-w-[1700px] mx-auto px-5 lg:px-10">
                <div className="flex flex-col gap-10">
                  <div>
                    <p className="font-readex text-[36px] md:text-[50px] lg:text-[60px] xl:text-[70px] 2xl:text-[80px] tracking-tighter leading-tight w-full text-center">
                      What You Will Learn?
                    </p>
                  </div>
                  {course?.course_contents
                    ?.filter((content) => content.enabled_flag === true)
                    .map((content, index) => (
                      <div
                        key={index}
                        className={`flex flex-col shadow-lg rounded-md p-5 ${
                          content.content_description
                            ? "bg-white"
                            : "bg-[#d3d9ef]"
                        }`}
                      >
                        <div
                          className={`font-readex text-[24px] md:text-[30px] lg:text-[40px] xl:text-[50px] tracking-tighter leading-tight`}
                        >
                          <p>
                            {index + 1}. {content.topic}
                          </p>
                        </div>
                        <div className="w-full h-auto mt-3">
                          <div className="p-4 bg-[#d3d9ef] rounded-2xl">
                            <p
                              className="text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] tracking-wide leading-loose"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  content.content_description
                                ),
                              }}
                            ></p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* <!-- Skills You Get Section --> */}
            {course.skills?.length > 0 && (
              <div className="w-full h-auto bg-gray-100 py-10">
                <div className="max-w-[1700px] font-urbanist mx-auto px-5 lg:px-10">
                  <div className="mb-6">
                    <p className="font-readex text-[28px] md:text-[34px] lg:text-[45px] xl:text-[55px] 2xl:text-[65px] tracking-tighter leading-tight">
                      Skills You Get
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
                    {course.skills?.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#72c47b] border-[2px] border-black shadow-lg rounded-lg"
                      >
                        <p className="text-white text-center text-[14px] md:text-[16px] lg:text-[18px] py-3 px-4 tracking-wide">
                          {skill}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Course_detail_banner;
