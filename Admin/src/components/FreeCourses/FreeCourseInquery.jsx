import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import Config from "../../../config/Config";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify

const FreeCourseInquiry = ({ onClose, data }) => {
  const [inquires, setInquiries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [msg, setmsg] = useState("");
  const [isReply, setisReply] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const getCourseInq = (id) => {
    Config.getCourseInqs(id)
      .then((res) => {
        setInquiries(res.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCourseInq(data._id);
    const intervalId = setInterval(getCourseInq(data._id), 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleView = async (inq) => {
    setSelectedRow(inq);
    setShowModal(true);
    try {
      Config.inqView(inq._id)
        .then((res) => {
          getCourseInq(data._id);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplyFlag = async (inq) => {
    setisReply(true);
    const payload = {
      msg,
      inq,
    };

    try {
      Config.inqReply(payload)
        .then((res) => {
          setisReply(false);
          toast.success("Reply sent successfully!"); // Success message using Toastify
          closeModal();
          getCourseInq(data._id);
        })
        .catch((err) => {
          toast.error("Failed to send reply. Please try again."); // Error message using Toastify
          console.log(err);
        });
    } catch (error) {
      toast.error("An error occurred. Please try again."); // Catching any unexpected errors
      console.log(error);
    }
  };

  return (
    <div className=" bg-black">
      <div className="fixed inset-0  backdrop-blur-md bg-black bg-opacity-50 z-50">
        {inquires.length > 0 && (
          <h2 className="text-5xl bg-gray-800 text-white sticky top-0  font-urbanist py-6 px-4">
            Inquiries : {inquires[0].for_course?.course_name}
          </h2>
        )}
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 font-urbanist right-3 p-2 rounded-full text-gray-500 hover:text-black bg-gray-200 hover:bg-gray-300 shadow-lg"
        >
          <RxCrossCircled className="w-6 h-6" />
        </button>
        {/* Toastify Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="pb-5">
          {inquires.length > 0 ? (
            <table className="bg-black/90 border border-gray-600 rounded-lg">
              <thead className="sticky top-20 w-full bg-black">
                <tr className="border-b  text-start border-gray-700">
                  <th className="px-4 py-4 w-[18%] text-left text-[18px] font-semibold text-white">
                    Username
                  </th>
                  <th className="px-4 py-4  w-[22%] text-left text-[18px] font-semibold text-white">
                    Email
                  </th>

                  <th className="px-4 w-[20%] py-4 text-gray-300">Date</th>
                  <th className="px-2 w-[20%] py-4 text-gray-300">Replied</th>
                  <th className="px-2 w-[20%] py-4 text-gray-300">Viewed</th>
                  <th className="px-4 w-[10%] py-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquires.map((inq) => (
                  <tr
                    key={inq._id}
                    className="border-b w-full text-center text-[16px] border-gray-700"
                  >
                    <td className="px-4 py-4 text-start  text-gray-300">
                      {inq.inquiry_by}
                    </td>
                    <td className="px-4 py-4 text-start  text-gray-300">
                      {inq.email}
                    </td>

                    <td className="px-4   py-4 text-gray-300">
                      {new Date(inq.createdAt).toLocaleDateString("en-US", {
                        month: "long", // Full month name (e.g., "June")
                        day: "numeric", // Numeric day (e.g., "3")
                        year: "numeric", // Full year (e.g., "2024")
                      })}
                    </td>
                    <td
                      className={`px-2  py-4 ${
                        inq.replied_flag ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {inq.replied_flag ? "Replied" : "Pending"}
                    </td>
                    <td
                      className={`px-2  py-4 ${
                        inq.viewed_flag ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {inq.viewed_flag ? "Viewed" : "Pending"}
                    </td>
                    <td className="px-4  py-4">
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
          ) : (
            <div className="text-center text-xl text-gray-400 mt-8">
              No inquiries available.
            </div>
          )}
        </div>

        {showModal && selectedRow && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 flex items-center justify-center z-50">
            <div
              className="bg-white/20 backdrop-blur-md text-white p-8 rounded-3xl w-11/12 md:w-1/2 relative max-h-[90vh] shadow-2xl overflow-y-auto animate-fadeIn"
              style={{
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Cross Icon */}
              <button
                className="absolute top-4 right-4 text-[28px] text-gray-300 hover:text-red-500 transition-transform transform hover:scale-110"
                onClick={closeModal}
              >
                <RxCrossCircled />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                  <span className="text-blue-400">📩</span> Inquiry Details
                </h3>
                <p className="text-gray-300 text-lg">
                  View and respond to inquiries
                </p>
              </div>

              <hr className="border-gray-600 mb-6" />

              {/* Modal Content */}
              <div className="flex flex-col gap-5 text-gray-200">
                <p>
                  <strong className="text-xl font-bold text-white">
                    Inquiry By:
                  </strong>{" "}
                  <span className="text-lg">{selectedRow.inquiry_by}</span>
                </p>
                <p>
                  <strong className="text-xl font-bold text-white">
                    Email:
                  </strong>{" "}
                  <span className="text-lg">{selectedRow.email}</span>
                </p>
                <div>
                  <strong className="text-xl font-bold text-white">
                    For Course:
                  </strong>
                  <p className="text-lg mt-1 pl-4 border-l-2 border-blue-500">
                    {selectedRow.for_course?.course_name}
                  </p>
                </div>
                <div>
                  <strong className="text-xl font-bold text-white">
                    Message:
                  </strong>
                  <p className="text-lg mt-1 pl-4 border-l-2 border-blue-500">
                    {selectedRow.inquiry}
                  </p>
                </div>
                <p>
                  <strong className="text-xl font-bold text-white">
                    Replied Flag:
                  </strong>{" "}
                  <span className="text-lg">
                    {selectedRow.replied_flag ? "True" : "False"}
                  </span>
                </p>
              </div>

              <hr className="border-gray-600 my-6" />

              {/* Reply Section */}
              <div className="mt-6">
                <p className="text-lg font-semibold text-gray-300 mb-2">
                  Replying to:{" "}
                  <span className="text-white font-bold">
                    {selectedRow.email}
                  </span>
                </p>
                <textarea
                  onChange={(e) => setmsg(e.target.value)}
                  rows="6"
                  className="w-full text-black h-32 p-4 border border-gray-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Write your reply here..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-transform transform hover:scale-105"
                >
                  Close
                </button>
                <button
                  onClick={() => handleReplyFlag(selectedRow)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105"
                  disabled={isReply}
                >
                  {isReply ? <>Replying... </> : <>Reply</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeCourseInquiry;
