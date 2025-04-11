import React from "react";
import Sidebar from "./components/Sidebar";
import "./index.css"
 


const App = () => {
  return (
    <div className=" h-screen w-screen overflow-x-hidden ">
      <p className="text-gray-400 w-full text-[35px] bg-gray-900  font-bold p-4 font-urbanist">
        Global Tuitions
      </p>
      <div className="flex  md:flex-row flex-col">
      
        <Sidebar />  
      </div> 
    </div> 
  ); 
};

export default App;  
