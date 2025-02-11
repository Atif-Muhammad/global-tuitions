const mongoose = require('mongoose');
const course = require('./coursesModel')

const inquiry_schema = mongoose.Schema({
  inquiry_by: String,
  email: String,
  phone: Number,
  inquiry: String,
  reply: String,
  inquiry_by_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  replied_flag: {
    type: Boolean,
    default: false,
  },
  viewed_flag: {
    type: Boolean,
    default: false,
  },
  for_course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
}, { timestamps: true });

module.exports = mongoose.model('inquiry', inquiry_schema);