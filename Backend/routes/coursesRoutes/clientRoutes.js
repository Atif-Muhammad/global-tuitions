const express = require('express');
const coursesModel = require('../../models/coursesModel');
const courseContentsModel = require('../../models/courseContentsModel');
const categoryModel = require('../../models/categoriesModel')

const router = express.Router();


// 1. course by id
router.get('/course', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const courses = await coursesModel.findOne({_id: course_id});
        res.status(200).send(courses);
    } catch (error) {
        res.send(error)
    }
});

router.get("/enabled", async (req, res) => {
  const order_val = req.query.order;
  try {
    const courses = await coursesModel
      .find({ $and: [{ enabled_flag: true }, { deleted: false }] })
      .populate("category_id")
      .populate("course_contents")
      .sort({ sort_value: Number(order_val) });
    // console.log(courses)
    res.status(200).send(courses);
  } catch (error) {
    res.send(error);
  }
});
// 3. enabled popular courses
router.get("/enabled/popular", async (req, res) => {
    const order_val = req.query.order;
    try {
      const courses = await coursesModel
        .find({ enabled_flag: true, popular: true })
        .populate("category_id")
        .sort({ sort_value: Number(order_val) });
      res.status(200).send(courses);
    } catch (error) {
      res.send(error);
    }
});

router.get('/course/enabled/content', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const contents = await coursesModel.findOne({_id: course_id}).populate("category_id").populate("course_contents");
        // console.log(contents)
        res.send(contents);
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;