import React, { useContext, useRef } from "react";
import { FaGoogle } from "react-icons/fa"; // Import the Google icon
import Config from "../../../Config/Config";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import valueContext from "../../Context/context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Buttonloader from "../buttonLoader/Buttonloader";
import { Helmet } from "react-helmet-async";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signinSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Required"),
    password: Yup.string()
      .min(8, "Password too short! Must be atleast 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Required"),
  });

  const { updateExistance } = useContext(valueContext);

  const previousRoute = location.state?.from;
  const handleSubmit = (values, { setSubmitting }) => {
    Config.signin(values)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          updateExistance(true);
          toast.success("Login successful!");
          setTimeout(() => {
            if (previousRoute === "enroll") {
              navigate(-1);
            } else {
              navigate("/");
            }
          }, 2000);
        } else {
          setSubmitting(false);
          toast.error("Invalid Credentials. Please try again.");
        }
      })
      .catch((err) => {
        setSubmitting(false);
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <>
      <Helmet>
        <title>Login - Global Tuition</title>
        <meta
          name="description"
          content="Log in to Global Tuition to access online courses and educational resources."
        />
        <meta
          name="keywords"
          content="online tuition, student login, global tuition, courses, education"
        />
        <meta property="og:title" content="Login - Global Tuition" />
        <meta
          property="og:description"
          content="Log in to Global Tuition to access online courses and educational resources."
        />
        <meta property="og:url" content="https://yourwebsite.com/signin" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login - Global Tuition" />
        <meta
          name="twitter:description"
          content="Log in to Global Tuition to access online courses and educational resources."
        />
      </Helmet>

      {/* ToastContainer to display toasts */}
      {/* <ToastContainer /> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

<div className="h-[90vh] font-urbanist flex items-center justify-center bg-[#a4dcaa]/75">
   
   <div className="w-full max-w-lg bg-[#a4dcaa] rounded-xl shadow-2xl shadow-black  border border-gray-200">
    
     <div className="text-center rounded-t-xl py-4 bg-black text-white">
       <h1 className="text-4xl font-extrabold ">Welcome Back!</h1>
       <p className="">Log in to your account and start exploring.</p>
     </div>

       <div className="flex items-center justify-center ">
         <div className="w-full max-w-md py-10 px-4 rounded-lg">
         
           <Formik
             initialValues={{ email: "", password: "", remember: false }}
             validationSchema={signinSchema}
             onSubmit={handleSubmit}
           >
             {({ isSubmitting }) => (
               <Form>
                 <div>
                   <label
                     htmlFor="email"
                     className="block text-sm font-medium text-gray-700 mb-2"
                   >
                     Email Address
                   </label>
                   <Field
                     type="email"
                     id="email"
                     name="email"
                     placeholder="Enter your email"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#53ca61] focus:outline-none transition duration-200"
                   />
                   <ErrorMessage
                     name="email"
                     component="div"
                     className="text-red-500 text-sm mt-1"
                   />
                 </div>

                 <div className="mt-4">
                   <label
                     htmlFor="password"
                     className="block text-sm font-medium text-gray-700 mb-2"
                   >
                     Password
                   </label>
                   <Field
                     type="password"
                     id="password"
                     name="password"
                     placeholder="Enter your password"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#53ca61] focus:outline-none transition duration-200"
                   />
                   <ErrorMessage
                     name="password"
                     component="div"
                     className="text-red-500 text-sm mt-1"
                   />
                 </div>

                 <div className="mt-4 flex items-center gap-x-2">
                   <Field
                     type="checkbox"
                     id="remember"
                     name="remember"
                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                   />
                   <label
                     htmlFor="remember"
                     className="text-sm font-medium text-gray-700"
                   >
                     Remember Me
                   </label>
                 </div>

                 <div className="mt-6">
                   <button
                     type="submit"
                     className="w-full px-4 py-3 flex justify-center bg-black text-white rounded-lg shadow-sm hover:bg-black/90 focus:ring-2 focus:ring-black focus:outline-none transition duration-200"
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? <Buttonloader /> : "Login"}
                   </button>
                 </div>
               </Form>
             )}
           </Formik>
           <div className="text-center py-2">
             <p className="text-sm text-gray-600">
               Don't have an account?{" "}
               <NavLink
                 to="/signup"
                 className="text-black font-semibold hover:underline"
                 title="Create your free Global Tuition account"
                 aria-label="Create your free Global Tuition account"
               >
                 Sign up for free
               </NavLink>
             </p>
           </div>
         </div>
       </div>

     </div>
   
 </div>
    </>
  );
};

export default Signin;
