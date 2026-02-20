const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const mentorshipRoutes = require('./routes/mentorship.routes');
const adminRoutes = require('./routes/admin.routes');
const eventRoutes = require('./routes/event.routes');
const jobRoutes = require('./routes/job.routes');
const errorHandler = require('./middleware/error.middleware');
const donationRoutes = require('./routes/donation.routes');
const uploadRoutes = require('./routes/upload.routes'); // Import upload routes
const notificationRoutes = require('./routes/notification.routes'); // Notifications




dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/upload', uploadRoutes); // Use upload routes
app.use('/api/notifications', notificationRoutes); // Use notifications

// Make uploads folder static
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);




// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// test route
app.get('/health', (req, res) => {
  res.json({ message: 'Backend running successfully' });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
