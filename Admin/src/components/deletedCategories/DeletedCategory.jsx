import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import Config from "../../../config/Config";
import { RxCross1 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";

function DeletedCategories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpenforNewCatagory, setIsModalOpenforNewCatagory] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({});

  // Function to fetch categories
  const getCategories = () => {
    Config.getDeletedCategories()
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
    Config.deleteCategory(id)
      .then((res) => {
        toast.success("Category Deleted Permanantly.");
        // console.log(res);
        getCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (id) => {
    handleDelete(id);
    closeModal();
  };

  const handleRecovery = async (id) => {
    console.log("Recovery in progress/...");
    Config.recoverCategory(id)
      .then((res) => {
        toast.success("Category Recovered.");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
      <div className="md:w-[80%] w-11/12  bg-black/80 ">
        <div className=" sticky top-0 px-4 bg-gray-800 z-40 font-poppins font-bold      py-7 flex justify-between items-center text-white ">
          <p className="text-4xl  font-urbanist"> Deleted Categories</p>
        </div>

        <form>
          <div className="pb-5">
            {categories?.length > 0 ? (
              <table className="w-full border-collapse bg-black/90 border border-white text-sm lg:text-base">
                {/* Table Header */}
                <thead className="sticky top-24 z-40 bg-black text-white">
                  <tr className="text-[20px]">
                    <th className="border border-white px-4 py-3 text-left">
                      Name
                    </th>
                    <th className="border border-white px-4 py-3 text-center">
                      Sort Value
                    </th>
                    <th className="border border-white px-4 py-3 text-center">
                      Enabled
                    </th>
                    <th className="border border-white px-4 py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {categories?.map((category) => (
                    <tr
                      className="text-white hover:bg-gray-700/50 transition-colors duration-200 font-urbanist"
                      key={category?._id}
                    >
                      <td className="border border-white px-4 py-3">
                        {category?.category_name}
                      </td>
                      <td className="border border-white px-4 py-3 text-center">
                        {category?.sort_value}
                      </td>
                      <td className="border border-white px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={category?.enabled_flag}
                          readOnly
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-not-allowed"
                        />
                      </td>
                      <td className="border border-white px-4 py-3 text-center flex justify-center gap-4">
                        <button
                          type="button"
                          className="relative bg-blue-500/70 hover:bg-blue-700 text-white py-2 px-3 rounded text-[20px] group flex items-center gap-1"
                          // onClick={() => openEditModal(category)}
                          onClick={() => handleRecovery(category._id)}
                        >
                          {/* <CiEdit /> */}
                          <span className="hidden lg:inline">Recover</span>
                          <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Recover
                          </span>
                        </button>
                        <button
                          type="button"
                          className="relative bg-red-500 hover:bg-red-700 text-white py-2 px-3 rounded text-[20px] group flex items-center gap-1"
                          onClick={() => openModal(category)}
                        >
                          <MdDelete />
                          <span className="hidden lg:inline">Delete</span>
                          <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-2xl text-gray-300 mt-8">
                No Deleted Category available.
              </div>
            )}
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {isModalOpen && selectedCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">
                Are you sure you want to delete the category "
                <span className="font-semibold">
                  {selectedCategory?.category_name}
                </span>
                "?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => confirmDelete(selectedCategory._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DeletedCategories;
