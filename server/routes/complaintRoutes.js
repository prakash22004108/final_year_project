const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateComplaint, getUserComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');

router.post('/generate', auth, generateComplaint);
router.get('/', auth, getUserComplaints);
router.get('/admin', auth, getAllComplaints); // Admin route to fetch all
router.put('/:id/status', auth, updateComplaintStatus);

module.exports = router;
