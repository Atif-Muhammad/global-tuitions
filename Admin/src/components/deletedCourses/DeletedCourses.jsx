import React, { useEffect, useState } from "react";
// import Coursesdetail from "./Coursesdetail";
import axios from "axios";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
// import AddCourses from "./AddCourses";
import API_URLS from "../../../config/Config";
import Config from "../../../config/Config";
import JoditEditor from "jodit-react";
import editorConfig from "../EditorConfig";
import { toast, ToastContainer } from "react-toastify"; 

const DeletedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpenforNewCourse, setIsModalOpenforNewCourse] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCourse, setEditCourse] = useState({});
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState();
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inquiry, setInquiry] = useState([]);
  const [inqModel, setInquiryModel] = useState(false);
  const [inquires, setInquiries] = useState([]);
  const [enrollments, setEnrollments] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [msg, setmsg] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message

  const getCourseInqs = async () => {
    Config.courseInq().then((res)=>{ 
      setInquiries(res);
    }).catch((err)=>{
      console.log(err)
    })
  };

  const getEnrollments = async ()=>{
    Config.getEnrollments().then((res)=>{
      console.log(res)
      setEnrollments(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
    setCourseDetails(null);
    setIsModalOpen(false);
  };

  const handleView = async (inq) => {
    // console.log("Selected Inquiry:", inq);
    setSelectedRow(inq); // Set the selected row
    setShowModal(true); // Open the modal

    // Debug logs
    // console.log("SelectedRow after set:", inq);
    // console.log("showModal State:", showModal);
    Config.inqView(inq._id).then((res)=>{
      console.log(res)
      // render toast
    }).catch((err)=>{
      console.log(err)
    })

  };

  const handleReplyFlag = async (inq) => {
    const payload = {
      msg,
      inq,
    };
    Config.inqReply(payload).then((res)=>{
      // render toast
    }).catch((err)=>{
      console.log(err)
    })
  
  };

  const openinModel = async (course) => {
    // get course inquiries
    Config.getCourseInqs(course._id)
      .then((res) => {
        setInquiry(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setInquiryModel(true);
  };

  const openModal = (course) => {
    setCourseDetails(course); // Pass course data to Coursesdetail
    setIsModalOpen(true);
  };

  //this API USING for delete course
  const handleDelete = async (id) => {
    
    Config.delCourse(id)
      .then((res) => {
        // Remove the deleted course from the state
        toast.success("Deleted Permanantly.")
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //this API USING for Popular course
  const handlePopular = async (course) => {
    Config.setPopular(course._id)
      .then((res) => {
        setCourses((prevCourses) =>
          prevCourses.map((item) =>
            item._id === course._id ? { ...item, popular: !item.popular } : item
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get all categories
  const all_categories = async () => {
    Config.getAllCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
  // get courses details
  const getDeletedCourses = async () => {
    Config.getDeletedCourses()
      .then((res) => {
        setCourses(res)
        // Extract unique categories
        const categories = res.map((course) => course.category_id);
        const uniqueCategories = categories.filter(
          (category, index, self) =>
            index === self.findIndex((cat) => cat._id === category._id)
        );
        setUniqueCategories(uniqueCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModalfornewCourse = () => {
    setIsModalOpenforNewCourse(true);
  };

  const closeModalfornewCourse = () => {
    setIsModalOpenforNewCourse(false);
  };

  // Updated openModalDelete function to accept the category
  const openModalDelete = (course) => {
    setSelectedCourse(course); // Set the selected category to delete
    setIsModalDelete(true); // Open the delete modal
  };

  const closeModalDelete = () => {
    setIsModalDelete(false);
    setSelectedCategory(null); // Clear the selected category after closing the modal
  };
  const confirmDelete = (id) => {
      handleDelete(id);
      closeModalDelete();
    
  };

  const openEditModal = (course) => {
    setEditCourse(course);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCourse({});
    setInquiryModel(false);
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target; // This works for normal form elements.
    setEditCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setEditCourse((prev) => ({
      ...prev,
      course_description: value, // Update this with the correct key for ReactQuill.
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    Config.updateCourse(editCourse)
      .then((res) => {
        // console.log(res)
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editCourse._id
              ? { ...course, ...editCourse }
              : course
          )
        );
        getDeletedCourses();
        closeEditModal(); // Close the edit modal
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const fetchData = ()=>{
    getDeletedCourses();
    all_categories();
    getCourseInqs();
    getEnrollments()
  }

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRecovery = (id)=>{
    Config.recoverCourse(id).then((res)=>{
      toast.success("Course Recovered.")
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }


  return (
    <>
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
      <div className="md:w-[80%] w-11/12  bg-black/80 ">
        <div className="font-poppins px-4 sticky top-0 bg-gray-800 z-30 py-7 flex justify-between font-bold   text-white ">
          <p className="text-4xl ml-5 font-urbanist">Deleted Courses</p>
        </div>
        <form>
          <div className="pb-5 w-full">
            {courses.length > 0 ? (
              <table className="w-full border-collapse  bg-black/90 border border-white">
                <thead className="sticky top-24 z-20 bg-black">
                  <tr className="text-white w-full text-[18px]">
                    <th className="border border-white px-1.6 py-2 ">Name</th>
                    {/* <th className="border border-white px-1.6 py-2 hidden md:table-cell ">
                      Description
                    </th> */}
                    <th className="border border-white px-1.6 py-2 hidden md:table-cell ">
                      Category
                    </th>
                    <th className="border border-white px-1.6 py-2 hidden md:table-cell ">
                      Level
                    </th>
                    <th className="border border-white px-1.6 py-2 ">
                      Sort Value
                    </th>
                    <th className="border border-white px-1.6 py-2 ">
                      duration
                    </th>
                    <th className="border border-white px-1.6 py-2 ">Price</th>

                    <th className="border border-white px-1.6 py-2 ">
                      Enabled
                    </th>
                    <th className="border border-white px-1.6 py-2 ">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr className="text-white font-poppins w-full " key={index}>
                      <td className="border border-white w-[15%] px-1.5 py-4  text-xs md:text-sm">
                        {course?.course_name}
                      </td>
                      {/* <td
                        className="border border-white w-[20%]  px-5 py-4 text-[13px] hidden md:table-cell"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            course?.course_description
                          ),
                        }}
                      ></td> */}

                      <td className="border text-center border-white px-1.5 py-4 w-[15%]  text-[16px]">
                        {course?.category_id?.category_name
                          ? course?.category_id?.category_name
                          : "Unknown Category"}
                      </td>
                      <td className="border text-center border-white px-1.5 w-[10%] py-4 text-[16px]">
                        {course?.course_level}
                      </td>
                      <td className="border text-center border-white px-1.5 w-[10%] py-4 text-[16px]">
                        {course?.sort_value}
                      </td>
                      <td className="border text-center border-white px-1.5 w-[10%] py-4 text-[16px]">
                        {course?.course_duration}
                      </td>
                      <td className="border text-center border-white w-[10%] px-1.5 py-4 text-[16px]">
                        {course?.price}
                        <span>£</span>
                      </td>

                      <td className="border text-center border-white w-[10%] px-1.5 py-4 text-[16px]">
                        <input
                          type="checkbox"
                          checked={course?.enabled_flag}
                          readOnly
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-not-allowed"
                        />
                        {course?.enabled_flag ? " Enabled" : null}
                      </td>

                      <td className="px-1.5  py-2  border  ">
                        <div className=" flex justify-center items-center gap-4 ">
                          {/* <button
                            type="button"
                            className="relative bg-blue-500/70 hover:bg-blue-700 text-white py-1 px-2 rounded text-[20px] group"
                            onClick={() => openModal(course && course)} // Pass course data here
                          >
                            <FaEye className="size-5" />
                            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Course Detail
                            </span>
                          </button> */}

                          <button
                            type="button"
                            className="relative bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded group"
                            onClick={() => openModalDelete(course)}
                          >
                            <MdDelete className="size-5" />
                            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Delete
                            </span>
                          </button>
                          <button
                            type="button"
                            className="relative bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded group"
                            // onClick={() => openModalDelete(course)}
                            onClick={() => handleRecovery(course._id)}
                          >
                            {/* <MdDelete className="size-5" /> */}
                            Recover
                            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Recover
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-2xl text-gray-300 mt-8">
                No deleted Courses available.
              </div>
            )}
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {isModalDelete && selectedCourse && (
          <div className="fixed inset-0 font-urbanist flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6 text-[20px] ">
                Are you sure you want to delete the category "
                <span className="font-semibold">
                  {selectedCourse.course_name}
                </span>
                "?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={closeModalDelete}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => confirmDelete(selectedCourse._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Courses Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 font-urbanist flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[90%] lg:w-1/2 p-6 relative overflow-y-auto max-h-[90vh]">
              {/* Close Icon */}
              <button
                onClick={closeEditModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-4xl underline text-center font-bold mb-4">
                Edit Course
              </h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-[20px] font-semibold mb-2 text-gray-800 "
                    htmlFor="name"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    value={editCourse.course_name || ""}
                    onChange={handleEditChange}
                    required
                    className="border rounded-lg text-[16px] w-full px-3 py-3"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-[20px] font-semibold mb-2 text-gray-800 "
                    htmlFor="description"
                  >
                    Description:
                  </label>

                  <JoditEditor
                    config={editorConfig}
                    value={editCourse.course_description || ""}
                    onBlur={handleQuillChange} // Use the specific handler for ReactQuill
                  />
                </div>

                <div className="flex w-full  gap-5">
                  <div className="mb-4 w-1/2">
                    <label
                      className="block text-[20px] font-semibold mb-2 text-gray-800 "
                      htmlFor="category"
                    >
                      Category:
                    </label>
                    <select
                      name="category_id"
                      value={editCourse.category_id || ""} // Ensure the value is set to the current category ID
                      className="border rounded-lg w-full px-3 py-2"
                      onChange={handleEditChange}
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category?._id} value={category?._id}>
                          {category?.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 w-1/2">
                    <label
                      className="block text-[20px] font-semibold mb-2 text-gray-800 "
                      htmlFor="level"
                    >
                      Level:
                    </label>
                    <select
                      name="course_level"
                      value={editCourse.course_level || ""}
                      onChange={handleEditChange}
                      required
                      className="border rounded-lg w-full px-3 py-2"
                    >
                      <option value="" disabled>
                        Select a level
                      </option>
                      <option value="Beginner Level">Beginner Level</option>
                      <option value="Intermediate Level">
                        Intermediate Level
                      </option>
                      <option value="Advance Level">Advance Level</option>
                    </select>
                  </div>
                </div>

                <div className="flex  items-end w-full gap-5 ">
                  <div className="  w-1/3 ">
                    <label
                      htmlFor="category-sort"
                      className="block text-[20px] font-semibold mb-2 text-gray-800 "
                    >
                      Sort by:
                    </label>
                    <input
                      type="number"
                      name="sort_value"
                      value={editCourse.sort_value || ""}
                      onChange={handleEditChange}
                      required
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px]"
                    />
                  </div>
                  <div className="  w-1/3 ">
                    <label
                      htmlFor="category-price"
                      className="block text-[20px] font-semibold mb-2 text-gray-800 "
                    >
                      Price:
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editCourse.price || ""}
                      onChange={handleEditChange}
                      required
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px] "
                    />
                  </div>
                  <div className="flex items-center w-1/3 space-x-2">
                    <label
                      htmlFor="category-enable"
                      className="block text-[20px] font-semibold mb-2 text-gray-800 "
                    >
                      Enable:
                    </label>
                    <input
                      id="category-enable"
                      type="checkbox"
                      name="enabled_flag"
                      checked={editCourse.enabled_flag || false}
                      onChange={(e) => {
                        setEditCourse((prev) => ({
                          ...prev,
                          enabled_flag: e.target.checked,
                        }));
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-5 gap-4">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* course inquiries */}
        <div>
          {inqModel && (
            <div className="md:w-[80%]  z-40   backdrop-blur-md w-11/12 bg-[#00000031] absolute top-[10%] text-white font-urbanist">
              <div className="  w-full px-4 text-center sticky top-0 bg-gray-800 z-50 py-4  flex justify-between    text-white ">
                <h2 className="text-5xl  text-center font-urbanist py-4">
                  {inquiry?.for_course?.course_name} Inquiries
                </h2>
                {/* Close Icon */}
                <button
                  onClick={closeEditModal}
                  className="absolute z-40 top-8 right-7 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-6 rounded shadow-lg">
                  {successMessage}
                </div>
              )}

              {/* Render inquiries or "No inquiries" message */}
              <div className="sticky top-24 z-40 bg-black/90">
                {console.log(inquiry)}
                {inquiry?.length === 0 ? (
                  <div className="text-center text-xl text-gray-400 py-6">
                    No inquiries in this course
                  </div>
                ) : (
                  <div className="overflow-y-auto h-[70vh] border border-gray-600 rounded-lg">
                    <table className="min-w-full bg-black border-collapse">
                      <thead className="bg-black sticky top-0 z-10">
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            Username
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            Email
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            Message
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            For Course
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            Replied
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            Viewed
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiry?.map((inq) => (
                          <tr
                            key={inq._id}
                            className="border-b text-[16px] border-gray-700"
                          >
                            <td className="px-4 py-4 w-[13%] text-gray-300">
                              {inq.inquiry_by}
                            </td>
                            <td className="px-4 py-4 w-[30%] text-gray-300">
                              {inq.email}
                            </td>
                            <td className="px-4 py-4 w-[30%] text-gray-300">
                              {inq.inquiry}
                            </td>
                            <td className="px-4 w-[10%] py-4 text-gray-300">
                              {inq?.for_course?.course_name}
                            </td>
                            <td
                              className={`px-2 w-[10%] py-4 ${
                                inq.replied_flag
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {inq.replied_flag ? "Replied" : "Pending"}
                            </td>
                            <td
                              className={`px-2 w-[10%] py-4 ${
                                inq.viewed_flag
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {inq.viewed_flag ? "Viewed" : "Pending"}
                            </td>
                            <td className="px-4 w-[10%] py-4">
                              <button
                                onClick={() => handleView(inq)}
                                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {showModal && selectedRow && (
                <div className=" inset-0 w-full bg-black/70 absolute  flex items-center justify-center  z-50">
                  <div className="bg-white text-black p-6 rounded-md w-11/12 md:w-1/2 relative">
                    <button
                      className="absolute top-4 text-[22px] right-4 text-gray-500 hover:text-black"
                      onClick={closeModal}
                    >
                      <RxCrossCircled />
                    </button>
                    <h3 className="text-4xl text-center font-semibold mb-4">
                      Inquiry Details
                    </h3>
                    <p>
                      <strong className="text-[22px] font-bold text-black">
                        Inquiry By:{" "}
                      </strong>
                      <span className="text-[20px]">
                        {selectedRow.inquiry_by}
                      </span>
                    </p>
                    <p>
                      <strong className="text-[22px] font-bold text-black">
                        Email:{" "}
                      </strong>
                      <span className="text-[20px]">{selectedRow.email}</span>
                    </p>
                    <p>
                      <p className="text-[22px] font-bold text-black">
                        Message:
                      </p>
                      <span className="text-[20px]">{selectedRow.inquiry}</span>
                    </p>
                    <p>
                      <strong className="text-[22px] font-bold text-black">
                        Replied Flag:{" "}
                      </strong>
                      <span className="text-[20px]">
                        {selectedRow.replied_flag ? "True" : "False"}
                      </span>
                    </p>
                    <div className="pt-8">
                      <h5 className="text-gray-800 text-[20px] font-bold">
                        Reply to "{selectedRow.email}"
                      </h5>
                      <textarea
                        onChange={(e) => setmsg(e.target.value)}
                        rows="6"
                        className="w-full rounded-lg resize-none border border-gray-300 p-2"
                      ></textarea>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={async () => {
                          await handleReplyFlag(selectedRow); // Perform the reply logic
                          closeModal(); // Close the modal
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Reply
                      </button>

                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isModalOpen && (
          <Coursesdetail
            isOpen={isModalOpen}
            onClose={closeModal}
            data={courseDetails} // Pass course data to the modal
          />
        )}
      </div>

      {/* AddCourse Modal */}
      {/* {isModalOpenforNewCourse && (
        <AddCourses closeModal={closeModalfornewCourse} />
      )} */}
    </>
  );
};

export default DeletedCourses;
