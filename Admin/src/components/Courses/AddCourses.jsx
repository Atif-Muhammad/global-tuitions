import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import Config from "../../../config/Config";
import JoditEditor from "jodit-react";
import editorConfig from "../EditorConfig";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const AddCourses = ({ closeModal }) => {
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
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [skillsInput, setSkillsInput] = useState(""); // String for input
  const [skillsList, setSkillsList] = useState([]); // Array for list
  const [courseIncludesInput, setCourseIncludesInput] = useState(""); // String for input
  const [courseIncludesList, setCourseIncludesList] = useState([]); // Array for list

  const handleAddSkills = () => {
    if (skillsInput.trim() !== "") {
      // Add the prerequisite to the list and clear the input field
      setSkillsList([...skillsList, skillsInput.trim()]);
      setSkillsInput(""); // Clear input field
    }
  };

  const fetchCategories = async () => {
    Config.getAllCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // // fetchCourses();
    fetchCategories();
  }, []);

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
    // console.log(courseSort)
    if(courseSort < 0){
      toast.error("Sort value must be 0 or a positive number.");
      return;
    }
    
    // Prepare the course data to be submitted
    const newCourse = {
      course_name: courseName,
      course_description: courseDescription,
      sort_value: courseSort,
      enabled_flag: courseEnabled,
      course_level: courseLevel,
      course_duration: duration,
      price: parseFloat(price),
      category_id: category, // Assuming category is the correct ID
      skills: skillsList,
    };

    const combinedData = {
      newCourse,
      includedItems,
    };
    // console.log(combinedData)

    Config.addCourse(combinedData)
      .then((res) => {
        if(res.status === 200){
          toast.success("Course Created.")
          setCourseName("");
          setCourseDescription("");
          setCourseSort("");
          setCourseEnabled(false);
          setCourseLevel("");
          setPrice("");
          setCategory("");
          setDuration("");
          setIncludedItems([]);
          setSkillsInput("");
          setCourseIncludesInput("");
          setStatus("success");
          closeModal(false);
        }
        
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
      <div className="overflow-y-auto backdrop-blur-lg overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
        <div className="relative w-[60%] max-w-4xl mx-auto shadow-xl font-urbanist max-h-full bg-gradient-to-t from-gray-100 via-white to-gray-50 rounded-xl">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <h3 className="text-4xl font-bold w-full text-center">
                  Add Course
                </h3>
                <button
                  type="button"
                  className="text-white hover:bg-indigo-700 rounded-full p-2"
                  onClick={closeModal}
                >
                  <RxCross1 size={24} />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Course Name */}
                <div className="w-full flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="course-name"
                      className="block text-lg font-semibold text-gray-50"
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
                      className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="categories"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Category:
                    </label>
                    <select
                      required
                      id="categories"
                      name="category_id._id"
                      onChange={(e) => setCategory(e.target.value)}
                      className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((cat) => cat.category_name !== "Free Courses")
                        .map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.category_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Course Description */}
                <div>
                  <label
                    htmlFor="course-description"
                    className="text-lg font-semibold text-gray-50"
                  >
                    Course Description:
                  </label>
                  <JoditEditor
                    config={editorConfig}
                    id="course-description"
                    name="course_description"
                    value={courseDescription}
                    onBlur={setCourseDescription}
                    required
                    placeholder="Enter Course Description"
                    className="block w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Course Level, Duration, and Price */}
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="course-level"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Course Level:
                    </label>
                    <select
                      required
                      id="course-level"
                      name="course_level"
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Course Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advance">Advance</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="duration"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Course Duration:
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter Duration"
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="price"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Course Price:
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter Price"
                    />
                  </div>
                </div>

                {/* Sort and Enable */}
                <div className="flex gap-5 items-center">
                  <div className="w-1/2">
                    <label
                      htmlFor="course-sort"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Sort Value:
                    </label>
                    <input
                      type="number"
                      id="course-sort"
                      name="sort"
                      value={courseSort}
                      onChange={(e) => setCourseSort(e.target.value)}
                      required
                      className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="course-enable"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Enable:
                    </label>
                    <input
                      id="course-enable"
                      type="checkbox"
                      name="enabled"
                      checked={courseEnabled}
                      onChange={(e) => setCourseEnabled(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <label
                    htmlFor="course-prerequisites"
                    className="block text-lg font-semibold text-gray-50 mt-8"
                  >
                    Skills:
                  </label>
                  <div className="mt-2 space-y-2">
                    {skillsList.length > 0 &&
                      skillsList.map((skills, index) => (
                        <li key={index} className="text-gray-700 text-lg">
                          {skills}
                        </li>
                      ))}
                  </div>
                  <textarea
                    id="course-prerequisites"
                    name="prerequisites"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="block w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
                    placeholder="Enter Course Prerequisites"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkills}
                    className="mt-2 bg-blue-500 text-white w-[10rem] py-2 px-3 rounded-lg hover:bg-blue-600"
                  >
                    Add Skills
                  </button>
                </div>

                {/* Course Content Section */}
                <div className="mt-10 space-y-4">
                  <h3 className="text-3xl text-center font-bold text-gray-50">
                    Course Contents
                  </h3>

                  {includedItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p>
                          <strong>Topic:</strong> {item.name}
                        </p>
                        <p>
                          <strong>Topic Description:</strong>{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(item.description),
                            }}
                          ></span>
                        </p>
                        <p>
                          <strong>Sort Value:</strong> {item.sort}
                        </p>
                        <p>
                          <strong>Enabled:</strong>{" "}
                          {item.enabled ? "Yes" : "No"}
                        </p>
                      </div>
                      <button
                        className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                        type="button"
                        onClick={() => handleDeleteIncluded(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <div className="w-full flex space-x-4">
                    <div className="flex-1">
                      <label
                        htmlFor="name"
                        className="block text-lg font-semibold text-gray-50"
                      >
                        Topic:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-lg font-semibold text-gray-50"
                    >
                      Topic Description:
                    </label>
                    <JoditEditor
                      config={editorConfig}
                      id="description"
                      name="description"
                      value={formData.description}
                      onBlur={handleQuillChange}
                      placeholder="Enter Content Description"
                      className="block w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="mt-4 flex gap-5 items-end">
                    <div className="w-1/2">
                      <label
                        htmlFor="sort"
                        className="block text-lg font-semibold text-gray-50"
                      >
                        Sort Value:
                      </label>
                      <input
                        type="number"
                        id="sort"
                        name="sort"
                        value={formData.sort}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-2 border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="enabled"
                        className="block text-lg font-semibold text-gray-50"
                      >
                        Enable:
                      </label>
                      <input
                        id="enabled"
                        type="checkbox"
                        name="enabled"
                        checked={formData.enabled}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <button
                    className="px-6 py-3 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    type="button"
                    onClick={handleAddIncluded}
                  >
                    Add Topic
                  </button>
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCourses;
