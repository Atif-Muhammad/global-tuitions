import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./Pages/Footer/Footer";
import Loader from "./Pages/Loader/Loader";
import { Layout } from "./Pages/Layout";
import ScrollToTop from "./Pages/ScrollTop";
import NotfoundPage from "./Pages/404Page/NotfoundPage";

// userprofile components
import ProfileLayout from "./Pages/userProfile/Profile";
import Home from "./Pages/userProfile/home/Home";
import Courses from "./Pages/userProfile/courses/Courses";
import Feedback from "./Pages/userProfile/courses/Feedback";

import Course_inquery from "./Pages/userProfile/messeges/Course_inquery";
import General_inquery from "./Pages/userProfile/messeges/General_inquery";
import { UserLogOut } from "./Pages/userProfile/userLogOut/UserLogOut";
import Header from "./Pages/Header/Header";
import State from "./Context/State";
import Settings from "./Pages/userProfile/settings/Settings";
import Offers from "./Pages/offers/Offers";
import { HelmetProvider } from "react-helmet-async";
// Lazy-loaded components
import Index from "./Pages/Index";
import CoursesPage from "./Pages/CoursesPage/CoursesPage";
import Course_detail from "./Pages/CoursesPage/Course_detail";
import Inquiry from "./Components/Inquiry";
import FreeCoursesBanner from "./Pages/FreeCourses/FreeCoursesBanner";
import Signin from "./Pages/Authentication/Signin";
import Signup from "./Pages/Authentication/Signup";
import Enrollment from "./Components/Enrollment";

function App() {
  return (
    <div className="">
      <HelmetProvider>
        <State>
          <BrowserRouter>
            <ScrollToTop />
            <Header />
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotfoundPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/Course_detail/:id" element={<Course_detail />} />
                  <Route path="/inquiry" element={<Inquiry />} />
                  <Route path="/freeCourses" element={<FreeCoursesBanner />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/avail" element={<Enrollment />} />
                </Route>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />

                {/* /* User Profile Section with Sidebar */}
                <Route path="/profile/*" element={<ProfileLayout />}>
                  {/* Redirect from `/profile` to `/profile/homeuser` */}
                  <Route index element={<Navigate to="homeuser" replace />} />
                  <Route path="homeuser" element={<Home />} />
                  <Route path="coursesuser" element={<Courses />} />

                  <Route path="course_inquery" element={<Course_inquery />} />
                  <Route path="general_inquery" element={<General_inquery />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
            <Footer />
          </BrowserRouter>
        </State>
      </HelmetProvider>
    </div>
  );
}

export default App;
