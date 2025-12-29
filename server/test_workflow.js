const axios = require('axios');

const TEST_URL = 'http://localhost:5000/api';

(async () => {
    try {
        console.log("🚀 Starting Workflow Test...");

        // 1. Register/Login User
        let token = "";
        try {
            const login = await axios.post(`${TEST_URL}/auth/login`, {
                email: "admin@example.com",
                password: "password123"
            });
            token = login.data.token;
            console.log("✅ Logged in as Admin");
        } catch (e) {
            console.log("⚠️ Login failed, trying register...");
            // Just assume admin exists from seed, if not this fails. 
            // In dev environment, usually admin exists.
        }

        if (!token) {
            console.error("❌ Could not authenticate.");
            return;
        }

        const config = { headers: { 'x-auth-token': token } };

        // 2. Create RTI - Road Topic (Should find Internal Data)
        console.log("\n--- Creating RTI (Road) ---");
        const rtiData = {
            description: "The MG Road is in bad condition and needs resurfacing immediately."
        };
        
        const res = await axios.post(`${TEST_URL}/rti`, rtiData, config);
        const rti = res.data.rti;

        console.log("✅ RTI Created:", rti._id);
        console.log("Status:", rti.status);
        console.log("Data Availability:", rti.dataAvailability);

        if (rti.dataAvailability?.status.includes('Available')) {
            console.log("🎉 SUCCESS: Data Availability found!");
            console.log("📝 Logs:");
            (rti.dataAvailability.log || []).forEach(l => console.log(`   > ${l}`));
        } else {
            console.log("⚠️ WARNING: Data Availability NOT found (Check if 'Resurfacing of MG Road' is in DB)");
            console.log("📝 Logs:");
            (rti.dataAvailability.log || []).forEach(l => console.log(`   > ${l}`));
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
        if (err.response) console.error("Response:", err.response.data);
    }
})();
