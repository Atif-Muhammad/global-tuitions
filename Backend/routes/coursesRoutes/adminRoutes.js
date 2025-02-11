const express = require('express');
const coursesModel = require('../../models/coursesModel');
const categoriesModel = require('../../models/categoriesModel');
// const courseDetailsModel = require('../../models/courseDetailsModel');
const courseContentsModel = require('../../models/courseContentsModel');

const router = express.Router();


// 1. all courses----- asc or desc
// route: /courses?order=-1
router.get('/', async (req, res) => {
    const order_val = req.query.order
    try {
        // console.log(await coursesModel.find({}))
        const courses = await coursesModel.find({deleted: false}).populate('category_id').populate("course_contents").sort({ sort_value: Number(order_val) });
        // console.log("fff", courses)
        res.status(200).send(courses);
    } catch (error) {
        res.send(error)
    }
});
router.get('/getDelCourses', async (req, res) => {
    const order_val = req.query.order
    try {
        // console.log(await coursesModel.find({}))
        const courses = await coursesModel.find({deleted: true}).populate('category_id').populate("course_contents").sort({ sort_value: Number(order_val) });
        // console.log("fff", courses)
        res.status(200).send(courses);
    } catch (error) {
        res.send(error)
    }
});

// 2. All enabled courses --- asc and desc
router.get('/enabled', async (req, res) => {
    const order_val = req.query.order;
    try {
        const courses = await coursesModel.find({$and:[{enabled_flag: true}, {deleted: false}]}).populate('category_id', 'category_name').sort({ sort_value: Number(order_val) });
        res.status(200).send(courses);
    } catch (error) {
        res.send(error)
    }
});

// 2. add course
router.post('/addCourse', async (req, res) => { 
    // check whether the course already exist?
    const { newCourse, includedItems } = req.body.data;
    // Validate input
    // if (!newCourse || !courseDetails) {
    //     return res.status(400).send("Invalid request. Missing course or course details.");
    // }

    // console.dir(newCourse, {depth: null})
    // console.dir(includedItems, {depth: null})

    const name = newCourse.course_name;
    const found_course = await coursesModel.find({ $and: [{course_name: name}, {deleted: false}] });
    if (found_course.length > 0) {
        return res.status(409).send("course already exists");
    }
    
    // check if the course title already exists or not
    // console.log(newCourse)
    try {
        const added_course = await coursesModel.create(newCourse);

        // update category model for course id
        await categoriesModel.updateOne(
            { _id: newCourse.category_id },
            { $push: { courses: added_course._id } }
        );

        // make contents
        const added_course_contents = includedItems.map((content) => ({
            topic: content.name,
            sort_value: content.sort,
            enabled_flag: content.enabled,
            content_description: content.description,
            course_id: added_course._id,
        }));

        const added_contents = await courseContentsModel.create(
            added_course_contents
        );
        // update the courseModel for content id
        added_contents.map(async (added_content) => {
            await coursesModel.updateOne(
                { _id: added_course._id },
                { $push: { course_contents: added_content._id } }
            );
        });

        return res.status(200).send({ success: true });
    } catch (error) {
        res.send(error);
    }
});

// 3. update course popularity
router.put('/course/update/popular', async (req, res) => {
    const course_id = req.body.id;
    try {
        const course = await coursesModel.findOne({ _id: course_id });
        if(course){
            course.popular = !course.popular;
            await course.save()
            res.status(200).send(course);
        }
    } catch (error) {
        res.send(error)
    }


})

// 4. update course
router.put('/course/update', async (req, res) => {
    // console.log(req.body.data)
    const id_of_update = req.body.data._id;
    

    
    const updated_data = {
        course_name: req.body.data.course_name,
        enabled_flag: req.body.data.enabled_flag,
        sort_value: req.body.data.sort_value,
        date: req.body.data.date && req.body.data.date,
        time: req.body.data.time && req.body.data.time,
        price: req.body.data.price && req.body.data.price,
        course_description: req.body.data.course_description,
        rating: req.body.data.rating && req.body.data.rating,
        course_level: req.body.data.course_level,
        course_duration: req.body.data.course_duration,
        category_id: req.body.data.category_id
    };


    // console.log(updated_data, ":::", id_of_update)
    try {
        const updated = await coursesModel.updateOne({ _id: id_of_update }, updated_data);
        // update the courses field in category model
        const updatedCategory = await categoriesModel.updateOne({ courses: id_of_update }, { $pull: { courses: id_of_update } });
        // console.log(updatedCategory)
        await categoriesModel.updateOne({ _id: updated_data.category_id }, { $push: { courses: id_of_update } });
        res.status(200).send(updated);    
    } catch (error) {
        res.send(error)
    }

});

// 5. update
router.put("/course/detailsupdate", async (req, res) => {

    // get skills field
    const skills = req.body.data.skills;
    const course_contents = req.body.data.course_contents;
    try {
        
        // Prepare bulk operations for course contents
        const operations = course_contents.map((content) => {
            if (content._id) {
                // Update operation for existing content
                return {
                    updateOne: {
                        filter: { _id: content._id, course_id: req.body.data._id },
                        update: { $set: content },
                    },
                };
            } else {
                // Insert operation for new content
                return {
                    insertOne: {
                        document: { ...content, course_id: req.body.data._id },
                    },
                };
            }
        });

        // Perform bulkWrite operation
        const result = await courseContentsModel.bulkWrite(operations);

        // Combine existing and inserted IDs
        const existingIds = course_contents
            .filter((content) => content._id)
            .map((content) => content._id);
        const insertedIds = Object.values(result.insertedIds);
        const allContentIds = [...existingIds, ...insertedIds];

        // Update course with all content IDs and skills
        const updatedCourse = await coursesModel.updateOne(
            { _id: req.body.data._id },
            { $set: { course_contents: allContentIds, skills: skills } },
        );

        return res.status(200).send(updatedCourse);
    } catch (error) {
        console.error("Error updating course details or contents:", error);
        return res.status(500).send({ message: "Internal Server Error", error });
    }
});

// 6. delete course
router.delete('/course/delCourse', async (req, res) => {
    
    const course_id = req.query.id;
    if (!course_id) {
        return res.status(400).send({ error: "Course ID is required." });
    }
    try {
        const course_found = await coursesModel.find({_id: course_id})
        if (course_found == null) {
            return res.status(404).send({ error: "Course not found." });
        }
        await coursesModel.deleteOne({ _id: course_id });
        // Update the categories to remove the course          
        await categoriesModel.updateOne({ courses: course_id }, { $pull: { courses: course_id } });
                    
        // delete the content document
        const deleted = await courseContentsModel.deleteMany({ course_id: course_id });
        return res.status(200).send(deleted);
                    
        
    } catch (error) {
        return res.send(error);
    }
});
router.put('/course/remCourse', async (req, res) => {
    const course_id = req.body.id;
    if (!course_id) {
        return res.status(400).send({ error: "Course ID is required." });
    }
    try {
        const course_found = await coursesModel.find({_id: course_id})
        if (course_found == null) {
            return res.status(404).send({ error: "Course not found." });
        }
        await coursesModel.updateOne({ _id: course_id }, {deleted: true});
        // Update the categories to remove the course          
        // await categoriesModel.updateOne({ courses: course_id }, { $pull: { courses: course_id } });
                    
        // delete the content document
        // const deleted = await courseContentsModel.deleteMany({ course_id: course_id });
        return res.status(200);
                    
        
    } catch (error) {
        return res.send(error);
    }
});
router.put('/course/recover', async (req, res)=>{
    const course_id = req.body.id;
    try {
        const course = await coursesModel.findOne({_id: course_id});
        if(course != null){
            await coursesModel.updateOne({ _id: course_id }, {$set: {deleted: false}});
            await categoriesModel.updateOne({_id: course.category_id}, {$set: {deleted: false}})
            return res.status(200);
        }else{
            res.status(404).send("course not found")
        }
    } catch (error) {
        res.send(error)
    }
})







module.exports = router;