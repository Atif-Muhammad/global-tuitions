const mongoose = require('mongoose');
const studentsModel = require('./studentModel')
const coursesModel = require('./coursesModel')
const questionModel = require("./questionModel")

const feedBackSchema = mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentModel"
    },
    for_course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coursesModel"
    },
    feedBack: {
        type: String,
        default: ""
    },
    rating: Number,
    responses: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "questionModel", 
            },
            answer: {
                type: String
            },
        },
    ],
},{
    timestamps: true, 
})


module.exports = mongoose.model('feedBack', feedBackSchema)