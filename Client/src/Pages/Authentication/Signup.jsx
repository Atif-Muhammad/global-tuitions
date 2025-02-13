import React, { useRef, useContext } from "react";
import { FaGoogle } from "react-icons/fa"; // Import the Google icon
import Config from "../../../Config/Config";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify components
import valueContext from "../../Context/context";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Buttonloader from "../buttonLoader/Buttonloader";
import { Helmet } from "react-helmet-async";
const Signup = () => {
  const location = useLocation();
  const previousRoute = location.state?.from;
  const { updateExistance } = useContext(valueContext);
  const navigate = useNavigate();

  const signupSchema = Yup.object({
    name: Yup.string()
      .required("Full Name is required")
      .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed for this field"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    remember: Yup.boolean(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // e.preventDefault();
    // console.log(values)
    Config.signup(values)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
          updateExistance(true);
          toast.success("Account Created successfully!"); // Show success toast
          setTimeout(() => {
            if (previousRoute === "enroll") {
              navigate(-1);
            } else {
              navigate("/");
            }
          }, 2000);
        } else {
          setSubmitting(false);
          toast.error("Failed to Signup. Please try again."); // Show error toast
        }
      })
      .catch(() => {
        setSubmitting(false);
        toast.error("An error occurred. Please try again."); // Show error toast
      });
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Global Tuition - Join for Free Online Learning</title>
        <meta
          name="description"
          content="Sign up for free at Global Tuition and start learning from expert tutors. Create your account now!"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Sign Up | Global Tuition" />
        <meta
          property="og:description"
          content="Join Global Tuition today! Create a free account and access top-quality online courses."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/signup" />
        <meta
          property="og:image"
          content="https://yourwebsite.com/assets/signup-banner.jpg"
        />
      </Helmet>

      {/* Toast Container for handling toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen flex items-center pb-4 justify-center bg-[#a4dcaa]/80">
        {/* Card Container with margin-top for better spacing */}
        <div className="w-full max-w-lg bg-[#a4dcaa] rounded-xl shadow-2xl shadow-black  border border-gray-200 mt-10">
          {/* Header Section */}
          <div className="text-center  rounded-t-xl py-4 bg-black text-white mb-8">
            <h1 className="text-4xl font-extrabold">Create Your Account</h1>
            <p className=" mt-2">Sign up to get started with your journey.</p>
          </div>

          <div className="p-10">
            {/* Form Section */}
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                remember: false,
              }}
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="remember"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full py-3 bg-blue-500 flex justify-center text-white rounded-lg font-bold shadow-md hover:bg-blue-600 transition duration-300`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Buttonloader /> : <>Create Account</>}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="h-[1px] w-full bg-gray-500"></div>
                    <span className="text-gray-700 font-medium">OR</span>
                    <div className="h-[1px] w-full bg-gray-500"></div>
                  </div>

                  {/* Google Sign-Up */}
                  <button
                    type="button"
                    className="w-full py-3 border border-gray-300 bg-gray-100 rounded-lg font-medium text-gray-600 flex items-center justify-center hover:bg-gray-200 transition duration-300"
                  >
                    <FaGoogle className="mr-3 text-red-500" />
                    Sign up with Google
                  </button>
                </Form>
              )}
            </Formik>
            {/* Footer Section */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <NavLink
                  href="/signin"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Sign in here
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
