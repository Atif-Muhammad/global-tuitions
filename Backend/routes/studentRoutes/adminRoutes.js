const express = require('express');
require('dotenv').config()
const router = express.Router();
const studentModel = require('../../models/studentModel')
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const feedBack = require('../../models/feedBackModel')
const mongoose = require('mongoose');
const Question = require('../../models/questionModel');



router.get('/', authorizeAdmin, (req, res) => {
    res.send("student route")
});


router.post('/addQuestion', async (req, res) => {
    const { questionText } = req.body;
       
    try {
      await Question.create({questionText});
      res.status(200).json({ message: 'Question added successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Error adding question', error: err });
    }
  });


module.exports = router;