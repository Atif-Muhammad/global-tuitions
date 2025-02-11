import React, { useEffect, useRef, useState } from "react";
import axios from "axios"; // Make sure axios is installed for API requests
import Config from "../../../../Config/Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = ({ closeFeedback, course, info }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]); // To store answers for each question
  const msgRef = useRef("");

  useEffect(() => {
    // Fetch the questions when the component is mounted
    Config.getQuestions()
      .then((res) => {
        if (res.status === 200) {
          // console.log(res)
          setQuestions(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleRating = (value) => {
    setRating(value); // Update the rating when a star is clicked
  };

  const handleAnswerChange = (questionId, answer) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      const index = newResponses.findIndex((r) => r.questionId === questionId);
      if (index !== -1) {
        newResponses[index].answer = answer;
      } else {
        newResponses.push({ questionId, answer });
      }
      return newResponses;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const feedBack = {
      course_id: course.for_course?._id,
      student_id: info._id,
      rating: rating,
      message: message,
      responses: responses,
    };

    if (rating == 0 || rating == null) {
      return toast.warning("Please rate our service....");
    }

    // console.log(feedBack);
    // Send the feedback to the backend
    Config.postFeedBack(feedBack)
      .then((res) => {
        if (res.status === 200) {
          closeFeedback();
          toast.success("Thank you for your feedback.");
        } else {
          toast.error("Cannot submit feedback.");
        }
      })
      .catch((err) => {
        toast.error("Cannot submit feedback.");
        console.log(err);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute w-full flex justify-end backdrop-blur-sm top-0 left-0 right-0 bottom-0 z-50">
        <div className="py-10 px-5 border w-full max-w-[60%] bg-[#c4fad9] shadow-lg rounded-lg m-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-poppins text-2xl md:text-3xl underline">
              Give Your Feedback
            </h2>
            <button
              onClick={closeFeedback}
              className="text-2xl font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>

          {/* Feedback Form */}
          <div className="text-sm md:text-base font-poppins">
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-lg shadow-lg bg-gradient-to-b from-[#FFF0C7] to-[#FFF6DE]">
                <p>{course.for_course.course_name}</p>
              </div>
              <div className="p-3 rounded-lg shadow-lg bg-gradient-to-b from-[#FFF0C7] to-[#FFF6DE]">
                <textarea
                  value={message}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Give Your Feedback"
                  className="w-full h-24 p-2 bg-transparent rounded resize-none focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* Question Section */}
            <div className="mt-8">
              <h3 className="font-poppins text-[25px] md:text-[28px] lg:text-[31px] xl:text-[34px] pb-5 underline">
                Please Answer these Questions
              </h3>
              <div className="flex flex-col gap-4 lg:gap-7 w-full ">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <div
                      key={question._id}
                      className="flex flex-col gap-2 p-5 lg:p-7 rounded-lg shadow-lg bg-gradient-to-b from-[#FFF0C7] to-[#FFF6DE]"
                    >
                      <p>{question.questionText}</p>{" "}
                      {/* Accessing the first element of the array */}
                      <textarea
                        placeholder="Answer :"
                        required
                        className="w-full h-20 bg-transparent rounded resize-none focus:outline-none"
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        } // Capture the answer
                      />
                    </div>
                  ))
                ) : (
                  <p>Loading questions...</p>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="mt-10 text-center">
              <h3 className="text-[38px] font-poppins mb-4">
                Please give rating
              </h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`text-3xl ${
                      rating >= star ? "text-black" : "text-gray-400"
                    } hover:text-black transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                className="py-2 px-4 bg-black text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
