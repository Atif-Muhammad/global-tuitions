import React, { useEffect, useState } from "react";
import { FaChartBar, FaBook, FaUserGraduate, FaInbox } from "react-icons/fa";
import Config from '../../../config/Config'

const AdminDashboard = () => {

  const [details, setDetails] = useState({
    enrollments : null,
    courses : null,
    categories : null,
    course_inquiries : null,
    general_inquiries : null,

  })

  useEffect(()=>{
    Config.dashboard().then((res)=>{
      setDetails({
        enrollments: res.data.enroll_count,
        courses: res.data.course_count,
        categories: res.data.category_count,    
        course_inquiries :  res.data.course_inquiries,
        general_inquiries :  res.data.general_inquiries,  
      })
    }).catch((err)=>{
      console.log(err)
    })
  }, [])



  return (
    <div className="min-h-screen w-full bg-gray-900/90 text-white flex">
     
      {/* Main Content */}
      <div className="flex-1 p-6 w-full">
        {/* Overview Section */}
        <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-4 shadow-lg rounded-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <h3 className="text-gray-300 font-semibold">Total Enrollments</h3>
            <p className="text-3xl font-bold">{details.enrollments}</p>
          </div>
          <div className="bg-gray-800 p-4 shadow-lg rounded-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <h3 className="text-gray-300 font-semibold">Active Courses</h3>
            <p className="text-3xl font-bold">{details.courses}</p>
          </div>
          <div className="bg-gray-800 p-4 shadow-lg rounded-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <h3 className="text-gray-300 font-semibold">Total Categories</h3>
            <p className="text-3xl font-bold">{details.categories}</p>
          </div>
          <div className="bg-gray-800 p-4 shadow-lg rounded-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <h3 className="text-gray-300 font-semibold">Inquiries</h3>
            <div className=" flex justify-center gap-x-5 py-2 items-end">
              <p className="text-sm text-center ">
                <p>Course Iquiries</p>
                <p className="text-lg">{details.course_inquiries}</p>
              </p>
              <p className="text-sm text-center">
                <p>General Iquiries</p>
                <p className="text-lg">{details.general_inquiries}</p>
              </p>
            </div>
            <p className="text-3xl font-bold">{details.inquiries}</p>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
          <div className="bg-gray-800 p-6 shadow-lg rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-3 text-gray-300">Activity</th>
                  <th className="p-3 text-gray-300">Date</th>
                  <th className="p-3 text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-700 transition">
                  <td className="p-3">New Enrollment in React Course</td>
                  <td className="p-3">Jan 2, 2025</td>
                  <td className="p-3 text-green-400">Completed</td>
                </tr>
                <tr className="hover:bg-gray-700 transition">
                  <td className="p-3">New Inquiry: How to join?</td>
                  <td className="p-3">Jan 1, 2025</td>
                  <td className="p-3 text-yellow-400">Pending</td>
                </tr>
                <tr className="hover:bg-gray-700 transition">
                  <td className="p-3">Category Updated: Programming</td>
                  <td className="p-3">Dec 30, 2024</td>
                  <td className="p-3 text-blue-400">Updated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
