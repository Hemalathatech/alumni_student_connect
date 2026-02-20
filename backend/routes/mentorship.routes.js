const express = require('express');
const router = express.Router();

const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User'); // Required for recommendation
const axios = require('axios'); // Required for calling AI service
const auth = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

// Alumni - View mentorship requests
router.get(
  '/alumni/requests',
  auth,
  authorizeRoles('alumni'),
  async (req, res) => {
    try {
      const requests = await MentorshipRequest.find({
        alumni: req.user._id
      }).populate('student', 'firstName lastName email');

      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Alumni - Accept / Reject mentorship request
router.put(
  '/alumni/respond/:id',
  auth,
  authorizeRoles('alumni'),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const request = await MentorshipRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.alumni.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      request.status = status;
      await request.save();

      res.json({
        message: `Request ${status}`,
        request
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// Student - View mentorship request status
router.get(
  '/student/status',
  auth,
  authorizeRoles('student'),
  async (req, res) => {
    try {
      const requests = await MentorshipRequest.find({
        student: req.user._id
      })
        .populate('alumni', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// Student - Send mentorship request
router.post(
  '/request',
  auth,
  authorizeRoles('student'),
  async (req, res) => {
    try {
      const { alumni, message } = req.body;

      if (!alumni || !message) {
        return res.status(400).json({
          message: 'Alumni ID and message are required'
        });
      }

      const newRequest = new MentorshipRequest({
        student: req.user._id,
        alumni,
        message
      });

      await newRequest.save();

      res.status(201).json({
        message: 'Mentorship request sent'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// Alumni - View accepted students
router.get(
  '/alumni/accepted',
  auth,
  authorizeRoles('alumni'),
  async (req, res) => {
    try {
      const acceptedRequests = await MentorshipRequest.find({
        alumni: req.user._id,
        status: 'accepted'
      }).populate('student', 'firstName lastName email');

      res.json(acceptedRequests);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Student - Get Mentor Recommendations (AI Powered)
router.get(
  '/recommend',
  auth,
  authorizeRoles('student'),
  async (req, res) => {
    try {
      // 1. Get Student Profile
      const student = await User.findById(req.user._id).select('-password');

      // 2. Get All Alumni
      const alumni = await User.find({ role: 'alumni' }).select('-password');

      // 3. Prepare Payload
      const payload = {
        student: {
          skills: student.skills || [],
          interests: [] // Add interests to User model if needed
        },
        alumni: alumni.map(a => ({
          _id: a._id,
          firstName: a.firstName,
          lastName: a.lastName,
          email: a.email,
          currentCompany: a.currentCompany,
          currentRole: a.currentRole,
          skills: a.skills || []
        }))
      };

      // 4. Call Python AI Service
      const aiResponse = await axios.post('http://localhost:5001/recommend/mentors', payload);

      if (aiResponse.data.success) {
        res.json(aiResponse.data.data);
      } else {
        // Fallback if AI fails: return all alumni
        res.json(payload.alumni.map(a => ({ ...a, match_score: 0 })));
      }

    } catch (error) {
      console.error("AI Service Error:", error.message);
      // Fallback: return raw alumni list without scores
      try {
        const alumni = await User.find({ role: 'alumni' }).select('-password');
        res.json(alumni.map(a => ({ ...a, match_score: 0, _fallback: true })));
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    }
  }
);

module.exports = router;
