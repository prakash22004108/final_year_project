const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GovAPI = require('./models/GovAPI');
const PublicWork = require('./models/PublicWork');
const EmbeddingService = require('./services/embeddingService');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB Connected');

        // 1. Create Admin/Citizen
        console.log('--- Seeding Users ---');
        const User = require('./models/User');
        const bcrypt = require('bcryptjs');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123', salt);

        const adminUser = await User.findOne({ email: 'admin@govt.in' });
        if (!adminUser) {
            const newAdmin = new User({
                name: 'System Admin',
                email: 'admin@govt.in',
                password: hashedPassword,
                role: 'admin'
            });
            await newAdmin.save();
            console.log('✅ Admin user created: admin@govt.in / 123');
        } else {
            adminUser.password = hashedPassword;
            await adminUser.save();
            console.log('🔄 Admin password updated to 123');
        }
        
        // 4. Create Extensive Seed Gov APIs
        const apis = [
            // Transport & Infrastructure
            { name: "National Highway Authority API", endpoint: "https://api.nhai.gov.in/v2/projects", category: "Road" },
            { name: "Pradhan Mantri Gram Sadak Yojana API", endpoint: "https://omms.nic.in/api/v1/roads", category: "Road" },
            { name: "Smart Cities Mission Data", endpoint: "https://smartcities.data.gov.in/api/projects", category: "Infrastructure" },
            
            // Water & Sanitation
            { name: "Central Ground Water Board API", endpoint: "https://api.cgwb.gov.in/v1/water_levels", category: "Water" },
            { name: "Jal Jeevan Mission API", endpoint: "https://ejalshakti.gov.in/api/households", category: "Water" },
            { name: "Swachh Bharat Urban API", endpoint: "https://swachhbharatmission.gov.in/api/toilets", category: "Sanitation" },

            // Energy
            { name: "National Power Portal API", endpoint: "https://npp.gov.in/api/v1/generation", category: "Electricity" },
            { name: "Street Light National Programme API", endpoint: "https://slnp.eeslindia.org/api/status", category: "Electricity" },

            // Health & Education
            { name: "Ayushman Bharat Hospital Data", endpoint: "https://api.pmjay.gov.in/hospitals", category: "Health" },
            { name: "UDISE+ School Infrastructure", endpoint: "https://udiseplus.gov.in/api/schools", category: "Education" }
        ];

        console.log('--- Seeding APIs ---');
        for (const api of apis) {
            const exists = await GovAPI.findOne({ name: api.name });
            if (!exists) {
                await new GovAPI(api).save();
                console.log(`✅ API created: ${api.name}`);
            }
        }

        // 5. Create Seed Public Works (Detailed Internal Data)
        const works = [
            // Roads
            { 
                title: "Resurfacing of MG Road", 
                description: "Complete resurfacing of 5km stretch including drainage improvements and lane marking. High priority project due to monsoon damage.",
                category: "Road", 
                location: "Bangalore, Sector 4", 
                budget: 5000000, 
                spent: 4200000,
                status: "Completed", 
                progress: 100,
                contractor: "L&T Construction", 
                startDate: new Date("2024-01-15"),
                completionDate: new Date("2024-06-30"),
                deadline: new Date("2024-07-01"),
                updates: [
                    { date: new Date("2024-02-01"), note: "Work started on time." },
                    { date: new Date("2024-05-15"), note: "80% completed. Delay due to rain." },
                    { date: new Date("2024-06-30"), note: "Project completed successfully." }
                ]
            },
            { 
                title: "New Bypass Road Construction", 
                description: "Construction of a 4-lane bypass road to decongest Hinjewadi traffic. Includes 2 flyovers.",
                category: "Road", 
                location: "Pune, Hinjewadi", 
                budget: 25000000, 
                spent: 12000000,
                status: "In Progress", 
                progress: 45,
                contractor: "Jay Buildcon", 
                startDate: new Date("2024-03-01"),
                deadline: new Date("2025-12-31"),
                updates: [
                    { date: new Date("2024-03-01"), note: "Foundation stone laid." },
                    { date: new Date("2024-08-10"), note: "Phase 1 earthworks completed." }
                ]
            },
            { 
                title: "Patchwork for Potholes", 
                description: "Emergency repair of potholes reported in Andheri East area.",
                category: "Road", 
                location: "Mumbai, Andheri East", 
                budget: 200000, 
                spent: 0,
                status: "Planned", 
                progress: 0,
                contractor: "Municipal Corp Team", 
                startDate: new Date("2025-01-10"),
                deadline: new Date("2025-01-20")
            },

            // Water / Drainage
            { 
                title: "Storm Water Drain Repair", 
                description: "Desilting and structural repair of major storm water drains in Velachery to prevent flooding.",
                category: "Water", 
                location: "Chennai, Velachery", 
                budget: 1500000, 
                spent: 900000,
                status: "In Progress", 
                progress: 60,
                contractor: "Metro Water Board", 
                startDate: new Date("2024-09-01"),
                deadline: new Date("2024-11-30"),
                updates: [
                    { date: new Date("2024-10-01"), note: "Desilting completed." } 
                ]
            },
            { 
                title: "New Pipeline Installation", 
                description: "Laying of new drinking water pipelines for Dwarka Sector 12.",
                category: "Water", 
                location: "Delhi, Dwarka", 
                budget: 8000000, 
                spent: 8000000,
                status: "Completed", 
                progress: 100,
                contractor: "Delhi Jal Board", 
                startDate: new Date("2023-05-20"),
                completionDate: new Date("2024-02-15"),
                deadline: new Date("2024-03-01")
            },

            // Electricity / Street Lights
            { 
                title: "Installation of LED Street Lights", 
                description: "Replacing 500 old sodium vapor lamps with energy efficient LEDs in Salt Lake.",
                category: "Electricity", 
                location: "Kolkata, Salt Lake", 
                budget: 3000000, 
                spent: 2800000,
                status: "Completed", 
                progress: 100,
                contractor: "Philips Lighting", 
                startDate: new Date("2024-04-01"),
                completionDate: new Date("2024-05-30")
            },
            { 
                title: "Solar Street Light Project", 
                description: "Installation of 50 solar street lights in rural Jaipur.",
                category: "Electricity", 
                location: "Jaipur, Rural", 
                budget: 4500000, 
                spent: 0,
                status: "Planned", 
                progress: 0,
                contractor: "Rajasthan Solar Assoc", 
                startDate: new Date("2025-03-01")
            }
        ];

        console.log('--- Seeding Public Works with Vector Embeddings ---');
        const embeddingService = await EmbeddingService.getInstance();
        
        for (const work of works) {
            const exists = await PublicWork.findOne({ title: work.title });
            if (!exists) {
                // Generate Embedding
                const textToEmbed = `${work.title} ${work.description} ${work.category} ${work.location}`;
                const vector = await embeddingService.generateEmbedding(textToEmbed);
                
                await new PublicWork({ ...work, embedding: vector }).save();
                console.log(`✅ Work created (with embedding): ${work.title}`);
            } else {
                // Optional: Update embedding if missing
                if (!exists.embedding || exists.embedding.length === 0) {
                     const textToEmbed = `${work.title} ${work.description} ${work.category} ${work.location}`;
                     const vector = await embeddingService.generateEmbedding(textToEmbed);
                     exists.embedding = vector;
                     await exists.save();
                     console.log(`🔄 Updated embedding for: ${work.title}`);
                }
            }
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
