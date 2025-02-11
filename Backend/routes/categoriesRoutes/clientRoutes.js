const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const categoriesModel = require('../../models/categoriesModel');


// 1. category by id         
router.get('/category', async (req, res)=>{
    try {
        const category = await categoriesModel.findOne({_id: req.query.id});
        res.status(200).send(category)
    } catch (error) {
        res.send(error)
    }
});

router.get("/enabled", async (req, res) => {
  const order_val = req.query.order;
  try {
    const enabled_categories = await categoriesModel
      .find({ enabled_flag: true, deleted: false })
      .populate({ path: "courses", populate: { path: "course_contents" } })
      .sort({ sort_value: Number(order_val) });
    // console.log(enabled_categories)
    res.status(200).send(enabled_categories);
  } catch (error) {
    res.send(error);
  }
});

// 3. enabled courses of the requested category                     
// courses in ascending or descending
router.get('/category/courses/enabled', async (req, res)=>{
    const category_id = new mongoose.Types.ObjectId(req.query.id);
    try {
        const cat_courses = await categoriesModel.aggregate([
            {$match: {_id: category_id}},
            {$lookup: {
                from: 'courses', // name of the collection to join
                localField: 'courses',
                foreignField: '_id',
                as: 'course_details' //output array containing all fields
            }},{
                $unwind: "$course_details"
            },{
                $sort: {"course_details.sort_value": Number(req.query.order)}
            },{
                $match: {"course_details.enabled_flag": true}
            },{
                $group: {
                    _id: "$_id",
                    category_name: {$first: "$category_name"},
                    enabled_flag: {$first: "$enabled_flag"},
                    category_description: { $first: "$category_description" },
                    sort_value: { $first: "$sort_value" },
                    courses: { $push: "$course_details" } 
                }
            }
        ])
        res.status(200).send(cat_courses)
    }catch (error) {
        res.send(error);
    }
});

module.exports = router;