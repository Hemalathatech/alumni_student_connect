const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const auth = require('../middleware/auth.middleware');

// Create a new donation
router.post('/', auth, async (req, res, next) => {
    try {
        const { amount, campaign, message, currency } = req.body;

        // Create new donation record
        const donation = new Donation({
            donor: req.user._id,
            amount,
            campaign,
            message,
            currency: currency || 'USD',
            status: 'completed', // Simulating successful payment for now
            transactionId: `TXN-${Date.now()}`
        });

        await donation.save();

        res.status(201).json({
            success: true,
            data: donation,
            message: 'Donation successful! Thank you for your support.'
        });
    } catch (error) {
        next(error);
    }
});

// Get all donations (Admin only)
router.get('/all', auth, async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const donations = await Donation.find()
            .populate('donor', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        next(error);
    }
});

// Get my donations
router.get('/my-donations', auth, async (req, res, next) => {
    try {
        const donations = await Donation.find({ donor: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        next(error);
    }
});

// Get total donations amount (Public or Dashboard)
router.get('/total', async (req, res, next) => {
    try {
        const result = await Donation.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        res.json({
            success: true,
            totalAmount: result.length > 0 ? result[0].totalAmount : 0
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
