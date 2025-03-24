require("dotenv").config();
const express = require("express");
const router = express.Router();
const inquiryModel = require("../../models/inquiryModel");
const coursesModel = require("../../models/coursesModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const studentModel = require("../../models/studentModel");
const validator = require("email-validator");
const { default: mongoose } = require("mongoose");

// create an inquiry--general or course-specific
router.post("/postInquiry", async (req, res) => {
  const Email_regex =
    /[a-zA-Z\d]+[\._]*[a-zA-Z\d]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  if (!Email_regex.test(req.body.data.email)) {
    return res.status(404).send("enter valid email");
  }
  // console.log(req.body)
  const course_id = req.body.data.for_course;
  const userJwt = req.cookies.jwtToken;
  // console.log(userJwt)


  var user_id = null;

  if (userJwt) {
    // decode the jwt for user id
    jwt.verify(userJwt, process.env.SECRET_KEY, async (err, decoded) => {
      if (decoded) {
        user_id = decoded.id;
      } else {
        user_id = null;
      }
    });
  }
  if (course_id) {
    
    // return res.send("set the inquiry for course")
    const inq_details = {
      inquiry_by: req.body.data.inquiry_by,
      email: req.body.data.email,
      for_course: course_id,
      inquiry: req.body.data.inquiry,
      inquiry_by_id: user_id,
    };
    try {
      const added_inq = await inquiryModel.create(inq_details);

      await coursesModel.updateOne(
        { _id: inq_details.for_course },
        { $push: { inquiries: added_inq._id } }
      );
      await studentModel.updateOne(
        { _id: user_id },
        { $push: { inquiries: added_inq._id } }
      );
      res.status(200);
    } catch (error) {
      res.send(error);
    }
  } else {
    const inq_details = {
      inquiry_by: req.body.data.inquiry_by,
      email: req.body.data.email,
      phone: req.body.data.phone,
      inquiry: req.body.data.inquiry,
      inquiry_by_id: user_id,
    };
    // console.log(inq_details)
    // console.log(user_id)
    try {
      const added_inq = await inquiryModel.create(inq_details);
      await studentModel.updateOne(
        { _id: user_id },
        { $push: { inquiries: added_inq._id } }
      );
      res.status(200);
    } catch (error) {
      res.send(error);
    }
  }

  // send an instant email to user
  // create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS,
    },
  });
  if(course_id){
    course_name = await coursesModel.findOne({_id: course_id}).select("course_name")
  }
  // create email message
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: req.body.data.email,
    subject: "Thank you!",
    html: `<p>Dear <strong>${req.body.data.inquiry_by}
    </strong>,</p><p>Thank you for reaching out to <strong>Global Tuitions</strong>. We have received your inquiry and our team will get back to you shortly.</p>
    ${
      course_name
        ? `<p><strong>Course Inquiry:</strong> ${course_name.course_name}</p>`
        : ""
    }
    <p style="font-weight: bold; margin: 0; padding: 0;">What happens next?</p><ul style="padding-left: 20px; margin-top: 5px;"><li>⏳ <strong>Response Time:</strong> We typically respond within 24-48 business hours.</li></ul><p>We appreciate your interest and look forward to assisting you soon!</p><p><strong>Best Regards,</strong></p><p>The <strong>Global Tuitions</strong> Team</p>`,
  };

  try {
    const sentMail = await transporter.sendMail(mailOptions);
    //  console.log(sentMail)
    if (sentMail.accepted != null) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
