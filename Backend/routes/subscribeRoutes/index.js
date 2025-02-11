const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes')
const clientRoutes = require('./clientRoutes')
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const AuthenticateUsers = require('../../middlewares/authenticateUser')


router.use('/admin', authorizeAdmin, adminRoutes);
// router.use('/admin', adminRoutes);
router.use(clientRoutes);

module.exports = router;
