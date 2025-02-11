import axios from "axios";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import Config from "../../../config/Config";
import JoditEditor from "jodit-react";
import editorConfig from "../EditorConfig";
import { toast, ToastContainer } from "react-toastify"; 

const Coursesdetail = ({ isOpen, onClose, data }) => {
  const [courseData, setCourseData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [editContent, setEditContent] = useState({}); // Store editable content data
  const [editSection, setEditSection] = useState(""); // Track which section is being edite
  const [newcourse_include, setNewcourse_include] = useState(""); // For adding new course includes
  const [isAddIncludeInputVisible, setIsAddIncludeInputVisible] =
    useState(false); // For adding new course includes
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false); // Track add content modal visibility
  const [newContent, setNewContent] = useState({
    topic: "",
    content_description: "",
    duration: "",
    enabled_flag: false || true,
    sort_value: "",
  }); // Store new content data

  if (!isOpen) return null; // Don't render if modal is closed

  const handleEditIncludes = (index, inc) => {
    setEditSection("skills");
    setEditIndex(index);
    setEditContent({ skills: inc });
  };

  const handleEditContent = (index, content) => {
    setEditSection("course_contents");
    setEditIndex(index);
    setEditContent(content); // Set content for course content
  };

  const handleSaveClick = () => {
    if (editSection === "skills") {
      // Update the course includes array
      data.skills[editIndex] = editContent.skills;
    }
    if (editSection === "course_contents") {
      // Update the course contents array
      data.course_contents[editIndex] = {
        ...data.course_contents[editIndex],
        ...editContent,
      };
    }
    setEditIndex(null); // Exit edit mode
    setEditSection(""); // Reset the section edit state
  };

  const handleAddcourse_include = () => {
    if (newcourse_include.trim()) {
      data.skills.push(newcourse_include);
      setNewcourse_include("");
    }
  };
  const handleInputChange = (input, field) => {
    let value;

    // Check if input is an event or a direct value
    if (input?.target) {
      value = input.target.value; // Standard input event
    } else {
      value = input; // Direct value from ReactQuill or similar
    }

    // Convert specific fields to their expected types
    if (field === "enabled_flag") {
      value = value === "true"; // Convert to Boolean
    } else if (field === "sort_value") {
      value = parseInt(value, 10); // Convert to Number
      if (isNaN(value)) value = 0; // Fallback for invalid numbers
    }

    // Update the state
    setEditContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewContentChange = (value, field) => {
    setNewContent((prev) => ({
      ...prev,
      [field]: value, // Directly update the field with the value
    }));
  };

  const handleAddContent = () => {
    // Add new content to course_contents array
    data.course_contents.push(newContent);
    setIsAddContentModalOpen(false); // Close modal
    setNewContent({
      topic: "",
      content_description: "",
      duration: "",
      enabled_flag: false || true,
      sort_value: "",
    }); // Reset form
  };

  const handleChanges = async () => {
  
    Config.updateCourseDetails(courseData)
      .then(async (res) => {
        // setIsModalOpen(false);
        if(res.status === 200){

          toast.success("Updated Sucessfully.")
          setTimeout(() => {
            onClose()
          }, 2000);
          await data;
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not be Updated.")
      });
  };

  const deleteItem = (section, index) => {
    setCourseData((prevData) => {
      const updatedData = { ...prevData };

      if (section === "skills") {
        updatedData.skills = prevData.skills.filter((_, i) => i !== index);
      } else if (section === "course_contents") {
        updatedData.course_contents = prevData.course_contents.filter(
          (_, i) => i !== index
        );
      }
      console.log("Updated Data:", updatedData); // Debugging
      return updatedData;
    });
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50">
          <div className=" rounded-lg bg-white shadow-lg  w-1/2 p-2 relative max-h-[90vh] overflow-y-auto">
            <div>
              {/* Close Icon */}
              <div className="  sticky top-2 flex justify-end ">
                <button
                  onClick={onClose}
                  className="  p-1 border rounded-full text-[15px] bg-white  flex justify-end text-gray-500 hover:text-gray-800"
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
              <div className="w-full flex items-center justify-center">
                <p className="text-gray-800 mb-5 font-bold text-4xl">
                  {data.course_name}
                </p>
              </div>
              <div className="space-y-4 p-7">
                <div className=" border border-gray-400 rounded-2xl p-4 ">
                  <p className="text-3xl font-bold mt-5 mb-6 font-poppins  text-gray-800">
                    Skills:
                  </p>
                  {data?.skills.map((inc, index) => (
                    <div
                      key={index}
                      className="flex border-b-2 py-2 items-center justify-between"
                    >
                      {editSection === "skills" && editIndex === index ? (
                        <input
                          type="text"
                          value={editContent.skills || ""}
                          onChange={(e) => handleInputChange(e, "skills")}
                          className="border border-gray-400 rounded-lg p-2 w-full"
                        />
                      ) : (
                        <p className="text-gray-800 w-full font-urbanist text-[22px]">
                          {inc}
                        </p>
                      )}

                      <div className="w-full flex mt-3 gap-3 justify-end">
                        {editSection === "skills" && editIndex === index ? (
                          <button
                            onClick={handleSaveClick}
                            className="outline-none px-8 py-2 border rounded-full bg-green-500 text-zinc-100"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditIncludes(index, inc)}
                            className="outline-none px-3 duration-150 text-[22px] py-2 border rounded-lg  text-zinc-900 hover:bg-black hover:text-white "
                          >
                            <CiEdit />
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem("skills", index)}
                          className="text-white px-3 bg-red-500 rounded-lg text-[22px] py-2 ml-2"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Toggle Add Include Input */}
                  <div className="flex items-center justify-end font-urbanist mt-4 w-full">
                    {!isAddIncludeInputVisible ? (
                      <button
                        onClick={() => setIsAddIncludeInputVisible(true)}
                        className="outline-none px-3 py-2 border rounded-lg bg-blue-500 text-white"
                      >
                        Add new Skill
                      </button>
                    ) : (
                      <div className="flex items-center ml-2 w-full ">
                        <input
                          type="text"
                          placeholder="Add new skill"
                          value={newcourse_include}
                          onChange={(e) => setNewcourse_include(e.target.value)}
                          className="border rounded-lg border-gray-400 p-2 w-full mr-2"
                        />
                        <button
                          onClick={handleAddcourse_include}
                          className="outline-none px-5 py-2 border rounded-lg bg-blue-500 text-white"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Display Course Content */}
                <div className=" border  border-gray-400 rounded-2xl p-4 ">
                  <div className="flex items-center font-urbanist justify-between">
                    <h2 className="text-3xl font-bold  mt-5 mb-6 font-poppins text-center text-gray-800">
                      Course Contents:
                    </h2>
                    <button
                      onClick={() => setIsAddContentModalOpen(true)}
                      className="outline-none px-3 py-2 text-[16px] border rounded-lg bg-blue-500 text-white"
                    >
                      Add new Content
                    </button>
                  </div>

                  <div className="space-y-4 font-urbanist">
                    {data?.course_contents.map((course_content, index) => (
                      <div
                        key={index}
                        className=" border-black/40 py-2  border px-4"
                      >
                        <div>
                          <p className="text-[20px]  font-bold text-black">
                            Topic:
                          </p>
                          {editSection === "course_contents" &&
                          editIndex === index ? (
                            <input
                              type="text"
                              value={
                                editContent.topic !== undefined
                                  ? editContent.topic
                                  : course_content.topic
                              }
                              onChange={(e) => handleInputChange(e, "topic")}
                              className="border border-gray-400 rounded-lg  p-2 w-full"
                            />
                          ) : (
                            <p className="text-gray-800 font-urbanist px-6  text-[20px]">
                              {course_content.topic}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-[20px]   font-bold text-black">
                            Description:
                          </p>
                          {editSection === "course_contents" &&
                          editIndex === index ? (
                            <JoditEditor
                              config={editorConfig}
                              value={
                                editContent.content_description !== undefined
                                  ? editContent.content_description
                                  : course_content.content_description
                              }
                              onBlur={(value) =>
                                handleInputChange(value, "content_description")
                              }
                            />
                          ) : (
                            <p
                              className="text-gray-800 px-6 font-urbanist text-[18px]"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  course_content.content_description
                                ),
                              }}
                            ></p>
                          )}
                        </div>

                        <div>
                          <span className="text-[20px]  font-bold text-black">
                            Enabled:
                          </span>
                          {editSection === "course_contents" &&
                          editIndex === index ? (
                            <select
                              value={
                                editContent.enabled_flag !== undefined
                                  ? editContent.enabled_flag
                                  : course_content.enabled_flag
                              }
                              onChange={(e) =>
                                handleInputChange(e, "enabled_flag")
                              }
                              className="border border-gray-400 rounded-lg  p-2 w-full"
                            >
                              <option value={true}>True</option>
                              <option value={false}>False</option>
                            </select>
                          ) : (
                            <span className="text-gray-800 ml-3 font-urbanist text-[18px]">
                              {course_content.enabled_flag === true
                                ? "true"
                                : "false"}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[20px]  font-bold text-black">
                            Sort value:
                          </span>
                          {editSection === "course_contents" &&
                          editIndex === index ? (
                            <input
                              type="number"
                              value={
                                editContent.sort_value !== undefined
                                  ? editContent.sort_value
                                  : course_content.sort_value
                              }
                              onChange={(e) =>
                                handleInputChange(e, "sort_value")
                              }
                              className="border border-gray-400 rounded-lg  p-2 w-full"
                            />
                          ) : (
                            <span className="text-gray-800 ml-3 font-urbanist text-[18px]">
                              {course_content.sort_value}
                            </span>
                          )}
                        </div>
                        <div className="w-full mb-2 flex mt-3 gap-4 font-poppins justify-end">
                          {editSection === "course_contents" &&
                          editIndex === index ? (
                            <button
                              onClick={handleSaveClick}
                              className="outline-none px-8 py-2 border rounded-full bg-green-500 text-zinc-100"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleEditContent(index, course_content)
                              }
                              className="outline-none px-3 duration-150 text-[22px] py-2 border rounded-lg  text-zinc-900 hover:bg-black hover:text-white "
                            >
                              <CiEdit />
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem("course_contents", index)}
                            className="outline-none px-8 py-2 border rounded-full bg-red-500 text-zinc-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sticky bottom-0 left-0  w-full font-urbanist bg-white p-4 shadow-md flex justify-center space-x-4 rounded-b-lg">
                  <button
                    onClick={handleChanges}
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>

            {isAddContentModalOpen && (
              <div className="fixed inset-0 flex font-urbanist items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full md:w-1/3 p-8 relative max-h-[95vh] overflow-y-auto">
                  {/* Close Icon */}
                  <button
                    onClick={() => setIsAddContentModalOpen(false)}
                    className="absolute text-[18px] top-4 right-6 text-gray-500 hover:text-gray-800"
                    aria-label="Close Modal"
                  >
                    &#x2715;
                  </button>

                  <h2 className="text-2xl text-center font-bold mb-4 text-gray-800">
                    Add New Course Content
                  </h2>

                  {/* Topic Input */}
                  <label
                    htmlFor="topic"
                    className="block text-xl font-medium text-gray-700 mb-1"
                  >
                    Topic:
                  </label>
                  <input
                    id="topic"
                    type="text"
                    placeholder="Topic"
                    value={newContent.topic || ""}
                    onChange={(e) =>
                      handleNewContentChange(e.target.value, "topic")
                    }
                    className="border border-gray-400 rounded-lg p-2 w-full mb-4"
                  />

                  {/* Description Input */}
                  <label
                    htmlFor="description"
                    className="block text-xl font-medium text-gray-700 mb-1"
                  >
                    Description:
                  </label>

                  <JoditEditor
                    config={editorConfig}
                    id="description"
                    placeholder="Description"
                    value={newContent.content_description || ""}
                    onBlur={(value) =>
                      handleNewContentChange(value, "content_description")
                    }
                    className="h-[200px] rounded-lg p-2 w-full mb-4"
                  />

                  <div className="relative top-5">
                    {/* Sort Order Input */}
                    <label
                      htmlFor="sortValue"
                      className="block text-xl font-medium text-gray-700 mb-1"
                    >
                      Sort value:
                    </label>
                    <input
                      id="sortValue"
                      type="text"
                      placeholder="Sort Order"
                      value={newContent.sort_value || ""}
                      onChange={(e) =>
                        handleNewContentChange(e.target.value, "sort_value")
                      }
                      className="border border-gray-400 rounded-lg p-2 w-full mb-4"
                    />

                    {/* Enabled Dropdown */}
                    <label
                      htmlFor="enabled"
                      className="block text-xl font-medium text-gray-700 mb-1"
                    >
                      Enabled:
                    </label>
                    <select
                      value={
                        newContent.enabled_flag === true
                          ? "true"
                          : newContent.enabled_flag === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        handleNewContentChange(
                          e.target.value === "true",
                          "enabled_flag"
                        )
                      }
                      className="border border-gray-400 rounded-lg p-2 w-full"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>

                    {/* Add Button */}
                    <button
                      onClick={handleAddContent}
                      className="outline-none px-4 py-2 mt-3 border text-[18px] rounded-full bg-green-500 text-white w-full"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Coursesdetail;
