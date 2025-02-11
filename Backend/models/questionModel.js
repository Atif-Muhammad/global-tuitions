const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: {
      type: String,
      default: "What do you like the most about the course?"
    }
});

module.exports = mongoose.model("Question", QuestionSchema);
