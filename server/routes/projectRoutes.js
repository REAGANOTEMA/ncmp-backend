const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all projects
router.get('/', authMiddleware, getProjects);

// Create new project
router.post('/', authMiddleware, createProject);

module.exports = router;