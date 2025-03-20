require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const categoriesRoute = require("./routes/categoriesRoutes");
const coursesRoute = require("./routes/coursesRoutes");
const inquiryRoute = require("./routes/inquiryRoutes");
const enrollmentRoute = require("./routes/enrollmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const CheckUser = require("./routes/CheckUser/isLoggedIn");
const subscribeRoutes = require("./routes/subscribeRoutes");
const dashborad = require("./routes/dashboard");
const offers = require("./routes/offers");

// const allowedOrigins = ["http://51.24.30.180:5173", "http://51.24.30.180:5174","https://globaltuitions.co.uk", "https://admin.globaltuitions.co.uk"];

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URI)
  .then((result) => {
    const port = process.env.PORT || 3000;
    app.listen(port, "0.0.0.0", () => {
      console.log("connected to mongoose");
      console.log(`app listenning on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 1. categories
app.use("/api/categories", categoriesRoute);

// 2. courses
app.use("/api/courses", coursesRoute);

// 3.  inquiries
app.use("/api/inquiries", inquiryRoute);

// 4. enrollments
app.use("/api/enrollments", enrollmentRoute);

// 5. students
app.use("/api/student", studentRoutes);

// 6. check user session
app.use("/api/checkSession", CheckUser);

app.use("/api/subscription", subscribeRoutes);

app.use("/api/dashboard", dashborad);

app.use("/api/offers", offers);

app.get("/api/ping", (req, res) => {
  res.status(200).json({ msg: "pong....." });
});
