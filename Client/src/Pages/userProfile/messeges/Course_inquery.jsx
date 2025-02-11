import React, { useEffect, useState } from "react";
import Config from "../../../../Config/Config";
import axios from "axios";



const Course_inquery = () => {
    const [inqs, setInqs] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state to handle API call status
    const [error, setError] = useState(null); // Add error state to capture any errors

    const getDetails = async () => {
      Config.getUserInfo()
        .then((res) => {
          setInqs(res.data[0].inquiries);
          console.log(res.data[0].inquiries);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to fetch data. Please try again later.");
          setLoading(false);
        });
    };

    useEffect(() => {
      getDetails();
    }, []);
  return (
    <div className="w-full bg-[#c4fad9]">
      <div className="py-16 px-6">
        <div className="font-poppins text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-gray-800 pb-8">
          <p className="underline">Course Inquiry</p>
        </div>

        <div className="flex font-urbanist flex-col gap-8 lg:gap-10 scrollbar-custom overflow-y-auto max-h-screen">
          {inqs.filter((inq) => inq.hasOwnProperty("for_course")).map((inq) => (
           
            <div className="flex flex-col  lg:p-8 bg-[#FFF6DE] rounded-lg shadow-xl hover:shadow-2xl transition-all">
              <div className="font-poppins text-xl md:text-2xl lg:text-3xl font-normal text-gray-700">
                <p>{inq.inquiry}</p>
              </div>
              <div className="font-poppins md:text-lg text-md text-gray-800 mt-4">
                <p>
                  <span className="font-light">Answer: </span>
                  {inq.reply}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center mt-5 text-lg md:text-xl">
                <div
                  className={`flex flex-row items-center gap-2 ${
                    inq.reply != null ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <p>
                    {inq.reply != null ? "Answered" : "Not Yet Answered"}
                  </p>
                </div>
                
              </div>
            </div>
               
          ))}
          {/* Repeat similar cards as needed */}
        </div>
      </div>
    </div>
  );
};

export default Course_inquery;
