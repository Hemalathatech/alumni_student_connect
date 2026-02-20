const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['student', 'alumni', 'admin'],
    required: true
  },

  isRegistered: {
    type: Boolean,
    default: true
  },

  department: {
    type: String
  },

  // 🎓 Education Details
  graduationYear: {
    type: Number
  },
  degree: {
    type: String
  },
  major: {
    type: String
  },

  // 💼 Professional Details (for Alumni)
  currentCompany: {
    type: String
  },
  currentRole: {
    type: String
  },
  skills: {
    type: [String]
  },
  bio: {
    type: String
  },
  location: {
    type: String
  },
  linkedinProfile: {
    type: String
  },
  profilePicture: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔐 Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// 🔑 Compare password during login
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
