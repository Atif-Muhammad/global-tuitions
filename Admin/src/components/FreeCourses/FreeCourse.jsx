import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import AddCourses from "./AddFreeCourses";
import Config from "../../../config/Config";
import JoditEditor from "jodit-react";
import editorConfig from "../EditorConfig";
import FreeCoursesdetail from "./FreeCoursesdetail";
import { RxCross1 } from "react-icons/rx";
import FreeCourseEnrollment from "./FreeCourseEnrollment";
import FreeCourseInquiry from "./FreeCourseInquery";
import { toast, ToastContainer } from "react-toastify";

const FreeCourse = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpenforNewCourse, setIsModalOpenforNewCourse] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCourse, setEditCourse] = useState({});
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState();
  const [inqModel, setInquiryModel] = useState(false);
  const [inquires, setInquiries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] =
    useState(null);

  const [isInqueryModalOpen, setIsInqueryModalOpen] = useState(false);
  const [selectedCourseForInquery, setSelectedCourseForInquery] =
    useState(null);

  const openEnrollmentModal = (course) => {
    setSelectedCourseForEnrollment(course);
    setIsEnrollmentModalOpen(true);
  };

  const getEnrollments = async () => {
    Config.getEnrollments()
      .then((res) => {
        setEnrollments(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeEnrollmentModal = () => {
    setSelectedCourseForEnrollment(null);
    setIsEnrollmentModalOpen(false);
  };

  const openInqueryModal = (course) => {
    setSelectedCourseForInquery(course);
    setIsInqueryModalOpen(true);
  };

  const closeInqueryModal = () => {
    setSelectedCourseForInquery(null);
    setIsInqueryModalOpen(false);
  };

  const getCourseInqs = async () => {
    Config.courseInq()
      .then((res) => {
        setInquiries(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
    setCourseDetails(null);
    setIsModalOpen(false);
  };

  const openModal = (course) => {
    setCourseDetails(course); // Pass course data to Coursesdetail
    setIsModalOpen(true);
  };

  //this API USING for delete course
  const handleDelete = async (id) => {
    Config.RemoveCourse(id)
      .then((res) => {
        // Remove the deleted course from the state
        toast.success("Course Deleted");
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData = () => {
    all_courses();
    getCourseInqs();
    getEnrollments();
  };

  useEffect(() => {
    fetchData;
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // get courses details
  const all_courses = async () => {
    Config.getAllCourses()
      .then((res) => {
        const data = res.filter((item) => {
          return item.category_id?.category_name === "Free Courses";
        });
        setCourses(data);
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

  const confirmDelete = () => {
    if (selectedCourse) {
      handleDelete(selectedCourse._id);
      closeModalDelete();
    }
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
        toast.success("Updated Successfully.");
        // console.log(res)
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editCourse._id
              ? { ...course, ...editCourse }
              : course
          )
        );
        all_courses();
        closeEditModal(); // Close the edit modal
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const convertToInputTime = (isoTime) => {
    if (!isoTime) return ""; // Handle cases where time is undefined

    const [hours, minutes] = isoTime.split(":").map(Number);

    // Get the local date and set the correct time
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set the hours and minutes to the date

    // Return the time in HH:mm format for the input field
    const localHours = String(date.getHours()).padStart(2, "0");
    const localMinutes = String(date.getMinutes()).padStart(2, "0");

    return `${localHours}:${localMinutes}`;
  };

  const convertToInputDate = (isoDate) => {
    if (!isoDate) return "";

    // Create a Date object using the ISO date string.
    const date = new Date(isoDate);

    // Use getUTC methods to extract the date in UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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

      <div className="w-full bg-black/80 ">
        <div className="font-poppins px-4 sticky top-0 bg-gray-800 z-30 py-7 flex justify-between font-bold   text-white ">
          <p className="text-4xl ml-5 font-urbanist">Free Courses</p>
          <button
            onClick={openModalfornewCourse}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
              dark:focus:ring-blue-800"
            type="button"
          >
            {" "}
            Add new Course{" "}
          </button>
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
                      Level
                    </th>
                    <th className="border border-white px-1.6 py-2 ">
                      Sort Value
                    </th>
                    <th className="border border-white px-1.6 py-2 ">
                      duration
                    </th>
                    <th className="border border-white px-1.6 py-2 ">Time</th>
                    <th className="border border-white px-1.6 py-2 ">Date</th>
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

                      <td className="border text-center border-white px-1.5 w-[8%] py-4 text-[16px]">
                        {course?.course_level}
                      </td>
                      <td className="border text-center border-white px-1.5 w-[8%] py-4 text-[16px]">
                        {course?.sort_value}
                      </td>
                      <td className="border text-center border-white px-1.5 w-[8%] py-4 text-[16px]">
                        {course?.course_duration}
                      </td>
                      <td className="border text-center border-white w-[8%] px-1.5 py-4 text-[16px]">
                        {new Date(
                          `1970-01-01T${course?.time}:00`
                        ).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>

                      <td className="border text-center border-white w-[8%] px-1.5 py-4 text-[16px]">
                        {new Date(course?.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          month: "long", // Full month name (e.g., "June")
                          day: "numeric", // Numeric day (e.g., "3")
                          year: "numeric", // Full year (e.g., "2024")
                        })}
                      </td>

                      <td className="border text-center border-white w-[8%] px-1.5 py-4 text-[16px]">
                        <input
                          type="checkbox"
                          checked={course?.enabled_flag}
                          readOnly
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-not-allowed"
                        />
                        {course?.enabled_flag ? " Enabled" : null}
                      </td>
                      <td className="px-1.5 py-2  w-[17%] border  ">
                        <div className=" flex gap-2 ">
                          <button
                            type="button"
                            className="relative bg-blue-500 text-[#fff] py-1 px-2 rounded text-[20px] group"
                            onClick={() => openEditModal(course)}
                          >
                            <CiEdit />
                            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Edit
                            </span>
                          </button>
                          <button
                            type="button"
                            className="relative bg-blue-500/70 hover:bg-blue-700 text-white py-1 px-2 rounded text-[20px] group"
                            onClick={() => openModal(course && course)} // Pass course data here
                          >
                            <FaEye className="size-5" />
                            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Course Detail
                            </span>
                          </button>
                          <div className="flex items-center justify-center relative">
                            <button
                              type="button"
                              className="bg-blue-500/70 hover:bg-blue-700 text-white py-1 px-2 rounded text-[16px] group"
                              onClick={() => openEnrollmentModal(course)}
                            >
                              Enrollments
                            </button>
                            {enrollments.filter(
                              (inq) =>
                                inq?.viewed_flag === false &&
                                inq?.for_course?._id === course._id
                            ).length > 0 && (
                              <div className="bg-yellow-400 absolute top-0 right-0 text-slate-900 font-semibold select-none rounded-full h-[1.2rem] w-[1.2rem] text-xs grid place-items-center translate-x-1/2 -translate-y-1/2">
                                {
                                  enrollments.filter(
                                    (inq) =>
                                      inq?.viewed_flag === false &&
                                      inq?.for_course?._id === course._id
                                  ).length
                                }
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-center relative">
                            <button
                              type="button"
                              className="bg-blue-500/70 hover:bg-blue-700 text-white py-1 px-2 rounded text-[16px] group"
                              onClick={() => openInqueryModal(course)}
                            >
                              Inquiries
                            </button>
                            {inquires.filter(
                              (inq) =>
                                inq?.viewed_flag === false &&
                                inq?.for_course?._id === course._id
                            ).length > 0 && (
                              <div className="bg-yellow-400 absolute top-0 right-0 text-slate-900 font-semibold select-none rounded-full h-[1.2rem] w-[1.2rem] text-xs grid place-items-center translate-x-1/2 -translate-y-1/2">
                                {
                                  inquires.filter(
                                    (inq) =>
                                      inq?.viewed_flag === false &&
                                      inq?.for_course?._id === course._id
                                  ).length
                                }
                              </div>
                            )}
                          </div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-2xl text-gray-400 mt-8">
                No free Courses available.
              </div>
            )}
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {isModalDelete && selectedCourse && (
          <div className="fixed inset-0 font-urbanist flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
              <h2 className="text-2xl font-bold mb-4">Move to Recycle Bin?</h2>
              <p className="mb-6 text-[20px] ">
                Are you sure you want to Remove the category "
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
                  onClick={confirmDelete}
                >
                  Move to Recycle bin
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
                <RxCross1 />
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

                <div className="flex w-full gap-5">
                  <div className="w-1/2">
                    <label
                      htmlFor="category-sort"
                      className="block text-[20px] font-semibold mb-2 text-gray-800"
                    >
                      Time:
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={convertToInputTime(editCourse?.time) || ""}
                      onChange={handleEditChange}
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px]"
                    />
                  </div>
                  <div className="mb-4 w-1/2">
                    <label
                      className="block text-[20px] font-semibold mb-2 text-gray-800"
                      htmlFor="level"
                    >
                      Date:
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={convertToInputDate(editCourse?.date) || ""}
                      onChange={handleEditChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px]"
                    />
                  </div>
                </div>

                <div className="flex w-full  gap-5">
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
                      <option value="Beginner">Beginner Level</option>
                      <option value="Intermediate">Intermediate Level</option>
                      <option value="Advance">Advance Level</option>
                    </select>
                  </div>
                  <div className="  w-1/2 ">
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
                </div>

                <div className="flex  items-end w-full gap-5 ">
                  <div className="  w-1/2 ">
                    <label
                      htmlFor="category-price"
                      className="block text-[20px] font-semibold mb-2 text-gray-800 "
                    >
                      Duration:
                    </label>
                    <input
                      type="number"
                      name="course_duration"
                      value={editCourse.course_duration || ""}
                      onChange={handleEditChange}
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px] "
                    />
                  </div>
                  <div className="flex items-center w-1/2 space-x-2">
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

        {isModalOpen && (
          <FreeCoursesdetail
            isOpen={isModalOpen}
            onClose={closeModal}
            data={courseDetails} // Pass course data to the modal
          />
        )}
      </div>

      {/* AddCourse Modal */}
      {isModalOpenforNewCourse && (
        <AddCourses closeModal={closeModalfornewCourse} />
      )}

      {isEnrollmentModalOpen && (
        <FreeCourseEnrollment
          course={selectedCourseForEnrollment}
          onClose={closeEnrollmentModal}
        />
      )}

      {isInqueryModalOpen && (
        <FreeCourseInquiry
          data={selectedCourseForInquery}
          onClose={closeInqueryModal}
        />
      )}
    </>
  );
};

export default FreeCourse;
