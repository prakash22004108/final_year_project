const RTIRequest = require('../models/RTIRequest');
const User = require('../models/User');

// Get RTIs for the Official's Department
exports.getDepartmentRTIs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'official') {
            return res.status(403).json({ msg: 'Access denied. Officials only.' });
        }

        if (!user.department) {
            return res.status(400).json({ msg: 'Official has no department assigned.' });
        }

        // Find RTIs where department matches, or maybe fuzzy match
        // For strict matching:
        // const rtis = await RTIRequest.find({ department: user.department }).sort({ createdAt: -1 });

        // For fuzzy/contains matching (since AI might generate "Road Dept" vs "Roads"):
        const regex = new RegExp(user.department, 'i');
        const rtis = await RTIRequest.find({ department: { $regex: regex } })
            .populate('user', 'name email') // Show citizen details
            .sort({ createdAt: -1 });

        res.json(rtis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Response logic
exports.submitResponse = async (req, res) => {
    try {
        const { responseText } = req.body;
        const file = req.file; // From Multer

        const rti = await RTIRequest.findById(req.params.id);
        if (!rti) return res.status(404).json({ msg: 'RTI not found' });

        // Update RTI
        rti.responseDetails = responseText;
        if (file) {
            // Store relative path
            rti.responseDocuments.push(file.path);
        }

        rti.status = 'Response Received';
        rti.respondedBy = req.user.id;
        rti.respondedAt = new Date();

        await rti.save();
        res.json(rti);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
