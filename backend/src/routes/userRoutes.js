const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middlewares/protect');

const router = express.Router();

// PATCH /api/users/profile
router.patch('/profile', protect, userController.updateProfile);

module.exports = router;
