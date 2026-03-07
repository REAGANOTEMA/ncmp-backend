const express = require('express');
const router = express.Router();
const { getRequests, createRequest } = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all requests
router.get('/', authMiddleware, getRequests);

// Create new request
router.post('/', authMiddleware, createRequest);

module.exports = router;