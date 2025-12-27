const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB Connected');

        // 1. Create Admin/Citizen
        const email = 'admin@example.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            user = new User({
                name: 'Admin User',
                email: email,
                password: hashedPassword,
                role: 'citizen'
            });

            await user.save();
            console.log('✅ Default Admin created');
        }

        // 2. Create Road Official
        const officialEmail = 'road@gov.in';
        let official = await User.findOne({ email: officialEmail });
        if (!official) {
            const saltOfficial = await bcrypt.genSalt(10);
            const passwordOfficial = await bcrypt.hash('password123', saltOfficial);

            official = new User({
                name: 'Road Dept Officer',
                email: officialEmail,
                password: passwordOfficial,
                role: 'official',
                department: 'Road'
            });
            await official.save();
            console.log('✅ Official User (Road Dept) created');
            console.log('Email: road@gov.in');
        } else {
            console.log('Road Official already exists');
        }

        // 3. Create Water Official
        const waterEmail = 'water@gov.in';
        let waterOfficial = await User.findOne({ email: waterEmail });
        if (!waterOfficial) {
            const saltWater = await bcrypt.genSalt(10);
            const passwordWater = await bcrypt.hash('password123', saltWater);

            waterOfficial = new User({
                name: 'Water Dept Officer',
                email: waterEmail,
                password: passwordWater,
                role: 'official',
                department: 'Water'
            });
            await waterOfficial.save();
            console.log('✅ Official User (Water Dept) created');
            console.log('Email: water@gov.in');
        } else {
            console.log('Water Official already exists');
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
