const express = require('express');
const router = express.Router();
const dashboard = require('./dashboard')
const authorizeAdmin = require('../../middlewares/authorizeAdmin')

router.use('/admin',authorizeAdmin, dashboard);


module.exports = router;


