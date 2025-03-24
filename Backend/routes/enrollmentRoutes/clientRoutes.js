const nodemailer = require("nodemailer");
const express = require("express");
const enrollmentModel = require("../../models/enrollmentModel");
const coursesModel = require("../../models/coursesModel");
const router = express.Router();
const studentModel = require("../../models/studentModel");

router.post("/enroll", async (req, res) => {
  // create the data for enrollment model
  // console.log(req.body.data)
  const Email_regex =
    /[a-zA-Z\d]+[\._]*[a-zA-Z\d]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  if (!Email_regex.test(req.body.data.applier_email)) {
    return res.status(404).send("enter valid email");
  }
  const found = await enrollmentModel.find({
    $and: [
      { applier_email: req.body.data.applier_email },
      { for_course: req.body.data.for_course },
    ],
  });
  if (found.length > 0) {
    return res.status(409).send("Email already enrolled");
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
    const updated_course = await coursesModel.findOneAndUpdate(
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
    // console.log(updated_course)
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: req.body.data.applier_email,
      subject: "Thank you!",
      html: `
      <p>Dear <strong>${req.body.data.applier}</strong>,</p> 
      <p>Congratulations! You’re now officially enrolled in <strong>${updated_course.course_name}</strong> on <strong>Global Tuitions</strong>. We’re excited to have you on this learning journey! </p>
      <p style="font-weight: bold; margin: 0; padding: 0;">Here’s what’s next:</p>
      <ul style="padding-left: 20px; margin-top: 5px;">
        <li>📅 <strong>Class Schedule:</strong> ${req.body.data.preferred_time} | ${req.body.data.preferred_date}</li>
        <li>🤝 <strong>Need Help?</strong> Our support team is here for you!</li>
      </ul>
      <p>Get ready to learn, grow, and achieve your goals. Let’s get started!</p>
      <p><strong>Happy Learning!</strong></p>
      <p>The <strong>Global Tuition</strong> Team</p>
      `,
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
