const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// ✅ REGISTER API
router.post('/register', async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department
    } = req.body;

    // 1️⃣ Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });

    // logic for claiming alumni account
    if (existingUser) {
      if (existingUser.role === 'alumni' && !existingUser.isRegistered) {
        // Claim the account
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.password = password; // Requesting password to trigger hashing hook? No, hooks run on save().
        // Actually, if I set properties directly, mongoose detects changes. 
        // But updating password on existing doc:
        // "userSchema.pre('save')" runs if "this.isModified('password')".
        existingUser.department = department;
        existingUser.isRegistered = true;

        await existingUser.save(); // Should trigger password hash

        return res.status(201).json({
          success: true,
          message: 'Alumni account claimed and registered successfully'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 3️⃣ Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      isRegistered: true // Default true for new manual registrations
    });

    // 4️⃣ Save user to DB
    await newUser.save();

    // 5️⃣ Success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (error) {
    next(error); // ✅ centralized error handling
  }
});

// ✅ LOGIN API
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // 2️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Check if alumni is registered
    if (user.role === 'alumni' && user.isRegistered === false) {
      return res.status(403).json({
        message: 'Please register to activate your alumni account'
      });
    }

    // 3️⃣ Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // 4️⃣ Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5️⃣ Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isRegistered: user.isRegistered
      }
    });

  } catch (error) {
    next(error); // ✅ centralized error handling
  }
});

// 🔒 PROTECTED TEST ROUTE
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ✅ UPDATE PROFILE API
router.put('/profile', auth, async (req, res, next) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'department',
      'graduationYear', 'degree', 'major',
      'currentCompany', 'currentRole', 'skills', 'bio', 'location', 'linkedinProfile', 'profilePicture'
    ];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const user = await User.findById(req.user._id);

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
});

// ✅ GET ALL ALUMNI (Protected) — returns all alumni including dataset (isRegistered: false)
router.get('/alumni', auth, async (req, res, next) => {
  try {
    const alumni = await User.find({ role: 'alumni' })
      .select('firstName lastName email department graduationYear currentCompany currentRole location linkedinProfile profilePicture isRegistered')
      .sort({ isRegistered: -1, firstName: 1 }); // Registered alumni first, then alphabetical
    res.json(alumni);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
