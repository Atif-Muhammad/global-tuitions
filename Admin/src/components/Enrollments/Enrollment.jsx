import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import Config from "../../../config/Config";

const Enrollment = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [isReply, setisReply] = useState(false);
  const [isReject, setisReject] = useState(false);
  const [isApproved, setisApproved] = useState(false);

  const replyRef = useRef(null);

  const handleViewClick = (rowData) => {
    setSelectedRow(rowData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const refreshEnrollments = () => {
    Config.getEnrollments()
      .then((res) => {
        setEnrollments(res.reverse());
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    refreshEnrollments();
  }, []);

  const handleReply = (id, email) => {
    setisReply(true);

    const payload = {
      id,
      email,
      msg: replyRef.current.value,
    };

    Config.enrollmentReply(payload)
      .then(() => {
        setisReply(false);
        refreshEnrollments();
        closeModal();
        toast.success("Sent Reply");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send reply!");
      });
  };

  const handleApprove = (id) => {
    setisApproved(true);
    Config.enrollmentApprove(id)
      .then(() => {
        setisApproved(false);
        refreshEnrollments();
        closeModal();
        toast.success("Enrollment approved");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to approve enrollment!");
      });
  };

  const handleReject = (id) => {
    setisReject(true);
    Config.enrollmentReject(id)
      .then(() => {
        setisReject(false);
        refreshEnrollments();
        closeModal();
        toast.success("Enrollment rejected ");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to reject enrollment!");
      });
  };

  return (
    <div className="md:w-[80%] w-11/12 h-screen bg-black/80 text-white font-urbanist">
      <ToastContainer />
      <h2 className="text-5xl text-center font-urbanist px-5 py-4">
        Enrollments
      </h2>
      <div className="h-full">
        <div className="overflow-y-auto max-h-[75%]">
          {enrollments.length > 0 ? (
            <table className="w-full bg-black/90 border border-gray-600 rounded-lg">
              <thead className="sticky top-0 bg-black/90">
                <tr className="border-b text-center text-[18px] border-gray-700">
                  <th className="px-2 py-4  font-semibold text-gray-200">
                    Username
                  </th>
                  <th className="px-2 py-4  font-semibold text-gray-200">
                    Email
                  </th>
                  {/* <th className="px-2 py-4 text-left font-semibold text-gray-200">
                    Phone
                  </th>
                  <th className="px-2 py-4 text-left font-semibold text-gray-200">
                    Address
                  </th> */}
                  <th className="px-2 py-4 font-semibold text-gray-200">
                    For course
                  </th>
                  <th className="px-4 py-4 text-[18px] font-semibold text-white">
                    Enrollment Date
                  </th>
                  <th className="px-2 py-4 font-semibold text-gray-200">
                    Approved
                  </th>
                  <th className="px-2 py-4 font-semibold text-gray-200">
                    Preferred Date
                  </th>
                  <th className="px-2 py-4 font-semibold text-gray-200">
                    Preferred Time
                  </th>
                  <th className="px-2 py-4 font-semibold text-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, index) => (
                  <tr
                    key={index}
                    className="border-b text-center w-full text-[16px] border-gray-700"
                  >
                    <td className="px-2 py-4  text-gray-300">
                      {enrollment.applier}
                    </td>
                    <td className="px-2 py-4  text-gray-300">
                      {enrollment.applier_email}
                    </td>
                    {/* <td className="px-2 py-4 w-[10%] text-gray-300">
                      {enrollment.applier_phone}
                    </td>
                    <td className="px-2 py-4 w-[10%] text-gray-300">
                      {enrollment.applier_Address}
                    </td> */}
                    <td className="px-2 py-4  text-gray-300">
                      {enrollment.for_course?.course_name}
                    </td>
                    <td className="px-4  py-4 text-gray-300">
                      {new Date(enrollment.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long", // Full month name (e.g., "June")
                          day: "numeric", // Numeric day (e.g., "3")
                          year: "numeric", // Full year (e.g., "2024")
                        }
                      )}
                    </td>

                    <td
                      className={`px-4  py-4 ${
                        enrollment.Approved && !enrollment.Rejected
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      {!enrollment.Approved && !enrollment.Rejected
                        ? "Pending"
                        : enrollment.Approved && !enrollment.Rejected
                        ? "Approved"
                        : "Rejected"}
                    </td>

                    <td className="px-2 py-4  text-gray-300">
                      {enrollment.preferred_date != "--"
                        ? new Date(
                            enrollment.preferred_date
                          ).toLocaleDateString("en-US", {
                            month: "long", // Full month name (e.g., "June")
                            day: "numeric", // Numeric day (e.g., "3")
                            year: "numeric", // Full year (e.g., "2024")
                          })
                        : enrollment.preferred_date}
                    </td>
                    <td className="px-2 py-4  text-gray-300">
                      {enrollment.preferred_time != "--"
                        ? new Date(
                            `1970-01-01T${enrollment.preferred_time}:00Z`
                          ) // Parse the time
                            .toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                        : enrollment.preferred_time}
                    </td>
                    <td className="px-2  py-4">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleViewClick(enrollment)}
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
              No Enrollment available.
            </div>
          )}
        </div>
      </div>

      {showModal && selectedRow && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 flex items-center justify-center z-50">
          <div
            className="bg-white/20 backdrop-blur-md text-black p-8 rounded-3xl w-11/12 md:w-1/2 relative max-h-[90vh] shadow-2xl overflow-y-auto animate-fadeIn"
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
                <span className="text-blue-400">📋</span> Enrollment Details
              </h3>
              <p className="text-gray-300 text-lg">
                Review the application below
              </p>
            </div>

            <hr className="border-gray-600 mb-6" />

            {/* Modal Content */}
            <div className="flex flex-col gap-5 text-gray-200">
              <p>
                <strong className="text-xl font-bold text-white">
                  First Name:
                </strong>{" "}
                <span className="text-lg">{selectedRow.applier}</span>
              </p>
              <p>
                <strong className="text-xl font-bold text-white">Email:</strong>{" "}
                <span className="text-lg">{selectedRow.applier_email}</span>
              </p>
              <p>
                <strong className="text-xl font-bold text-white">Phone:</strong>{" "}
                <span className="text-lg">{selectedRow.applier_phone}</span>
              </p>
              <p>
                <strong className="text-xl font-bold text-white">
                  Address:
                </strong>{" "}
                <span className="text-lg">{selectedRow.applier_Address}</span>
              </p>
              <div>
                <strong className="text-xl font-bold text-white">
                  Message:
                </strong>
                <p className="text-lg mt-1 pl-4 border-l-2 border-blue-500">
                  {selectedRow.message}
                </p>
              </div>
              <div>
                <strong className="text-xl font-bold text-white">
                  For Course:
                </strong>
                <p className="text-lg mt-1">
                  {selectedRow.for_course?.course_name}
                </p>
              </div>
              <p>
                <strong className="text-xl font-bold text-white">
                  Preferred Date:
                </strong>{" "}
                <span className="text-lg">
                  {new Date(selectedRow.preferred_date).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </p>
              <p>
                <strong className="text-xl font-bold text-white">
                  Preferred Time:
                </strong>{" "}
                <span className="text-lg">
                  {new Date(
                    `1970-01-01T${selectedRow.preferred_time}:00Z`
                  ).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </p>
            </div>

            <hr className="border-gray-600 my-6" />

            {/* Reply Section */}
            <div className="mt-6">
              <p className="text-lg font-semibold text-gray-300 mb-2">
                Replying to:{" "}
                <span className="text-white font-bold">
                  {selectedRow.applier_email}
                </span>
              </p>
              <textarea
                ref={replyRef}
                className="w-full h-32 p-4 border border-gray-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Write your reply here..."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() =>
                  handleReply(selectedRow._id, selectedRow.applier_email)
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105"
                disabled={isReply}
              >
                {isReply ? <>Replying... </> : <>Reply</>}
              </button>
              <div className=" flex gap-2 ">
                <button
                  onClick={() => handleReject(selectedRow._id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-transform transform hover:scale-105"
                  disabled={isReject}
                >
                  {isReject ? <>Rejecting... </> : <>Reject</>}
                </button>
                <button
                  onClick={() => handleApprove(selectedRow._id)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-105"
                  disabled={isApproved}
                >
                  {isApproved ? <>Approving... </> : <>Approve</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;
