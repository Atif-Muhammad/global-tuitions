const nodemailer = require("nodemailer");
const express = require("express");
const enrollmentModel = require("../../models/enrollmentModel");
const coursesModel = require("../../models/coursesModel");
const router = express.Router();
const studentModel = require("../../models/studentModel");

router.post("/enroll", async (req, res) => {
  // create the data for enrollment model
  const Email_regex =
    /[a-zA-Z\d]+[\._]*[a-zA-Z\d]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  if (!Email_regex.test(req.body.data.applier_email)) {
    return res.status(404).send("enter valid email");
  }
  const found = await enrollmentModel.find({$and: [{applier_email: req.body.data.applier_email}, {for_course: req.body.data.for_course}]})
  if(found.length > 0){
    return res.status(409).send("Email already enrolled")
  }

  try {
    // create enrollment
    const created_enrollment = await enrollmentModel.create(req.body.data);
    // console.log(created_enrollment)

    // update the student model
    await studentModel.updateOne(
      { email: created_enrollment.applier_email },
      { $push: { courses_availed: created_enrollment._id } }
    );

    // update course model
    const updated_course = await coursesModel.updateOne(
      { _id: created_enrollment.for_course },
      { $push: { enrollments: created_enrollment._id } }
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });
    // create email message
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: req.body.data.applier_email,
      subject: "Thank you!",
      text: "Thank you for you query, we will get back to you soon. regards imperial tuitions",
    };

    try {
      const sentMail = await transporter.sendMail(mailOptions);
      //  console.log(sentMail)
      if (sentMail.accepted != null) {
        res.send(200);
      } else {
        res.send(404);
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
