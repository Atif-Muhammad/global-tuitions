import React, { useEffect, useState } from "react";

import Config from "../../../../Config/Config"
import axios from "axios";
const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  const [formData, setFormData] = useState({
    name: "User Name",
    email: "useremail@gmail.com",
    phone: "098766556577",
    profileImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getDetails = async ()=>{
    Config.getUserInfo().then((res)=>{
      setUserInfo(res.data[0])
    }).catch((err)=>{
      console.log(err);
    })
  }

  useEffect(()=>{
    getDetails()
  }, []);

  return (
    <div className="w-full font-urbanist  ">
      {/* User Information Section */}
      <div className="lg:py-16 md:py-10 py-5 bg-[#c4fad9]">
        <div className="flex flex-col items-center p-5 gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                formData.profileImage ||
                "https://via.placeholder.com/150/000000/FFFFFF/?text=Profile+Image"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full shadow-lg object-cover"
            />
          </div>

          {/* User Details */}
          <div className="text-center">
            <p className="text-[17px] md:text-[20px] lg:text-[22px] xl:text-[24px]">
              Hello
            </p>
            <p className="text-[30px] md:text-[27px] lg:text-[29px] xl:text-[33px] font-bold font-serif text-yellow-500">
              {userInfo.student_name ? (
                <>{userInfo.student_name}</>
              ) : (
                <p>Loading..</p>
              )}
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-gray-700">
                Email
              </label>
              <p className="bg-gray-100 rounded-lg shadow-md p-3 text-lg text-gray-800">
                {userInfo.email ? <>{userInfo.email}</> : <p>Loading..</p>}
              </p>
            </div>
            {/* <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-gray-700">
                Phone
              </label>
              <p className="bg-gray-100 rounded-lg shadow-md p-3 text-lg text-gray-800">
                {userInfo.applier_phone}
              </p>
            </div> */}
          </div>

          {/* Edit Button */}
          {/* <button
            className="py-2 px-4 bg-black text-white rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Edit Information
          </button> */}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Information</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false); // Close modal after save
              }}
            >
              {/* Name */}
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.student_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Phone */}
              {/* <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div> */}

              {/* Profile Image */}
              <div className="mb-4">
                <label className="block mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
