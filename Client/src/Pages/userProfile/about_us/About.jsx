import React from "react";
import { FaChalkboardTeacher, FaLaptop, FaCertificate } from "react-icons/fa"; // Imported icons for animation

const AboutUs = () => {
  return (
    <section className="bg-[#c4fad9] py-16 px-6 md:px-12">
      <div className="container font-urbanist mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-blue-700 mb-6">
          Premium Online Tuition Services for Your Success
        </h2>
        <p className="text-lg text-gray-600 mb-8 mx-auto max-w-2xl">
          Unlock your potential with personalized online tuition that adapts to
          your learning needs. Get access to expert tutors and a flexible
          learning experience, all from the comfort of your home.
        </p>

        {/* Mission Section */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-800">
              Our Mission
            </h3>
            <p className="text-gray-600 text-lg mx-auto max-w-2xl">
              Our mission is to deliver top-notch education and personalized
              tutoring services to help students achieve academic success. We
              believe in making learning enjoyable, effective, and flexible.
            </p>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-800">
              What We Offer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="flex flex-col items-center bg-white shadow-lg p-8 rounded-xl hover:scale-105 transform transition duration-500 ease-in-out">
                <FaChalkboardTeacher
                  size={60}
                  className="text-blue-600 mb-4 animate-bounce"
                />
                <h4 className="text-xl font-semibold text-gray-800">
                  Experienced Tutors
                </h4>
                <p className="text-gray-600 text-lg mt-2 text-center">
                  Learn from the best educators in every field, with years of
                  experience and a passion for teaching.
                </p>
              </div>
              {/* Service 2 */}
              <div className="flex flex-col items-center bg-white shadow-lg p-8 rounded-xl hover:scale-105 transform transition duration-500 ease-in-out">
                <FaLaptop
                  size={60}
                  className="text-blue-600 mb-4 animate-pulse"
                />
                <h4 className="text-xl font-semibold text-gray-800">
                  Online Flexibility
                </h4>
                <p className="text-gray-600 text-lg mt-2 text-center">
                  Study anywhere, anytime. Our flexible online sessions are
                  designed to fit your schedule and learning style.
                </p>
              </div>
              {/* Service 3 */}
              <div className="flex flex-col items-center bg-white shadow-lg p-8 rounded-xl hover:scale-105 transform transition duration-500 ease-in-out">
                <FaCertificate
                  size={60}
                  className="text-blue-600 mb-4 animate-ping"
                />
                <h4 className="text-xl font-semibold text-gray-800">
                  Certification
                </h4>
                <p className="text-gray-600 text-lg mt-2 text-center">
                  Receive certificates upon completion of your courses, showing
                  your accomplishments and progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Ready to elevate your learning journey? Start your online tuition
            with us today!
          </p>
          <button className="bg-blue-600 text-white py-3 px-10 rounded-lg text-lg hover:bg-blue-700 transition ease-in-out duration-300 shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
