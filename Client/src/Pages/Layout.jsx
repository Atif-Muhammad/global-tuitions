import React from "react";
import { Outlet } from "react-router-dom";
import Subscribe from "./subscribe/Subscribe";
import FindFreeCoursesandDiscountsoffer from "./FreeCourses/FindFreeCoursesandDiscountsoffer";

export const Layout = () => {
  return (
    <>
      <Outlet />
      <FindFreeCoursesandDiscountsoffer />
      <Subscribe />
    </>
  );
};
