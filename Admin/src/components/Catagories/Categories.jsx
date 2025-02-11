import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import AddCategory from "./AddCategory";
import Config from "../../../config/Config";
import { RxCross1 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpenforNewCatagory, setIsModalOpenforNewCatagory] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({});

  // Function to fetch categories
  const getCategories = async () => {
    Config.getAllCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
    const intervalId = setInterval(getCategories, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (id) => {
    Config.RemoveCategory(id)
      .then((res) => {
        // console.log(res)
        toast.success("Category deleted!"); // Success toast message
        getCategories(); // Refresh categories
      })
      .catch(() => {
        toast.error("Failed to delete the category. Please try again."); // Error toast message
      });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCategory.category_name.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    if (
      editCategory.sort_value === null ||
      editCategory.sort_value < 0 ||
      isNaN(editCategory.sort_value)
    ) {
      toast.error("Sort value must be 0 or a positive number.");
      return;
    }

    Config.updateCategory(editCategory)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          toast.success("Category Updated");
          getCategories();
          closeEditModal();
        } else {
          toast.error("Category could not be updated");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModalfornewCatagory = () => {
    setIsModalOpenforNewCatagory(true);
  };

  const closeModalfornewCatagory = () => {
    setIsModalOpenforNewCatagory(false);
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      handleDelete(selectedCategory._id);
      closeModal();
    }
  };

  const openEditModal = (category) => {
    setEditCategory(category);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCategory({});
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCategory((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        // pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <>
        <div className="md:w-[80%] w-11/12 bg-black/80 rounded-xl shadow-lg">
          <div className="sticky top-0 px-6 py-4 bg-gradient-to-r from-gray-800 to-black z-40 font-poppins font-bold text-white flex justify-between items-center">
            <p className="text-4xl font-urbanist text-white">All Categories</p>
            <button
              onClick={openModalfornewCatagory}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs tracking-wider px-3 py-3 transition ease-in-out duration-200 transform hover:scale-105"
              type="button"
            >
              Add New Category
            </button>
          </div>

          <form>
            <div className="pb-6">
              {categories.length > 0 ? (
                <table className="w-full border-collapse bg-black/90 border border-white text-sm lg:text-base rounded-lg shadow-lg">
                  {/* Table Header */}
                  <thead className="sticky top-24 z-40 bg-gradient-to-r from-black to-gray-800 text-white">
                    <tr className="text-xl">
                      <th className="border border-white px-6 py-3 text-left font-semibold">
                        Category Name
                      </th>
                      <th className="border border-white px-2 py-3 text-center font-semibold">
                        Sort Value
                      </th>
                      <th className="border border-white px-2 py-3 text-center font-semibold">
                        Enabled
                      </th>
                      <th className="border border-white px-3 py-3 text-center font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody>
                    {categories.map((category) => (
                      <tr
                        className="text-white hover:bg-gray-700/50 transition-colors duration-300 font-urbanist"
                        key={category._id}
                      >
                        <td className="border border-white px-6 py-3">
                          {category?.category_name}
                        </td>
                        <td className="border border-white px-2 py-3 text-center">
                          {category?.sort_value}
                        </td>
                        <td className="border border-white px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={category?.enabled_flag}
                            readOnly
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-not-allowed"
                          />
                        </td>
                        <td className="border border-white px-6 py-3 text-center flex justify-center gap-6">
                          <button
                            type="button"
                            className="relative bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 rounded-full transition duration-300 transform hover:scale-105 group flex items-center gap-2"
                            onClick={() => openEditModal(category)}
                          >
                            <CiEdit />
                            <span className="hidden lg:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            className="relative bg-red-500 hover:bg-red-600 text-white py-3 px-5 rounded-full transition duration-300 transform hover:scale-105 group flex items-center gap-2"
                            onClick={() => openModal(category)}
                          >
                            <MdDelete />
                            <span className="hidden lg:inline">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-2xl text-gray-400 mt-8">
                  No Categories Available.
                </div>
              )}
            </div>
          </form>

          {/* Delete Confirmation Modal */}
          {isModalOpen && selectedCategory && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
                <h2 className="text-2xl font-bold mb-4">Confirm Deletion?</h2>
                <p className="mb-6">
                  Are you sure you want to delete the category "
                  <span className="font-semibold">
                    {selectedCategory.category_name}
                  </span>
                  "?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Category Modal */}
          {isEditModalOpen && (
            <div className="overflow-y-auto backdrop-blur-sm overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 bg-indigo-500 text-white">
                  <h3 className="text-3xl font-semibold w-full text-center">
                    Edit Category
                  </h3>
                  <button
                    type="button"
                    className="text-white bg-transparent hover:bg-indigo-600 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                    onClick={closeEditModal}
                  >
                    <RxCross1 />
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => handleEditSubmit(e)}
                  className="space-y-6 px-5 py-6"
                >
                  <div>
                    <label
                      className="block text-lg font-semibold text-gray-50 mb-2"
                      htmlFor="name"
                    >
                      Category Name:
                    </label>
                    <input
                      type="text"
                      name="category_name"
                      value={editCategory.category_name || ""}
                      onChange={handleEditChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="category-sort"
                        className="block text-lg font-semibold text-gray-50"
                      >
                        Sort by:
                      </label>
                      <input
                        type="number"
                        name="sort_value"
                        value={editCategory.sort_value || ""}
                        onChange={handleEditChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="category-enable"
                        className="text-lg font-semibold text-gray-50"
                      >
                        Enable:
                      </label>
                      <input
                        id="category-enable"
                        type="checkbox"
                        name="enabled_flag"
                        checked={editCategory.enabled_flag || false}
                        onChange={(e) => {
                          setEditCategory((prev) => ({
                            ...prev,
                            enabled_flag: e.target.checked,
                          }));
                        }}
                        className="h-6 w-6 text-indigo-600 border-gray-300 rounded-md focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-lg transition duration-300 hover:bg-gray-300"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg transition duration-300 hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Add Category Modal */}
        {isModalOpenforNewCatagory && (
          <AddCategory closeModal={closeModalfornewCatagory} />
        )}
      </>
    </>
  );
};

export default Categories;
