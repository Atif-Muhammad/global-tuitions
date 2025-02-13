import React, { useState, useEffect } from "react";
import findcoursesImg from "../../assets/images/findcourses-img.png";
import SignatureImg from "../../assets/images/Signature.jpg";
import { NavLink, useLocation } from "react-router-dom";
import Config from "../../../Config/Config";

const FindFreeCoursesandDiscountsoffer = () => {
  const [offers, setOffers] = useState([]);
  const [freeCourses, setfreeCourses] = useState([]);

  const currentpath = useLocation();

  const getOffers = () => {
    Config.getOffers()
      .then((res) => {
        if (res.status === 200) {
          setOffers(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const normalizeDate = (date) => {
    const d = new Date(date);
    // Normalize the date to UTC (without time zone bias) and set the time to midnight UTC
    const utcDate = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    return utcDate;
  };
  useEffect(() => {
    Config.get_enabled_courses()
      .then((res) => {
        // console.log("::::",res);
        const today = new Date();
        const normalizedToday = normalizeDate(today);

        const freeCourses = res.filter(
          (course) =>
            course.category_id?.category_name === "Free Courses" &&
            course.deleted === false &&
            normalizeDate(course?.date) >= normalizedToday
        );
        setfreeCourses(freeCourses);
        console.log("dedwe", freeCourses);
      })
      .catch((err) => {
        console.error("Error fetching free courses:", err);
      });
    getOffers();
  }, []);

  return (
    <>
      {(offers.length > 0 || freeCourses.length > 0) && (
        <div>
          {/* <!-- find courses section  --> */}
          <div className="find-main">
            <div className="find-main2">
              <div className="find-img-div">
                <img
                  src={findcoursesImg}
                  alt="Banner Image"
                  className="find-img"
                />
              </div>

              <div className="md:w-1/2 w-full px-2 flex items-center">
                <div className="find-div-2-main">
                  <div className="find-div-heading">
                    <p className="find-div-p">
                      Find{" "}
                      <span className="find-heading-span1">
                        Free
                        <img
                          src={SignatureImg}
                          alt=""
                          className="find-heading-img1"
                        />
                      </span>
                      <span className="find-heading-span2">
                        Courses and Discount{" "}
                        <span className="find-heading-span3">
                          offers
                          <img
                            src={SignatureImg}
                            alt=""
                            className="find-heading-img2"
                          />
                        </span>
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="find-paragraph">
                      Explore a world of free and discounted learning
                      opportunities. Scroll through our diverse range of free
                      training, courses, workshops, and tuition options designed
                      to help you grow your skills without breaking the bank.
                      Start your learning voyage today!
                    </p>
                  </div>

                  <div className="find-buttons-div font-urbanist">
                    {currentpath.pathname === "/freeCourses" &&
                      offers.length > 0 && (
                        <NavLink to="/offers" className="btnbutton">
                          View Offers
                        </NavLink>
                      )}
                    {currentpath.pathname === "/offers" &&
                      freeCourses.length > 0 && (
                        <NavLink to="/freeCourses" className="btnbutton">
                          Free Courses
                        </NavLink>
                      )}
                    {currentpath.pathname !== "/freeCourses" &&
                      currentpath.pathname !== "/offers" && (
                        <>
                          {offers.length > 0 && (
                            <NavLink to="/offers" className="btnbutton">
                              View Offers
                            </NavLink>
                          )}
                          {freeCourses.length > 0 && (
                            <NavLink to="/freeCourses" className="btnbutton">
                              Free Courses
                            </NavLink>
                          )}
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FindFreeCoursesandDiscountsoffer;
