const express = require('express');
const router = express.Router();
const { getBeneficiaries, createBeneficiary } = require('../controllers/beneficiaryController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all beneficiaries
router.get('/', authMiddleware, getBeneficiaries);

// Add new beneficiary
router.post('/', authMiddleware, createBeneficiary);

module.exports = router;