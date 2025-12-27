const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createRTI, getUserRTIs, submitRTI, simulateResponse, analyzeResponse } = require('../controllers/rtiController');

router.post('/', auth, createRTI);
router.get('/', auth, getUserRTIs);
router.put('/:id/submit', auth, submitRTI);
router.put('/:id/simulate-response', auth, simulateResponse); // For Demo
router.put('/:id/analyze', auth, analyzeResponse);

module.exports = router;
