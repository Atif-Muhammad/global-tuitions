import React from "react";
import "./Loader.css";

const Loader = ({ size = 80, color = "#6066FA" }) => {
  return (
    <div className="loader-container">
      <div
        className="book-loader"
        style={{ width: size, height: size, borderColor: color }}
      >
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
      </div>
      <p className="loader-text" style={{ color }}>
        Loading Knowledge...
      </p>
    </div>
  );
};

export default Loader;
