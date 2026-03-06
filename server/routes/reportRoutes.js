const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all reports
router.get('/', authMiddleware, getReports);

module.exports = router;