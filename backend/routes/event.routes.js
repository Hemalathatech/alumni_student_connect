const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth.middleware');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'firstName lastName')
            .sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create an event
router.post('/', auth, async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            organizer: req.user._id
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// RSVP to an event
router.put('/rsvp/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already RSVP'd
        if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already RSVPd' });
        }

        event.attendees.push(req.user._id);
        await event.save();

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
