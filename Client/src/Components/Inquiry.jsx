import React, { useState, useEffect } from "react";
import Config from "../../Config/Config"; 
import { useLocation, useNavigate } from "react-router-dom";
import ContactusImg from "./../assets/images/contactus-img.png";
import DOMPurify from "dompurify";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Buttonloader from "../Pages/buttonLoader/Buttonloader";

const Inquiry = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [isCourse, setIsCourse] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const course = location.state?.course;

  const navigate = useNavigate();

  const postInqHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      inquiry_by: name,
      email: email,
      phone: phone,
      inquiry: msg,
      for_course: course?._id,
    };
    console.log(data);

    // Call the postInq function from Config.js
    Config.postInq(data)
      .then((res) => {
        if (res === "OK") {
          toast.success("Inquiry submitted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          // Navigate back after showing success message
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        } else {
          toast.error("Failed to submit inquiry. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      });
  };

  const checkSession = () => {
    Config.checkSession()
      .then((res) => {
        setEmail(res.email);
        setName(res.student_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkSession();
    setIsCourse(!!course); // Set isCourse to true if course exists
  }, []);

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value); // You can verify this token in the backend.
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer />

      <div className="w-full h-auto">
        <div className="flex w-full flex-col md:flex-row ">
          {/* Inquiry Section */}
          <div className="bg-[#73a979] px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 py-7 sm:py-8 md:py-10 lg:py-12 xl:py-14 font-readex w-full md:w-1/2">
            <form onSubmit={postInqHandler} className="flex flex-col gap-5">
              <div>
                <div className="text-[25px] sm:text-[35px] md:text-[45px] lg:text-[55px] xl:text-[65px] font-extrabold text-white">
                  <p>Inquiry</p>
                </div>
              </div>
              <div className="flex flex-col w-full gap-4 text-white">
                <input
                  type="text"
                  name="name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  // onChange={name}
                  className="bg-transparent w-full py-2 border-[2px] border-white rounded-lg pl-4 placeholder-white focus:outline-none focus:border-green-300"
                  placeholder="Name"
                  autoComplete="off"
                />
                <input
                  type="email"
                  name="email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  // onChange={email}
                  className="bg-transparent w-full py-2 border-[2px] border-white rounded-lg pl-4 placeholder-white focus:outline-none focus:border-green-300"
                  placeholder="Email"
                  autoComplete="off"
                />
                <input
                  type="tel"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent w-full py-2 border-[2px] border-white rounded-lg pl-4 placeholder-white focus:outline-none focus:border-green-300"
                  placeholder="Phone"
                  autoComplete="off"
                />
                <textarea
                  name="msg"
                  onChange={(e) => setMsg(e.target.value)}
                  className="bg-transparent w-full py-2 border-[2px] border-white rounded-lg pl-4 placeholder-white focus:outline-none focus:border-green-300"
                  placeholder="Your Message"
                  autoComplete="off"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex items-start gap-2 text-[10px] sm:text-[12px] md:text-[14px]">
                <input required type="checkbox" name="consent" id="consent" />
                <label htmlFor="consent" className="leading-tight">
                  By checking this box, you consent to collecting and storing
                  the data provided in this form for the purpose of responding
                  to your inquiry.
                </label>
              </div>
              <div className="captcha-container mb-4">
                <ReCAPTCHA
                  sitekey="6LelgYkqAAAAAJeA6csMwb-UelWCKBjDTmLYNp6_" // Replace with your Google reCAPTCHA site key
                  onChange={handleCaptchaChange}
                />
              </div>
              <button
                type="submit"
                className={`btnbutton flex justify-center`}
                disabled={loading}
              >
                {loading ? <Buttonloader /> : <>Inquire</>}
              </button>
            </form>
          </div>

          {isCourse ? (
            <div className="flex flex-col gap-5 px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 py-7 sm:py-8 md:py-10 lg:py-12 xl:py-14 w-full md:w-1/2">
              <div className="flex justify-start flex-col gap-y-4">
                <div className="text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px] 2xl:text-[80px] font-extrabold  leading-[0.9] font-readex">
                  <p>{course?.course_name}</p>
                </div>
                <div className="gap-y-2 flex flex-col text-[10px] sm:text-[10px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[20px] font-semibold  leading-[0.9] font-readex">
                  {course?.price ? (
                    <p>price: {course?.price}£</p>
                  ) : (
                    <p>Free course</p>
                  )}
                  <p>duration: {course?.course_duration}hrs (approximatly)</p>
                </div>
              </div>
              <div className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-loose">
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(course?.course_description),
                  }}
                ></p>
              </div>
              <div className="flex justify-center items-center">
                <img src={ContactusImg} alt="Contact Us" />
              </div>
            </div>
          ) : (
            <div className="px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 py-7 sm:py-8 md:py-10 lg:py-12 xl:py-14 w-full md:w-1/2">
              <div className="flex justify-start">
                <div className="text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px] font-extrabold font-readex">
                  <p>Contact Us</p>
                </div>
              </div>
              <div className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-loose">
                <p>
                  Please get in touch with us for any inquiries. Our team will
                  be happy to assist you.
                </p>
              </div>
              <div className="flex justify-center items-center">
                <img src={ContactusImg} alt="Contact Us" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Inquiry;
