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

router.get('/landingCourses', async (req, res)=>{
  try {
    const courses = await coursesModel.find({ $and: [{ enabled_flag: true }, { deleted: false }] },{
      course_name: 1, date: 1, time:1, price: 1, course_description: 1, rating: 1, course_level:1, course_duration: 1, popular:1, category_id: 1, course_contents:1
    })
    .populate({
      path: "category_id",
      select: "category_name enabled_flag"
    })
    .sort({ sort_value: 1 });
    res.send(courses)
  } catch (error) {
    res.send(error)
  }
});

router.get("/enabled", async (req, res) => {
  try {
    const courses = await coursesModel
      .find({ $and: [{ enabled_flag: true }, { deleted: false }] })
      .populate("category_id")
      .populate("course_contents")
      .sort({ sort_value: 1 }); 

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