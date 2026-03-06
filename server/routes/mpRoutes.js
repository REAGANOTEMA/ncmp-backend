const express = require('express');
const router = express.Router();
const { getMPs, createMP } = require('../controllers/mpController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public: list MPs
router.get('/', getMPs);

// Protected: create new MP
router.post('/', authMiddleware, createMP);

module.exports = router;