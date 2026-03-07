const express = require('express');
const router = express.Router();
const { getStaff, createStaff } = require('../controllers/staffController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public: list staff
router.get('/', getStaff);

// Protected: create new staff
router.post('/', authMiddleware, createStaff);

module.exports = router;