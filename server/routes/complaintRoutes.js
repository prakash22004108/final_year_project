const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateComplaint, getUserComplaints, getAllComplaints } = require('../controllers/complaintController');

router.post('/generate', auth, generateComplaint);
router.get('/', auth, getUserComplaints);
router.get('/admin', auth, getAllComplaints); // Admin route to fetch all

module.exports = router;
