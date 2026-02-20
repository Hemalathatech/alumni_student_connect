const express = require('express');
const router = express.Router();

const User = require('../models/User');
const MentorshipRequest = require('../models/MentorshipRequest');

const auth = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

// ================================
// Admin - View all users
// ================================
router.get(
  '/users',
  auth,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ================================
// Admin - Delete user
// ================================
router.delete(
  '/users/:id',
  auth,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.deleteOne();

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ================================
// Admin - View all mentorship requests
// ================================
router.get(
  '/mentorships',
  auth,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const requests = await MentorshipRequest.find()
        .populate('student', 'firstName lastName email')
        .populate('alumni', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ================================
// Admin - Bulk Import Alumni
// ================================
router.post(
  '/users/bulk-import',
  auth,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const alumniData = req.body; // Expecting an array of alumni objects

      if (!Array.isArray(alumniData) || alumniData.length === 0) {
        return res.status(400).json({ message: 'Invalid data format. Expected an array of alumni.' });
      }

      const results = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (const alumni of alumniData) {
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email: alumni.email });

          if (existingUser) {
            results.failed++;
            results.errors.push(`Email ${alumni.email} already exists`);
            continue;
          }

          // Create new user with isRegistered: false
          const newUser = new User({
            ...alumni,
            role: 'alumni',
            password: 'tempPassword123!', // Placeholder password, will be reset on registration
            isRegistered: false
          });

          await newUser.save();
          results.success++;
        } catch (err) {
          results.failed++;
          results.errors.push(`Failed to import ${alumni.email}: ${err.message}`);
        }
      }

      res.json({
        message: 'Bulk import completed',
        results
      });

    } catch (error) {
      console.error('Bulk import error:', error);
      res.status(500).json({ message: 'Server error during bulk import' });
    }
  }
);

module.exports = router;
