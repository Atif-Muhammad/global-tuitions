const express = require('express');
const enrollmentModel = require('../../models/enrollmentModel');
const coursesModel = require('../../models/coursesModel');
const router = express.Router();
const nodemailer = require("nodemailer");
const studentModel = require('../../models/studentModel');

router.get('/', async (req, res) => {
    try {
        const data = await enrollmentModel.find({}).populate("for_course", "course_name");
        res.status(200).send(data)
    } catch (error) {
        res.send(error);
    }
})
router.get('/course/enrollments', async (req, res) => {

    try {
        const data = await enrollmentModel
          .find({ for_course: req.query?.id })
          .populate("for_course", "course_name");
        res.status(200).send(data)
    } catch (error) {
        res.send(error);
    }
})


router.post('/enrollmentReply', async (req, res) => {
    // console.log(req.body)
    try {
        const enrollment = await enrollmentModel.find({ _id: req.body?.data?.id });

        if (enrollment) {
            await enrollmentModel.updateOne({_id: req.body?.data?.id}, {viewed_flag: true})
            // send an instant email to user
            // create transporter
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
                to: req.body?.data?.email,
                subject: "Regarding your Enrollment",
                text: req.body?.data?.msg,
            };

            const sentMail = await transporter.sendMail(mailOptions);
            // console.log(sentMail)
            if (sentMail.accepted != null) {
                // update inquiry collection for reply
                enrollment[0].Reply = req.body?.data?.msg;
                enrollment[0].replied_flag = !enrollment[0].replied_flag; 
                await enrollment[0].save();
                res.sendStatus(200);
            }
            
            
        }
    } catch (error) {
        res.send(error)
    }
})

router.put('/approval', async (req, res) => {
    // console.log(req.body)
    try {
        const enrollment = await enrollmentModel
          .find({ _id: req.body?.id })
          .populate("for_course");
        // console.log("dsad",enrollment)
        if (enrollment) {
            await enrollmentModel.updateOne(
              { _id: req.body?.id },
              { viewed_flag: true }
            );
            const student = await studentModel.find({email: enrollment[0].applier_email})
            // send an instant email to user
            // create transporter
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
                to: enrollment[0].applier_email,
                subject: "You’re In! Your Enrollment is Confirmed",
                html: `
                <h2">Dear ${student[0].student_name},</h2>
                <p>
                Congratulations! Your enrollment at <strong>Global Tuitions</strong> for course ${enrollment[0].for_course.course_name} is confirmed ✅. You’re all set to begin your learning journey with us.
                </p>
                <p>Here’s what you can expect:</p>
                <ul>
                    <li>✔️ Access to the best online courses in your field 🎓</li>
                    <li>✔️ Interactive lessons and expert guidance 📚</li>
                    <li>✔️ Personalized learning support from our tutors ✨</li>
                </ul>
                <p>
                We're thrilled to have you as part of our community! If you ever have any questions, feel free to reach out at <a href="mailto:sixpmmediaofficial@gmail.com">sixpmmediaofficial@gmail.com</a>.
                </p>
                <p>
                <strong>Happy Learning!</strong><br>
                <strong>Global Tuitions</strong><br>
                <a href="http://51.24.30.180/5173" >Visit our Website</a> 
                </p>
                `,
            };

            const sentMail = await transporter.sendMail(mailOptions);
            // console.log(sentMail)
            if (sentMail.accepted != null) {
                // update inquiry collection for reply
                enrollment[0].Approved = true;
                enrollment[0].Rejected = false
                await enrollment[0].save();
                res.sendStatus(200);
            }
            
            
        }
    } catch (error) {
        res.send(error)
    }
})

router.put('/rejection', async(req, res)=>{
    try {
        const enrollment = await enrollmentModel
          .find({ _id: req.body?.id })
          .populate("for_course");
        if (enrollment) {
            await enrollmentModel.updateOne(
              { _id: req.body?.id },
              { viewed_flag: true }
            );
            const student = await studentModel.find({email: enrollment[0].applier_email})
            // console.log(enrollment)
            // send an instant email to user
            // create transporter
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
                to: enrollment[0].applier_email,
                subject: "Enrollment Rejected",
                html: `
                <h2">Dear ${student[0].student_name},</h2>
                <p>
                Your enrollment at <strong>Global Tuitions</strong> for course ${enrollment[0].for_course.course_name} is rejected for some reason. Kindly contact us via email. <a>href="mailto:sixpmmediaofficial@gmail.com">sixpmmediaofficial@gmail.com</a>.
                </p>
                <p>
                <strong>Happy Learning!</strong><br>
                <strong>Global Tuitions</strong><br>
                <a href="http://51.24.30.180/5173" >Visit our Website</a> 
                </p>
                `,
            };

            const sentMail = await transporter.sendMail(mailOptions);
            // console.log(sentMail)
            if (sentMail.accepted != null) {
                // update inquiry collection for reply
                enrollment[0].Rejected = true; // Toggle the value
                enrollment[0].Approved = false
                await enrollment[0].save();
                res.sendStatus(200);
            }
            
            
        }
    } catch (error) {
        res.send(error)
    }
})



module.exports = router;