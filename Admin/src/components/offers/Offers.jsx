import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Config from "../../../config/Config";

const Offers = () => {
  const [data, setData] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("Red");
  const [enabled_flag, setEnabled] = useState(false);
  const [sortValue, setSortValue] = useState(0);
  const [code, setCode] = useState("");
  const [validTill, setValidTill] = useState("");
  const [description, setDescription] = useState("");

  const genRandomHex = (length) => {
    let hexRef = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    return Array.from({ length }, () => hexRef[Math.floor(Math.random() * 16)])
      .join("")
      .toUpperCase();
  };

  const handleDelete = () => {
    setData(data.filter((row) => row.id !== currentRow.id));
    setShowDeletePopup(false);
  };

  const handleEdit = (row) => {
    setCurrentRow(row);
    setShowEditPopup(true);
  };

  const handleSaveEdit = () => {
    Config.editOffer(currentRow)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
          getOffers();
          setShowEditPopup(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOffers = async () => {
    Config.getOffers()
      .then((res) => {
        // console.log(res)
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOffers();
  }, []);

  const handleAdd = (newRow) => {
    setData([
      ...data,
      {
        id: Date.now(),
        dateCreated: new Date().toISOString().split("T")[0],
        ...newRow,
      },
    ]);
    // console.log(newRow)
    Config.addOffer(newRow)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setShowAddPopup(false);
  };

  return (
    <div className=" w-full bg-black  h-screen">
      {/* Add New Row Button */}

      <div className="w-full font-urbanist  ">
        <div className="font-poppins px-4 sticky top-0 bg-gray-800 z-10 py-7 flex justify-between font-bold   text-white ">
          <h2 className="font-bold tracking-wider text-4xl">Offers</h2>
          <button
            onClick={() => {
              setShowAddPopup(true);
              setCode(genRandomHex(5));
            }}
            className="mb-4 font-medium px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add New Offer
          </button>
        </div>

        <table className="w-full border border-gray-700 text-left bg-black text-gray-300">
          <thead className="text-gray-100">
            <tr>
              <th className="px-4 py-3 border border-gray-700">Title</th>
              <th className="px-4 py-3 border border-gray-700">Theme</th>
              <th className="px-4 py-3 border border-gray-700">Enabled</th>
              <th className="px-4 py-3 border border-gray-700">Sort Value</th>
              <th className="px-4 py-3 border border-gray-700">Offer Code</th>
              <th className="px-4 py-3 border border-gray-700">Valid Till</th>
              <th className="px-4 py-3 border border-gray-700">Date Created</th>
              <th className="px-4 py-3 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <tr key={row._id} className="hover:bg-gray-800">
                <td className="break-words max-h-[150px] overflow-auto border border-gray-700 px-2 py-3">
                  <div
                    className="w-full text-gray-300"
                    dangerouslySetInnerHTML={{ __html: row.title }}
                  ></div>
                </td>
                <td className="px-4 py-3 border border-gray-700">
                  {row.theme}
                </td>
                <td className="px-4 py-3 border border-gray-700 text-center">
                  <input
                    type="checkbox"
                    checked={row?.enabled_flag}
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-not-allowed"
                  />
                  {row?.enabled_flag ? " Enabled" : null}
                </td>
                <td className="px-4 py-3 border border-gray-700">
                  {row.sortValue}
                </td>
                <td className="px-4 py-3 border border-gray-700">{row.code}</td>
                <td className="px-4 py-3 border border-gray-700">
                  {new Date(row.validTill).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 border border-gray-700">
                  {new Date(row.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentRow(row);
                      setShowDeletePopup(true);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-400 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex font-urbanist items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 w-[30rem]">Confirm Delete</h3>
            <span className="flex mb-9">
              Are you sure you want to delete "
              <p
                className=""
                dangerouslySetInnerHTML={{ __html: currentRow.title }}
              ></p>
              " ?
            </span>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative font-urbanist bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowEditPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title */}
            <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Edit Offer
            </h3>

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
              >
                {/* Offer Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">
                    Offer Name
                  </label>
                  <ReactQuill
                    value={currentRow.title}
                    onChange={(value) =>
                      setCurrentRow({ ...currentRow, title: value })
                    }
                    className="border rounded-lg"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">
                    Description
                  </label>
                  <ReactQuill
                    value={currentRow.description}
                    onChange={(value) =>
                      setCurrentRow({ ...currentRow, description: value })
                    }
                    className="border rounded-lg"
                  />
                </div>

                <div className="flex gap-4">
                  {/* Theme */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-semibold mb-2 text-gray-600">
                      Theme
                    </label>
                    <select
                      value={currentRow.theme}
                      onChange={(e) =>
                        setCurrentRow({ ...currentRow, theme: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    >
                      <option>Orange</option>
                      <option>Blue</option>
                      <option>Lime</option>
                      <option>White</option>
                    </select>
                  </div>

                  {/* Offer Code */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-semibold mb-2 text-gray-600">
                      Offer Code
                    </label>
                    <input
                      type="text"
                      value={currentRow.code}
                      onChange={(e) =>
                        setCurrentRow({
                          ...currentRow,
                          code: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Valid Till */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-semibold mb-2 text-gray-600">
                      Valid Till
                    </label>
                    <input
                      type="date"
                      value={currentRow.validTill}
                      onChange={(e) =>
                        setCurrentRow({
                          ...currentRow,
                          validTill: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Sort Value */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-semibold mb-2 text-gray-600">
                      Sort Value
                    </label>
                    <input
                      type="number"
                      value={currentRow.sortValue}
                      min="0"
                      onChange={(e) =>
                        setCurrentRow({
                          ...currentRow,
                          sortValue: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Enabled Checkbox */}
                <div className="mb-6 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={currentRow.enabled_flag}
                    onChange={() =>
                      setCurrentRow({
                        ...currentRow,
                        enabled_flag: !currentRow.enabled_flag,
                      })
                    }
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="text-sm font-semibold text-gray-600">
                    Enabled
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditPopup(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white font-urbanist px-6 py-5 rounded-lg shadow-xl w-full max-w-3xl">
            {/* Close Button */}
            <button
              onClick={() => setShowAddPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title */}
            <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Add New Offer
            </h3>

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <form
                className="w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  const newRow = {
                    title: title,
                    theme: theme,
                    enabled_flag: enabled_flag,
                    sortValue: parseInt(sortValue),
                    code: code,
                    validTill: validTill,
                    description: description,
                  };
                  handleAdd(newRow);
                }}
              >
                {/* Title */}
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Title
                  </label>
                  <ReactQuill
                    value={title}
                    onChange={setTitle}
                    className="border rounded-lg"
                    style={{
                      maxHeight: "150px",
                      overflow: "auto",
                    }}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Description
                  </label>
                  <ReactQuill
                    value={description}
                    onChange={setDescription}
                    className="border rounded-lg"
                    style={{
                      maxHeight: "150px",
                      overflow: "auto",
                    }}
                  />
                </div>

                <div className=" flex gap-4  ">
                  {/* Theme */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    >
                      <option>Orange</option>
                      <option>Blue</option>
                      <option>Lime</option>
                      <option>White</option>
                    </select>
                  </div>

                  {/* Offer Code */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      Offer Code
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className=" flex gap-4 ">
                  {/* Valid Till */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      Valid Till
                    </label>
                    <input
                      type="date"
                      value={validTill}
                      onChange={(e) => setValidTill(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Sort Value */}
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      Sort Value
                    </label>
                    <input
                      type="number"
                      value={sortValue}
                      min="0"
                      onChange={(e) => setSortValue(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Enabled */}
                <div className="mb-6 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={enabled_flag}
                    onChange={() => setEnabled(!enabled_flag)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="text-sm font-semibold text-gray-600">
                    Enabled
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowAddPopup(false)}
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
                  >
                    Add Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
