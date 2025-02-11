import React, { useEffect, useState } from "react";
import Config from "../../../config/Config";
import { useRef } from "react";
import { toast } from "react-toastify";

const Subscriber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState([]); // Track selected emails
  const [subscribers, setSubscribers] = useState([]);
  const msgRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getSubs = () => {
    Config.getSubscribers()
      .then((res) => {
        setSubscribers(res.reverse());
        const defaultEmails = res.map((subscriber) => subscriber.email);
        setEmails(defaultEmails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSubs();
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (email, isChecked) => {
    setEmails((prevEmails) => {
      if (isChecked) {
        return [...prevEmails, email];
      } else {
        return prevEmails.filter((item) => item !== email);
      }
    });
  };

  const handleSendMessage = () => {
    // check email array has emails or not, if not show toast
    if (emails.length == 0) return alert("Please select at least one email");
    if (msgRef.current.value === "") return alert("Please enter your message");

    const payload = {
      emails,
      msg: msgRef.current.value,
    };

    Config.sendMsgToSubs(payload)
      .then((res) => {
        console.log(res);
        setEmails([]); // Clear selected emails
        setMessage("");
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="w-full font-urbanist bg-black">
        <div className="font-poppins px-4 sticky top-0 bg-gray-800 z-30 py-7 flex justify-between font-bold text-white">
          <p className="text-4xl ml-5 font-urbanist">Subscribers</p>
          <button
            onClick={openModal}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600"
          >
            Message
          </button>
        </div>

        {/* Subscribers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-black text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-6 py-3 text-left text-lg">First Name</th>
                <th className="px-6 py-3 text-left text-lg">Email</th>
                <th className="px-6 py-3 text-left text-lg">Status</th>
                <th className="px-6 py-3 text-left text-lg">Selection</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-600 hover:bg-blue-500/20"
                >
                  <td className="px-6 py-4 text-base">
                    {subscriber.subscriber}
                  </td>
                  <td className="px-6 py-4 text-base">{subscriber.email}</td>
                  <td
                    className={`px-6 py-4 text-base ${
                      subscriber.active ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {subscriber.active ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-base text-green-500">
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) =>
                        handleCheckboxChange(subscriber.email, e.target.checked)
                      }
                      checked={emails.includes(subscriber.email)} // Sync with emails state
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Sending Message */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-lg w-11/12 md:w-1/3 relative shadow-lg transform transition-all duration-300 ease-in-out">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              X
            </button>
            <h3 className="text-2xl text-center font-semibold text-gray-800 mb-6">
              Send Message
            </h3>
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-gray-700"
              placeholder="Write your message here..."
              ref={msgRef}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscriber;
