import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import Config from "../../../config/Config";
// import JoditEditor from "jodit-react";
import {Mantine} from '../Mantine/Mantine.jsx'
import editorConfig from "../EditorConfig";
import { RxCross1 } from "react-icons/rx";

const AddFreeCourses = ({ closeModal }) => {
  const [categories, setCategories] = useState([]);
  const [includedItems, setIncludedItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    sort: "",
    enabled: false,
    description: "",
  });
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseSort, setCourseSort] = useState("");
  const [courseEnabled, setCourseEnabled] = useState(false);
  const [courseLevel, setCourseLevel] = useState("");
  // const [price, setPrice] = useState("");
  const [date, setDate] = useState(""); // State for date
  const [time, setTime] = useState(""); // State for time
  const [category, setCategory] = useState({});
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [skillsInput, setSkillsInput] = useState(""); // String for input
  const [skillsList, setSkillsList] = useState([]); // Array for list
  const [courseIncludesInput, setCourseIncludesInput] = useState(""); // String for input
  const [courseIncludesList, setCourseIncludesList] = useState([]); // Array for list

  // get free category
  const getFreeCategory = () => {
    Config.getFreeCategory()
      .then((res) => {
        setCategory(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getFreeCategory();
  }, []);

  const handleAddSkills = () => {
    if (skillsInput.trim() !== "") {
      // Add the prerequisite to the list and clear the input field
      setSkillsList([...skillsList, skillsInput.trim()]);
      setSkillsInput(""); // Clear input field
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQuillChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };

  const handleAddIncluded = () => {
    const newItem = {
      name: formData.name, // Correct key matching formData
      sort: formData.sort, // Correct key matching formData
      enabled: formData.enabled, // Correct key matching formData
      description: formData.description, // Correct key matching formData
    };

    setIncludedItems([...includedItems, newItem]);

    // Reset form fields
    setFormData({
      name: "",
      sort: "",
      enabled: false,
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the course data to be submitted
    const newCourse = {
      course_name: courseName,
      course_description: courseDescription,
      sort_value: courseSort,
      enabled_flag: courseEnabled,
      course_level: courseLevel,
      course_duration: duration,
      date: date,
      time: time,
      // price: parseFloat(price),
      category_id: category._id, // Assuming category is the correct ID
      skills: skillsList,
    };

    const combinedData = {
      newCourse,
      includedItems,
    };

    Config.addCourse(combinedData)
      .then((res) => {
        setCourseName("");
        setCourseDescription("");
        setCourseSort("");
        setCourseEnabled(false);
        setCourseLevel("");
        // setPrice("");
        setDate("");
        setTime("");
        // setCategory("");
        setDuration("");
        setIncludedItems([]);
        setSkillsInput("");
        setCourseIncludesInput("");
        setStatus("success");
        closeModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteIncluded = (indexToDelete) => {
    const updatedItems = includedItems.filter(
      (_, index) => index !== indexToDelete
    );
    setIncludedItems(updatedItems);
  };

  return (
    <>
      <div className="overflow-y-auto backdrop-blur-sm overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full  md:inset-0 h-[calc(100%-1rem)] max-h-full flex ">
        <div className="relative pt-8 w-[60%] shadow-black   font-urbanist max-h-full">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-6   border-b rounded-t dark:border-gray-600">
                <h3 className="text-4xl underline text-center w-full font-bold">
                  Add Course
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeModal}
                >
                  <RxCross1 />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div className="w-full flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="course-name"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Course Name:
                    </label>
                    <input
                      type="text"
                      id="course-name"
                      name="course_name"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[16px]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="course-description"
                    className=" text-[20px]  font-semibold text-gray-800"
                  >
                    Description:
                  </label>
                  <Mantine formdata={courseDescription} handleQuillChange={setCourseDescription}/>

                  {/* <JoditEditor
                    config={editorConfig}
                    id="course-description"
                    name="course_description"
                    value={courseDescription}
                    onBlur={setCourseDescription}
                    required
                    placeholder="Enter Course Description"
                  /> */}
                </div>
                <div className="flex items-start relative top-6 space-x-4">
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="course-level"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Course Level:
                    </label>
                    <select
                      id="course-level"
                      name="course_level"
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className=" p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Select Course Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advance">Advance</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="price"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Duration:
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      className=" p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="flex flex-row space-x-6">
                  {/* Date Picker */}
                  <div className="flex-1">
                    <label
                      htmlFor="date"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Date:
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {/* Calendar Icon */}
                      <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Time Picker */}
                  <div className="flex-1">
                    <label
                      htmlFor="time"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Time:
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* Clock Icon */}
                      <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-5  items-end ">
                  <div className="w-1/2">
                    <label
                      htmlFor="course-sort"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Sort value:
                    </label>
                    <input
                      type="number"
                      id="course-sort"
                      name="sort"
                      value={courseSort}
                      onChange={(e) => setCourseSort(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
                    />
                  </div>
                  <div className="flex w-1/2 items-center space-x-2">
                    <label
                      htmlFor="course-enable"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      Enable:
                    </label>
                    <input
                      id="course-enable"
                      type="checkbox"
                      name="enabled"
                      checked={courseEnabled}
                      onChange={(e) => setCourseEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="course-prerequesits"
                    className="block text-[27px] mt-10 font-poppins font-bold text-gray-800"
                  >
                    Skills:
                  </label>

                  <div className="mt-2">
                    <ul>
                      {skillsList.length > 0 &&
                        skillsList.map((skills, index) => (
                          <li
                            key={index}
                            className="text-gray-700 text-[20px] "
                          >
                            {skills}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <textarea
                    id="course-prerequesits"
                    name="prerequisites"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)} // Set input value
                    // required
                    className=" resize-none p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Course Prerequisites"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkills}
                    className="mt-2 bg-blue-500 text-white  w-[10rem] py-2 px-3 rounded-lg"
                  >
                    Add Skills
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-5 space-y-4 mt-10 border-t border-gray-200 dark:border-gray-600">
                <h3 className="text-3xl text-center font-bold text-gray-900 dark:text-white">
                  Course Content
                </h3>

                {/* Display course details */}
                {includedItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 text-[1.2rem] border flex  rounded-md mb-4 relative"
                  >
                    <div>
                      <p>
                        <strong className="text-[1.3rem]">name:</strong>{" "}
                        {item.name}
                      </p>
                      <p>
                        <strong className="text-[1.3rem]">Description:</strong>{" "}
                        <p
                          dangerouslySetInnerHTML={{
                            __html:item.description,
                          }}
                        ></p>
                      </p>
                      <p>
                        <strong className="text-[1.3rem]">Sort value:</strong>{" "}
                        {item.sort}
                      </p>
                      <p>
                        <strong className="text-[1.3rem]">Enabled:</strong>{" "}
                        {item.enabled ? "Yes" : "No"}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      className="absolute bottom-2 right-2  text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      type="button"
                      onClick={() => handleDeleteIncluded(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {/* Form to add new course detail */}
                <div className="w-full flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-[20px] font-semibold text-gray-800"
                    >
                      name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-[20px] font-semibold text-gray-800"
                  >
                    Description:
                  </label>
                  <Mantine formdata={formData.description} handleQuillChange={handleQuillChange}/>
                  {/* <JoditEditor
                    config={editorConfig}
                    id="description"
                    name="description"
                    value={formData.description}
                    onBlur={handleQuillChange}
                    placeholder="Enter Course Description"
                  /> */}
                </div>

                <div className=" relative top-4 ">
                  <div className="flex gap-5 items-end">
                    <div className="w-1/2">
                      <label
                        htmlFor="sort"
                        className="block text-[20px] font-semibold text-gray-800"
                      >
                        Sort value:
                      </label>
                      <input
                        type="number"
                        id="sort"
                        name="sort"
                        value={formData.sort}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-[16px]"
                      />
                    </div>
                    <div className="flex w-1/2 items-center space-x-2">
                      <label
                        htmlFor="enabled"
                        className="block text-[20px] font-semibold text-gray-800"
                      >
                        Enable:
                      </label>
                      <input
                        id="enabled"
                        type="checkbox"
                        name="enabled"
                        checked={formData.enabled}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <button
                    className="px-3 text-white mt-3 w-[10rem] py-2 rounded-lg bg-blue-500"
                    type="button"
                    onClick={handleAddIncluded}
                  >
                    Add Content
                  </button>
                </div>
              </div>

              <div className="sticky bottom-0 left-0 w-full bg-gray-100 p-4 shadow-md flex justify-end space-x-4 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit Course
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddFreeCourses;
