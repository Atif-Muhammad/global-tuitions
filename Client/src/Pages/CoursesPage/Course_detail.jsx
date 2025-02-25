import React from "react";
import Course_detail_banner from "../../Components/Course_detail_banner";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Course_detail = () => {
  const location = useLocation();
  const course = location.state;
  const id = useParams()
  // console.log("in banner:", course);
  return (
    <div>
      <Helmet>
        <meta
          name="description"
          content="Explore a variety of online courses offered by Global Tuition. Enhance your skills with quality online tuition across Europe."
        />
      </Helmet>

      <Course_detail_banner
        // course={course}
        id={id}
        // skills={course.skills}
      />
    </div>
  );
};

export default Course_detail;
