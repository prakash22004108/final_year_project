const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateComplaint, getUserComplaints } = require('../controllers/complaintController');

router.post('/generate', auth, generateComplaint);
router.get('/', auth, getUserComplaints);

module.exports = router;
