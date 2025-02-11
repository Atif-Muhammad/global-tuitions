import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Config from "../../Config/Config";
import DOMPurify from "dompurify";
import ContactusImg from "./../assets/images/contactus-img.png";
import ReCAPTCHA from "react-google-recaptcha";
import loader from "../Pages/Loader/Loader";
import { Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Add this to include the default styles
import Buttonloader from "../Pages/buttonLoader/Buttonloader";

const Enrollment = () => {
  const location = useLocation();
  const course = location.state?.course;
  const [noUser, setNoUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [preferedDate, setPreferedDate] = useState("");
  const [preferedTime, setPreferedTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = {
      applier: name,
      applier_email: email,
      applier_phone: phone,
      applier_Address: address,
      message: msg,
      preferred_date: preferedDate ? `${preferedDate}` : "--",
      preferred_time: preferedTime ? `${preferedTime}` : "--",
      course_type: course.price ? `${course.price}` : "free_course",
      for_course: course._id,
    };

    Config.postEnrollment(data)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Enrollment submitted", {
            position: "top-right",
            autoClose: 2000, // auto-close after 2 seconds
          });
          setTimeout(() => {
            navigate(-1); // Navigate to the previous page after 2 seconds
          }, 2000);
        } else if (res.status === 409) {
          toast.warning("Already Enrolled in this Course.", {
            position: "top-right",
            autoClose: 2000,
          });
          setLoading(false);
        } else {
          toast.error("Failed to submit enrollment. Please try again.", {
            position: "top-right",
            autoClose: 2000,
          });
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
        setLoading(false);
      });
  };

  const checkSession = async () => {
    Config.checkSession()
      .then((res) => {
        // console.log(res);
        const expiration = res.exp;
        const expiryDate = new Date(expiration * 1000);
        const currentDate = new Date();

        if (currentDate < expiryDate) {
          setNoUser(false);
          setName(res?.student_name || "");
          setEmail(res?.email || "");
          // console.log(res)
        } else {
          setNoUser(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkSession();
    if (location.state?.loggedIn) {
      setNoUser(false);
    }
  }, [location.state]);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    // console.log("Captcha value:", value);
  };
  return (
    <Suspense fallback={loader}>
      <ToastContainer />

      {/* <!-- img and inquiry form both togahter for xl screens  --> */}
      <div className="w-full h-auto">
        <div className="flex md:flex-row flex-col">
          {/* <!-- inquiry section  --> */}
          <div className="bg-[#73a979] xl:px-16 2xl:px-20 md:px-12 lg:px-14 px-10 md:py-8 lg:py-10 py-7 xl:py-12 2xl:py-14 font-readex w-full md:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 justify-start"
            >
              <div className="  ">
                <div className="2xl:text-[90px] xl:text-[80px] lg:text-[70px] md:text-[60px] text-[50px] font-extrabold text-white">
                  <p>Get Enrolled</p>
                </div>
              </div>
              {/* <!-- form  --> */}
              <div className="flex flex-col gap-5 justify-start text-white placeholder-white">
                <div className="">
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder-white placeholder:px- pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                    disabled
                  />
                </div>
                <div className="">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder-white placeholder:px- pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                    disabled
                  />
                </div>

                <div className="">
                  <input
                    type="tel"
                    name="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder-white placeholder:px- pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                    placeholder="Phone"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <textarea
                    type="text"
                    name="address"
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder:text-white pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                    placeholder="Your Address"
                    autoComplete="off"
                    rows="5"
                  ></textarea>
                </div>
                <div className="">
                  <textarea
                    type="text"
                    name="msg"
                    onChange={(e) => setMsg(e.target.value)}
                    className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder:text-white pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                    placeholder="Enter Message"
                    autoComplete="off"
                    rows="5"
                  ></textarea>
                </div>

                {/* Conditional Rendering for Preferred Date and Time */}
                {course?.category_id.category_name !== "Free Courses" && (
                  <>
                    <div className="">
                      <p>Preferred Date</p>
                      <input
                        type="date"
                        name="preferedDate"
                        required
                        onChange={(e) => setPreferedDate(e.target.value)}
                        className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder-white placeholder:px- pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                        placeholder="Enter your Preferred Date"
                        autoComplete="off"
                        aria-date-current="today"
                        min={new Date().toISOString().split("T")[0]} // Prevents previous dates
                      />
                    </div>
                    <div className="">
                      <p>Preferred Time</p>
                      <input
                        type="time"
                        name="preferedTime"
                        required
                        onChange={(e) => setPreferedTime(e.target.value)}
                        className="bg-transparent appearance-none w-full py-2 border-white border-[2px] rounded-lg shadow-lg placeholder-white placeholder:px- pl-5 hover:border-green-300 focus:border-green-300 focus:outline-none"
                        placeholder="Enter your Preferred time"
                        autoComplete="off"
                      />
                    </div>
                  </>
                )}
              </div>
              {/* <!-- checkbox  --> */}
              <div className="flex gap-3 lg:text-[15px] md:text-[12px] text-[10px]">
                <span>
                  <input required type="checkbox" name="" id="" />
                </span>
                <p>
                  By checking this box, you consent to collecting and storing
                  the data provided in this form for the purpose of responding
                  to your inquiry.
                  <span className="hidden md:inline">
                    We respect your privacy and adhere to all relevant data
                    protection regulations. For more information, please review
                    our Privacy Policy.
                  </span>
                </p>
              </div>

              {/* Google reCAPTCHA */}
              <div className="captcha-container mb-4">
                <ReCAPTCHA
                  sitekey="6LelgYkqAAAAAJeA6csMwb-UelWCKBjDTmLYNp6_" // Replace with your Google reCAPTCHA site key
                  onChange={handleCaptchaChange}
                />
              </div>
              {/* <!-- button  --> */}
              <div className="w-full flex justify-start">
                <button
                  type="submit"
                  className={` flex justify-center text-center self-start py-2 px-4 xl:px-5 bg-black border-white border-[2px] hover:border-black rounded-lg text-slate-50 shadow-md duration-500 text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]`}
                  disabled={loading}
                >
                  {loading ? <Buttonloader /> : <>Enroll Now</>}
                </button>
              </div>
            </form>
          </div>
          {/* <!-- contact us section  --> */}
          <div className="flex flex-col gap-2 xl:px-16 2xl:px-20 md:px-12 lg:px-14 px-10 md:py-8 lg:py-10 py-7 xl:py-12 2xl:py-14 w-full md:w-1/2">
            {/* <!-- contact us heading  --> */}
            <div className="flex justify-start">
              <div className="lg:text-[70px] md:text-[60px] text-[40px] xl:text-[80px] 2xl:text-[90px] font-extrabold font-readex leading-tight lg:leading-[90px] tracking-tighter">
                <p>{course?.course_name}</p>
              </div>
            </div>
            <div className="lg:text-[20px] md:text-[18px] text-[17px] xl:text-[23px] 2xl:text-[25px] font-semibold">
              <div className="lg:text-[20px] md:text-[18px] text-[17px] xl:text-[23px] 2xl:text-[25px] font-semibold">
                <p>
                  {course?.category_id?.category_name === "Free Courses" ? (
                    <span className=" text-red-500 font-bold">
                      Free Courses
                    </span>
                  ) : (
                    `${course?.price}$ / hour`
                  )}
                </p>
              </div>
            </div>
            <div className="lg:text-[20px] md:text-[18px] text-[17px] xl:text-[23px] 2xl:text-[25px] font-semibold">
              <p>Duration: {course?.course_duration} hours</p>
            </div>
            {/* <!-- text   --> */}
            <div className="flex justify-start">
              <p className="text-base">
                <span
                  className="inline leading-loose tracking-widest text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(course?.course_description),
                  }}
                >
                  {/* {course?.course_description} */}
                </span>
              </p>
            </div>
            {/* <!-- img  --> */}
            <div className="flex justify-center items-center">
              <img src={ContactusImg} alt="" />
            </div>
          </div>
        </div>
      </div>

      {noUser && (
        <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-white rounded-lg font-urbanist shadow-lg w-11/12 sm:w-1/3 ">
            <div class="bg-black py-3 rounded-t-lg">
              <h2 class="text-3xl font-bold  text-white  text-center">
                Login Required!
              </h2>
            </div>
            <div class="text-center text-black my-3">
              <p class="text-lg text-gray-700">
                Please sign in to your account before proceeding with enrollment
                to ensure a seamless experience.
              </p>
            </div>

            <div class="flex justify-center my-4">
              <NavLink
                state={{ from: "enroll" }}
                to="/signin"
                className="btnbutton"
              >
                Log In
              </NavLink>
            </div>
          </div>
              
        </div>
      )}
    </Suspense>
  );
};

export default Enrollment;
