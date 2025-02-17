import React, { useRef, useState } from "react";
import Config from "../../../Config/Config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Buttonloader from "../buttonLoader/Buttonloader";

const Subscribe = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = {
      subscriber: name,
      email: email,
    };

    Config.subscribe(data)
      .then((res) => {
        if (res === "OK") {
          setLoading(false);
          setName("");
          setEmail("");
          toast.success("Subscribed successfully!");
        } else {
          toast.error("Failed to subscribe. Please try again.", {
            position: "top-right",
            autoClose: 2000,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
        setLoading(false);
      });
  };

  return (
    <div>
      <ToastContainer />

      {/* Join Us Section */}
      <div className="bg-[#A4DCAA] my-5 w-full">
        <div className="flex md:flex-row w-full  flex-col py-10 text-center justify-center items-center px-14">
          <div className=" flex md:justify-end justify-center w-full ">
            <p className="font-extrabold leading-[1] w-[70%] font-readex xl:text-[60px] 2xl:text-[80px] lg:text-[50px] md:text-[35px] text-[30px]">
              Join us to Grow Skills, together!
            </p>
          </div>
          <div className="w-full font-readex flex justify-center ">
            <form
              className="flex flex-col items-start gap-5 py-10"
              onSubmit={handleSubmit}
            >
              <div className="md:text-[35px] w-full text-[25px] font-bold">
                <p className="text-center w-full">GET UPDATES</p>
              </div>
              <div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter Your Name"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter Your Email"
                />
              </div>
              <button
                className="btnbutton py-3 flex justify-center text-sm"
                type="submit"
              >
                {loading ? <Buttonloader /> : <>Get Notified</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
