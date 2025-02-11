import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import Config from "../../../config/Config";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import { RxCross1 } from "react-icons/rx";

const AddCategory = ({ closeModal }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categorySort, setCategorySort] = useState(null);
  const [categoryEnabled, setCategoryEnabled] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    if (categorySort === null || categorySort < 0 || isNaN(categorySort)) {
      toast.error("Sort value must be 0 or a positive number.");
      return;
    }
    const data = {
      category_name: categoryName,
      sort_value: categorySort,
      enabled_flag: categoryEnabled,
    };

    Config.addCategory(data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
          // Show success message using React Toastify
          toast.success("Category added successfully!");

          // Close modal after success
          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          toast.error(`${res.response.data}`);
        }
      })
      .catch((err) => {
        // Show error message using React Toastify
        toast.error(`${err}`);
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

      {/* Modal */}
      <div className="overflow-y-auto backdrop-blur-sm overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 bg-indigo-500 text-white">
              <h3 className="text-3xl font-semibold w-full text-center">
                Add Category
              </h3>
              <button
                type="button"
                className="text-white bg-transparent hover:bg-indigo-600 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                onClick={closeModal}
              >
                <RxCross1 />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-4 font-urbanist md:p-5 space-y-6">
              <div className="flex flex-col gap-y-4">
                <label
                  htmlFor="category-name"
                  className="text-lg font-semibold text-gray-800 dark:text-white"
                >
                  Category Name:
                </label>
                <input
                  type="text"
                  id="category-name"
                  value={categoryName || ""}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category-sort"
                    className="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Sort by:
                  </label>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) => setCategorySort(e.target.value)}
                    id="category-sort"
                    value={categorySort || ""}
                    required
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="category-enable"
                    className="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Enable:
                  </label>
                  <input
                    id="category-enable"
                    type="checkbox"
                    checked={categoryEnabled}
                    onChange={(e) => setCategoryEnabled(e.target.checked)}
                    className="h-5 w-5 text-indigo-600 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={handleSubmit}
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
              >
                Submit
              </button>
            </div>
          </div>
      </div>
    </>
  );
};

export default AddCategory;
