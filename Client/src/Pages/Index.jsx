import React from "react";
import Banner from "./banner/Banner";
import Whatweoffers from "./offers/whatweoffers";
import Courses from "./CoursesComponents/Courses";
import PopularCourses from "./CoursesComponents/PopularCourses";
import { Helmet } from "react-helmet-async";
const Index = () => {
  return (
    <div>
      <Helmet>
        <title>Best Online Tuition in Europe | Global Tuition</title>
        <meta
          name="description"
          content="Join Global Tuition for expert online classes in Europe. Explore free and paid courses with top tutors. Learn from anywhere!"
        />
        <meta
          name="keywords"
          content="online tuition, free courses, online tutors, European tuition, online learning"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.globaltuition.co.uk/" /> //my
        web link
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineCourseProvider",
            name: "Global Tuition",
            url: "https://www.globaltuition.co.uk",
            description:
              "Learn IT skills online with Global Tuition. Join expert-led courses and transform your future with in-demand IT training.",

            sameAs: [
              "https://www.facebook.com/globaltuition",
              "https://www.tiktok.com/globaltuition",
              "https://www.youtube.com/globaltuition",
            ],
          })}
        </script>
      </Helmet>
      <Banner />
      <Whatweoffers />
      <Courses />
      <PopularCourses />
    </div>
  );
};

export default Index;
