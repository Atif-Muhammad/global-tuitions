const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin')
const clientRoutes = require('./client')
const authorizeAdmin = require('../../middlewares/authorizeAdmin')

router.use('/admin',authorizeAdmin, adminRoutes);
// router.use('/admin', adminRoutes);
router.use(clientRoutes);

module.exports = router;


