const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const officialController = require('../controllers/officialController');

// All routes protected
router.use(auth);

// Get Department RTIs
router.get('/rtis', officialController.getDepartmentRTIs);

// Submit Response (with File)
router.post('/respond/:id', upload.single('document'), officialController.submitResponse);

module.exports = router;
