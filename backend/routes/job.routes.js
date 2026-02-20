const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth.middleware');

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('poster', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a job posting
router.post('/', auth, async (req, res) => {
    try {
        const newJob = new Job({
            ...req.body,
            poster: req.user._id
        });
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
