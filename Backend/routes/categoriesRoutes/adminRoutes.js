const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const categoriesModel = require('../../models/categoriesModel');
const coursesModel = require('../../models/coursesModel')


// 1. all categories---ascending with sortby                         
// route: /categories?order=-1 -----> (-1 desc & 1 asc)
router.get('/', async (req, res) => {
    
    const order_val = req.query?.order;
    try {
        const categories = await categoriesModel.find({deleted: false}).sort({ sort_value: Number(order_val) });
        res.status(200).send(categories)
    } catch (error) {
        res.send(error)
    }
});

router.get('/enabled', async (req, res)=>{     
    const order_val = req.query?.order;                       
    try {
        const enabled_categories = await categoriesModel.find({$and:[{enabled_flag: true}, {deleted: false}]}).populate('courses').sort({sort_value: Number(order_val)});
        res.status(200).send(enabled_categories);
    } catch (error) {
        res.send(error);
    }
});

// 3. add category                                                     
router.post('/addCategory', async (req, res) => {
    // console.log(req.body.data)
    // check whether a category name already exist
    const cat_name = req.body?.data.category_name;
    
    const found_category = await categoriesModel.find({ $and:[
        {category_name: cat_name}, {deleted: false}
    ]});
    if (found_category.length > 0) {
        return res.status(409).send("category already exists");
    }
    try {
        const added_category = await categoriesModel.create(req.body?.data);
        res.status(200).send(added_category);
    } catch (error) {
        res.send(error);
    }
});

// post free category
router.post('/freeCourses', async (req, res)=>{
    // console.log(req.body)
    const cat_name = await req.body?.category_name;
    const found_category = await categoriesModel.find({
        category_name: cat_name,
    });
    if (found_category.length > 0) {
        return res.status(409).send("category already exists");
    }
    try {
        const added_category = await categoriesModel.create(req.body);
        res.status(200).send(added_category);
    } catch (error) {
        res.send(error);
    }
})

// get free category 
router.get('/freeCategory', async (req, res)=>{
    try {
        const free_category = await categoriesModel.findOne({category_name: "Free Courses"});
        // console.log(free_category)
        res.send(free_category)
    } catch (error) {
        res.send(error)
    }
})

// 4. update categories
router.put('/category/update', async (req, res) => {
    const id_of_update = req.body?.data._id;
    const updated_data = {
      category_name: req.body?.data?.category_name,
      enabled_flag: req.body?.data?.enabled_flag,
      sort_value: req.body?.data?.sort_value,
    };
    try {
        const updated = await categoriesModel.updateOne({ _id: id_of_update }, updated_data);
        res.status(200).send(updated)
    } catch (error) {
        res.send(error)
    }
});

// 5. delete category by id
router.put('/category/removeCategory', async (req, res) => {
    const cat_id = req.body?.id;
    try {
        const category = await categoriesModel.findOne({_id: cat_id});
        if(category != null){
            await categoriesModel.updateOne({ _id: cat_id }, {$set: {deleted : true}});
            const deleted_courses = await coursesModel.updateMany({ category_id: cat_id }, {$set: {deleted: true}});
            return res.status(200).send(deleted_courses);
        }else{
            res.status(404).send("Category not found")
        }
        
    } catch (error) {
        res.send(error);
    }
});
// 5. delete category by id
router.delete('/category/delCategory', async (req, res) => {
    const cat_id = req.query?.id;
    try {
        const category = await categoriesModel.findOne({_id: cat_id});
        if(category != null){
            await categoriesModel.deleteOne({ _id: cat_id });
            const deleted_courses = await coursesModel.deleteMany({ category_id: cat_id });
            return res.status(200).send(deleted_courses);
        }else{
            res.status(404).send("Category not found")
        }
        
    } catch (error) {
        res.send(error);
    }
});

router.put('/category/recover', async (req, res)=>{
    const cat_id = req.body?.id;
    try {
        const category = await categoriesModel.findOne({_id: cat_id});
        if(category != null){
            await categoriesModel.updateOne({ _id: cat_id }, {$set: {deleted: false}});
            return res.status(200);
        }else{
            res.status(404).send("Category not found")
        }
    } catch (error) {
        res.send(error)
    }
})

router.get('/deletedCategories', async (req, res)=>{
    try {
        const cats = await categoriesModel.find({deleted: true}).sort({sort_value: 1});
        res.send(cats)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router;