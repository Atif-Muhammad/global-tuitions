const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const router = express.Router();
const studentModel = require("../../models/studentModel");
const enrollment = require("../../models/enrollmentModel");
const course = require("../../models/coursesModel");
const category = require("../../models/categoriesModel");
const inquiry = require("../../models/inquiryModel");
const feedBack = require("../../models/feedBackModel");
const Question = require("../../models/questionModel"); // Adjust path as necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const coursesModel = require("../../models/coursesModel");
const codes = require("../../models/confirmationCodeModel");
const crypto = require("crypto");

router.post("/signup", async (req, res) => {
  // todo: generate jwt or session for authentication
  const { name, email, password, role, remember } = req.body.data;

  try {
    const user = await studentModel.find({ student_name: name });
    if (user.length > 0) {
      return res.status(400).send("user name is already taken");
    } else {
      const user = await studentModel.find({ email: email });
      if (user.length > 0) {
        return res.status(400).send("email is already taken");
      }
    }
  } catch (err) {
    return res.send(err);
  }

  const saltRounds = 15;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (!err) {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          const studentData = {
            student_name: name,
            email: email,
            password: hash,
            role: role || "User",
          };
          // store this hash in the password section alnong with email in mongoDB
          try {
            var stuDB = await studentModel.create(studentData);

            // (2) generate jwt token and send as cookie back to client
            const secretKey = process.env.SECRET_KEY;
            const payload = {
              id: stuDB._id,
              email: stuDB.email,
              student_name: stuDB.student_name,
              role: stuDB.role,
            };

            // (3) set cookies for client browser

            // res.clearCookie("jwtToken");
            const token = jwt.sign(payload, secretKey, {
              algorithm: "HS256",
              expiresIn: `${remember === "on" ? "30d" : process.env.JWT_EXP}`,
            }); // send an instant email to user
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
              to: email,
              subject: "Thank you!",
              html: `<p>Dear <strong>${req.body.data.student_name}
              </strong>,</p><p>Thank you for signing up with <strong>Global Tuitions</strong>! 🎉</p><p>We're excited to have you on board. Your account has been successfully created, and you're all set to begin your learning journey with us.</p><p style="font-weight: bold; margin: 0; padding: 0;">Here’s what you can do now:</p><ul style="padding-left: 20px; margin-top: 5px;"><li>🔍 <strong>Explore Courses:</strong> Discover courses across multiple categories and levels.</li><li>✅ <strong>Enroll & Learn:</strong> Enroll in your favorite courses and start learning right away.</li><li>📞 <strong>Need Assistance?</strong> Our support team is here to help you anytime.</li></ul><p>We look forward to seeing you succeed and grow with us.</p><p><strong>Welcome to the Global Tuitions family!</strong></p><p>– The <strong>Global Tuitions</strong> Team</p>`,
            };

            try {
              const sentMail = await transporter.sendMail(mailOptions);
              //  console.log(sentMail)
              if (sentMail.accepted != null) {
                // console.log("sending cookie:", token)
                res
                  .cookie("jwtToken", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: false,
                  })
                  .send("Successfully logged in-cookies sent");
              } else {
                res.sendStatus(404);
              }
            } catch (error) {
              console.log(error);
            }
          } catch (err) {
            res.send(err);
          }
        }
      });
    } else {
      res.status(500).send(err);
    }
  });
});

router.post("/signin", async (req, res) => {
  const { email, password, remember } = req.body.data;
  try {
    const stuDetails = await studentModel.findOne({ email: email });
    const passwordDB = stuDetails.password;
    bcrypt.compare(password, passwordDB, (err, result) => {
      if (result) {
        // res.send("Authentic user-Logged in.")
        // generate jwt token and send to user browser
        // best practice in this case is to set the payload for user-id and role(admin or normal-user)
        const payload = {
          id: stuDetails._id,
          email: stuDetails.email,
          student_name: stuDetails.student_name,
          role: stuDetails.role,
        };
        // check the jwtToken on client, whether it is out-dated or not?
        const secretKey = process.env.SECRET_KEY;
        const jwtTokenCheck = req.cookies.jwtToken;
        jwt.verify(jwtTokenCheck, secretKey, async (err, result) => {
          if (err) {
            res.clearCookie("jwtToken");
            const token = jwt.sign(payload, secretKey, {
              algorithm: "HS256",
              expiresIn: `${remember === "on" ? "30d" : process.env.JWT_EXP}`,
            });
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
              to: email,
              subject: "Thank you!",
              html: `<p>Dear <strong>${req.body.data.student_name}
              </strong>,</p><p>Welcome to <strong>Global Tuitions</strong>! 🎉 We're thrilled to have you join our learning community.</p><p>As a member, you now have access to explore our wide range of courses, connect with expert instructors, and take the next step toward your goals.</p><p style="font-weight: bold; margin: 0; padding: 0;">Here’s what you can do next:</p><ul style="padding-left: 20px; margin-top: 5px;"><li>🎓 <strong>Browse Courses:</strong> Find the perfect course to match your goals.</li><li>🗓 <strong>Set Your Preferences:</strong> Choose your preferred study times and learning pace.</li><li>🤝 <strong>Get Support:</strong> Our team is here to help whenever you need!</li></ul><p>Let’s make your learning journey exciting and successful!</p><p><strong>Welcome aboard!</strong></p><p>The <strong>Global Tuitions</strong> Team</p>`,
            };

            try {
              const sentMail = await transporter.sendMail(mailOptions);
              //  console.log(sentMail)
              if (sentMail.accepted != null) {
                res
                  .cookie("jwtToken", token, {
                    httpOnly: true,
                    sameSite: "strict",
                  })
                  .send("Successfully logged in-cookies sent");
              } else {
                res.sendStatus(404);
              }
            } catch (error) {
              console.log(error);
            }
          } else {
            // give access to student
            res.send("Successfully logged in-cookies are already set");
          }
        });
      } else {
        res.status(401).send("Invalid credentials");
      }
    });
  } catch (err) {
    res.status(404).send("User not found-Create account first");
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwtToken", {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  });
  res.send("successfully logged out--Redirecting to index page");
});

router.get("/profile", async (req, res) => {
  try {
    // get the jwt token to get user from collection
    const userToken = req.cookies.jwtToken;

    jwt.verify(userToken, process.env.SECRET_KEY, async (err, decoded) => {
      if (!err) {
        // get student details from students collection using email
        const id = decoded.id;
        // console.log(decoded)
        const student_detail = await studentModel.find({ _id: id }).populate([
          { path: "inquiries" },
          {
            path: "courses_availed",
            populate: {
              path: "for_course",
              populate: { path: "category_id" },
            },
          },
        ]);
        res.status(200).send(student_detail);
      } else {
        // return with an error
      }
    });
  } catch (error) {
    res.send(error);
  }
});

// Endpoint to get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find(); // This fetches all questions
    // console.log(questions)
    res.status(200).send(questions); // Respond with the questions
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions", error: err });
  }
});

router.post("/feedback", async (req, res) => {
  const { student_id, course_id, responses, rating, message } = req.body.data;
  const data = {
    student_id: student_id,
    for_course: course_id,
    feedBack: message,
    rating,
    responses: responses.map((response) => ({
      question: response.questionId,
      answer: response.answer,
    })),
  };
  try {
    // console.log(data)
    const feedback = await feedBack.create(data);
    const updatedCourse = await coursesModel.updateOne(
      { _id: data.for_course },
      { $push: { feedBacks: feedback._id } }
    );
    const updatedStu = await studentModel.updateOne(
      { _id: data.student_id },
      { $push: { feedBacks: feedback._id } }
    );
    // console.log(response)
    res.status(200).json({ message: "Feedback submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving feedback", error: err });
  }
});

router.post("/sendCode", async (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const jwtToken = req.cookies.jwtToken;
    jwt.verify(jwtToken, secretKey, async (err, result) => {
      if (err) {
        return res.send(err);
      }

      const data = {
        for_student: result.id,
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
      };
      const newCode = await codes.create(data);
      if (newCode.code) {
        const userEmail = result.email;
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
          to: userEmail,
          subject: "Here is your confirmation code.",
          text: data.code,
        };

        const sentMail = await transporter.sendMail(mailOptions);
        if (sentMail.accepted != null) {
          res.status(200).send("code sent");
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
});

router.post("/confirmCode", async (req, res) => {
  try {
    const code = req.body.code;
    // console.log(code)
    const secretKey = process.env.SECRET_KEY;
    const jwtToken = req.cookies.jwtToken;
    jwt.verify(jwtToken, secretKey, async (err, result) => {
      if (err) {
        return res.send(err);
      }
      const codeDB = await codes.findOne({ for_student: result.id });
      if (code == codeDB?.code) {
        await codes.deleteOne({ _id: codeDB._id });
        res.status(200).send("matched");
      } else {
        res.status(404).send("not matched");
      }
    });
  } catch (error) {
    res.send(error);
  }
});

router.put("/changePass", async (req, res) => {
  try {
    const pass = req.body.password;
    // console.log(req.cookies.jwtToken)
    const jwtToken = req.cookies.jwtToken;
    const secretKey = process.env.SECRET_KEY;
    // console.log(pass)
    const saltRounds = 15;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (!err) {
        bcrypt.hash(pass, salt, async (err, hash) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            jwt.verify(jwtToken, secretKey, async (err, result) => {
              if (err) {
                return res.clearCookie("jwtToken");
              }
              const id = result.id;

              // store this hash in the password section alnong with email in mongoDB
              try {
                await studentModel.updateOne({ _id: id }, { password: hash });
                // console.log(stuDB)
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
                  to: result.email,
                  subject: "Password Changed",
                  html: `<p>Dear <strong>${req.body.data.student_name}
                  </strong>,</p><p>This is to confirm that your password has been successfully changed on <strong>Global Tuitions</strong>.</p><p>For any questions, feel free to reach out to our support team.</p><p>Thank you,</p><p><strong>Global Tuitions Team</strong></p>`,
                };

                const sentMail = await transporter.sendMail(mailOptions);
                //  console.log(sentMail)
                if (sentMail.accepted != null) {
                  // console.log("sending cookie:", token)
                  res.sendStatus(200);
                } else {
                  res.sendStatus(409);
                }
              } catch (err) {
                res.send(err);
              }
            });
          }
        });
      } else {
        res.status(500).send(err);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

router.put("/changeName", async (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const jwtToken = req.cookies.jwtToken;
    const user_name = req.body.name;

    jwt.verify(jwtToken, secretKey, async (err, result) => {
      if (err) {
        return res.clearCookie("jwtToken", {
          sameSite: "strict",
          secure: false,
          httpOnly: true,
        });
      }
      const id = result.id;
      const updatedUser = await studentModel.updateOne(
        { _id: id },
        { student_name: user_name }
      );
      if (updatedUser.modifiedCount == 1) {
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
          to: result.email,
          subject: "Username Changed",
          html: `<p>Dear <strong>${req.body.data.student_name}
          </strong>,</p><p>Your username has been successfully updated on <strong>Global Tuitions</strong>.</p><p>For any questions, feel free to reach out to our support team.</p><p>Thank you,</p><p><strong>Global Tuitions Team</strong></p>`,
        };

        const sentMail = await transporter.sendMail(mailOptions);
        //  console.log(sentMail)
        if (sentMail.accepted != null) {
          // console.log("sending cookie:", token)
          res.sendStatus(200);
        } else {
          res.sendStatus(409);
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
