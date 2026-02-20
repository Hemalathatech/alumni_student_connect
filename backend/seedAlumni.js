/**
 * Seed Script: Alumni Dataset
 *
 * Usage: node backend/seedAlumni.js
 *
 * This script:
 *   - Connects to MongoDB
 *   - Inserts alumni from alumniDataset.js
 *   - Skips duplicates by checking email
 *   - Maps dataset fields to the User model fields
 *   - Sets isRegistered: false for all dataset alumni
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const alumniDataset = require('./data/alumniDataset');

dotenv.config();

const seedAlumni = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding...\n');

        let addedCount = 0;
        let skippedCount = 0;

        for (const alumni of alumniDataset) {
            // Check for duplicate by email
            const existingUser = await User.findOne({ email: alumni.email });

            if (existingUser) {
                console.log(`⏭  Skipping: ${alumni.email} (Already exists)`);
                skippedCount++;
                continue;
            }

            // Split "name" into firstName and lastName for User model compatibility
            const nameParts = alumni.name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            // Map dataset fields → User model fields
            const newUser = new User({
                firstName,
                lastName,
                email: alumni.email,
                department: alumni.department,
                graduationYear: alumni.batch,       // batch → graduationYear
                currentCompany: alumni.company,     // company → currentCompany
                currentRole: alumni.jobTitle,       // jobTitle → currentRole
                location: alumni.location,
                role: alumni.role,
                isRegistered: false,                // Always false for dataset alumni
                password: 'DatasetPlaceholder@123' // Placeholder; cannot log in (isRegistered = false blocks login)
            });

            await newUser.save();
            console.log(`✅ Added: ${alumni.email}`);
            addedCount++;
        }

        console.log('\n--- Seeding Complete ---');
        console.log(`✅ Added   : ${addedCount}`);
        console.log(`⏭  Skipped : ${skippedCount}`);
        console.log('------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedAlumni();
