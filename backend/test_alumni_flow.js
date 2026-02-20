const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const UNIQUE_ID = Date.now();
const NEW_ADMIN_EMAIL = `admin_${UNIQUE_ID}@test.com`;
const NEW_ALUMNI_EMAIL = `alumni_${UNIQUE_ID}@test.com`;
const LOG_FILE = path.join(__dirname, 'test_result_log.txt');

function log(message) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function runTest() {
    fs.writeFileSync(LOG_FILE, '--- STARTING VERIFICATION ---\n');
    try {
        log('--- STARTING VERIFICATION ---');

        // 1. Register a new Admin
        log('\n1. Registering new Admin...');
        const adminReg = await axios.post(`${BASE_URL}/auth/register`, {
            firstName: 'Admin',
            lastName: 'User',
            email: NEW_ADMIN_EMAIL,
            password: 'password123',
            role: 'admin',
            department: 'CS'
        });
        log(`Admin Registered: ${adminReg.data.success}`);

        // Login as Admin to get token
        log('\n2. Logging in as Admin...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: NEW_ADMIN_EMAIL,
            password: 'password123'
        });
        const token = loginRes.data.token;
        log('Admin Token received');

        // 2. Bulk Import
        log('\n3. Testing Bulk Import...');
        const bulkData = [
            {
                firstName: 'Alice',
                lastName: 'Alumni',
                email: NEW_ALUMNI_EMAIL,
                department: 'CS',
                graduationYear: 2020,
                currentCompany: 'Tech Corp',
                currentRole: 'Engineer'
            }
        ];

        try {
            const bulkRes = await axios.post(`${BASE_URL}/admin/users/bulk-import`, bulkData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            log('Bulk Import Result: ' + JSON.stringify(bulkRes.data));
        } catch (e) {
            log('Bulk Import Failed: ' + (e.response ? JSON.stringify(e.response.data) : e.message));
        }

        // 3. Verify unregistered login fails
        log('\n4. Verifying Unregistered Alumni Login restriction...');
        try {
            await axios.post(`${BASE_URL}/auth/login`, {
                email: NEW_ALUMNI_EMAIL,
                password: 'tempPassword123!'
            });
            log('FAIL: Unregistered alumni managed to login!');
        } catch (e) {
            if (e.response && e.response.status === 403) {
                log('PASS: Login denied with 403 as expected.');
            } else {
                log('FAIL: Unexpected error code: ' + (e.response ? e.response.status : e.message));
            }
        }

        // 4. Register (Claim) the alumni account
        log('\n5. Claiming Alumni Account (Registration)...');
        try {
            const claimRes = await axios.post(`${BASE_URL}/auth/register`, {
                firstName: 'Alice',
                lastName: 'Alumni-Updated',
                email: NEW_ALUMNI_EMAIL,
                password: 'newSecurePassword123',
                role: 'alumni',
                department: 'CS'
            });
            log('Claim Result: ' + JSON.stringify(claimRes.data));
        } catch (e) {
            log('Claim Failed: ' + (e.response ? JSON.stringify(e.response.data) : e.message));
        }

        // 5. Login with new password
        log('\n6. Logging in with new credentials...');
        try {
            const alumniLogin = await axios.post(`${BASE_URL}/auth/login`, {
                email: NEW_ALUMNI_EMAIL,
                password: 'newSecurePassword123'
            });
            log('PASS: Login successful. Token received.');
            log('User Object: ' + JSON.stringify(alumniLogin.data.user));
            log('User isRegistered: ' + (alumniLogin.data.user.isRegistered ? 'YES' : 'NO (Error!)'));
        } catch (e) {
            log('FAIL: Login failed: ' + (e.response ? JSON.stringify(e.response.data) : e.message));
        }

    } catch (error) {
        log('GLOBAL ERROR: ' + error.message);
    }
}

runTest();
