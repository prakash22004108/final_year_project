const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PublicWork = require('./models/PublicWork');
const GovAPI = require('./models/GovAPI');
const EmbeddingService = require('./services/embeddingService');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

// Removed global 'new EmbeddingService()' to initialize it properly inside seed()

// --- DATA SETS ---

// 1. ROADS (35 Items)
const roadWorks = [
    { t: "Resurfacing of SH-27 Wagholi Stretch", l: "Pune, MH", b: 45000000, s: "In Progress", c: "Road" },
    { t: "Construction of Chandani Chowk Flyover", l: "Pune, MH", b: 3400000000, s: "Completed", c: "Road" },
    { t: "Pothole Repair on Baner-Pashan Link Road", l: "Pune, MH", b: 5000000, s: "Completed", c: "Road" },
    { t: "Widening of NH-48 near Satara", l: "Satara, MH", b: 1200000000, s: "Planned", c: "Road" },
    { t: "Mumbai-Nagpur Samruddhi Expressway Phase 2", l: "Nagpur, MH", b: 50000000000, s: "In Progress", c: "Road" },
    { t: "Repair of Service Road along Ahmednagar Highway", l: "Pune, MH", b: 8000000, s: "Stalled", c: "Road" },
    { t: "Installation of crash barriers on Ghat section", l: "Lonavala, MH", b: 25000000, s: "Completed", c: "Road" },
    { t: "Concrete Road Construction in Hinjewadi Phase 3", l: "Pune, MH", b: 150000000, s: "In Progress", c: "Road" },
    { t: "Bridge maintenance across Mula river", l: "Pune, MH", b: 12000000, s: "Planned", c: "Road" },
    { t: "Rural Road connectivity project under PMGSY", l: "Solapur, MH", b: 45000000, s: "Completed", c: "Road" },
    // ... adding more diverse road items
    { t: "Smart Traffic Signal Installation at University Circle", l: "Pune, MH", b: 5000000, s: "Completed", c: "Road" },
    { t: "Footpath renovation on FC Road", l: "Pune, MH", b: 7500000, s: "In Progress", c: "Road" },
    { t: "Storm water drain construction along NH-65", l: "Solapur, MH", b: 34000000, s: "Planned", c: "Road" },
    { t: "Toll plaza automation at Talegaon", l: "Pune, MH", b: 18000000, s: "Completed", c: "Road" },
    { t: "Repainting of lane markings on Old Pune-Mumbai Highway", l: "Pune, MH", b: 2000000, s: "Completed", c: "Road" },
    { t: "Land acquisition for Ring Road Phase 1", l: "Pune District", b: 5000000000, s: "In Progress", c: "Road" },
    { t: "Slope stabilization near Katraj Tunnel", l: "Pune, MH", b: 45000000, s: "Completed", c: "Road" },
    { t: "Street street light electrification on bypass", l: "Nashik, MH", b: 12000000, s: "In Progress", c: "Road" },
    { t: "Cycle track construction in Kothrud", l: "Pune, MH", b: 6000000, s: "Planned", c: "Road" },
    { t: "Emergency repair of bridge expansion joints", l: "Thane, MH", b: 4000000, s: "Completed", c: "Road" },
    { t: "Construction of underpass at busy junction", l: "Nagpur, MH", b: 85000000, s: "Stalled", c: "Road" },
    { t: "Road widening near IT Park", l: "Hinjewadi, MH", b: 65000000, s: "In Progress", c: "Road" },
    { t: "Asphalting of internal colony roads", l: "Aurangabad, MH", b: 15000000, s: "Completed", c: "Road" },
    { t: "Construction of retaining wall along ghat road", l: "Mahabaleshwar, MH", b: 28000000, s: "In Progress", c: "Road" },
    { t: "Installation of highway signage boards", l: "Kolhapur, MH", b: 3500000, s: "Completed", c: "Road" },
    { t: "Development of rest area amenities", l: "NH-48", b: 55000000, s: "Planned", c: "Road" },
    { t: "Repair of monsoon damaged roads in Konkan", l: "Ratnagiri, MH", b: 90000000, s: "In Progress", c: "Road" },
    { t: "Construction of pedestrian skywalk", l: "Andheri, Mumbai", b: 140000000, s: "Completed", c: "Road" },
    { t: "Noise barrier installation near residential zone", l: "Pune, MH", b: 22000000, s: "Planned", c: "Road" },
    { t: "Upgradation of State Highway to National Highway standards", l: "Nanded, MH", b: 450000000, s: "In Progress", c: "Road" },
    { t: "Construction of culverts for flood water management", l: "Chiplun, MH", b: 18000000, s: "Completed", c: "Road" },
    { t: "Beautification of central median with landscaping", l: "Navi Mumbai, MH", b: 9500000, s: "In Progress", c: "Road" },
    { t: "Automated speed enforcement camera setup", l: "Pune-Mumbai Expressway", b: 40000000, s: "Completed", c: "Road" },
    { t: "Repair of heritage bridge structure", l: "Pune, MH", b: 35000000, s: "Planned", c: "Road" },
    { t: "Construction of new bus rapid transit (BRT) lane", l: "Pune, MH", b: 210000000, s: "Stalled", c: "Road" }
];

// 2. WATER (25 Items)
const waterWorks = [
    { t: "Amrut Yojana Pipeline Replacement Phase 1", l: "Pune, MH", b: 120000000, s: "In Progress", c: "Water" },
    { t: "Construction of elevated water storage tank", l: "Hadapsar, MH", b: 25000000, s: "Completed", c: "Water" },
    { t: "Repair of main water supply line leak", l: "Camp, Pune", b: 2000000, s: "Completed", c: "Water" },
    { t: "Installation of new water filtration plant", l: "Parvati, Pune", b: 85000000, s: "Planned", c: "Water" },
    { t: "Jal Jeevan Mission rural connection project", l: "Bhor, MH", b: 35000000, s: "In Progress", c: "Water" },
    { t: "Cleaning and desilting of Katraj Lake", l: "Pune, MH", b: 15000000, s: "Completed", c: "Water" },
    { t: "Automation of valve operating system", l: "Pune Cantonment", b: 8000000, s: "Planned", c: "Water" },
    { t: "Rainwater harvesting implementation in govt buildings", l: "Mumbai, MH", b: 12000000, s: "In Progress", c: "Water" },
    { t: "Sewage Treatment Plant (STP) capacity expansion", l: "Mundhwa, Pune", b: 250000000, s: "Stalled", c: "Water" },
    { t: "Laying of drainage pipes in low lying areas", l: "Viman Nagar, Pune", b: 40000000, s: "Completed", c: "Water" },
    { t: "Drilling of new borewells for drought relief", l: "Ahmednagar, MH", b: 5000000, s: "Completed", c: "Water" },
    { t: "Canal repair and lining work", l: "Khadekusla Dam", b: 65000000, s: "In Progress", c: "Water" },
    { t: "Installation of smart water meters", l: "Baner, Pune", b: 90000000, s: "Planned", c: "Water" },
    { t: "Riverfront development project", l: "Mula-Mutha River, Pune", b: 8000000000, s: "In Progress", c: "Water" },
    { t: "Construction of check dam", l: "Velhe, MH", b: 18000000, s: "Completed", c: "Water" },
    { t: "Emergency water tanker supply management", l: "Marathwada Region", b: 50000000, s: "Completed", c: "Water" },
    { t: "Upgradation of pumping machinery", l: "Bopodi Pumping Station", b: 22000000, s: "In Progress", c: "Water" },
    { t: "Leakage detection survey using acoustic sensors", l: "Pune City", b: 5000000, s: "Completed", c: "Water" },
    { t: "Rejuvenation of old stepwell", l: "Satara, MH", b: 3500000, s: "Planned", c: "Water" },
    { t: "Construction of master balancing reservoir", l: "Lohegaon, Pune", b: 55000000, s: "In Progress", c: "Water" },
    { t: "Drainage network mapping using GIS", l: "PCMC Area", b: 8000000, s: "Completed", c: "Water" },
    { t: "Flood control wall construction", l: "Singhad Road, Pune", b: 34000000, s: "Completed", c: "Water" },
    { t: "Nala channeling and cleaning before monsoon", l: "Pune City", b: 25000000, s: "In Progress", c: "Water" },
    { t: "Water quality testing lab upgrade", l: "Pune Municipal Corp", b: 12000000, s: "Planned", c: "Water" },
    { t: "Solar powered water pump installation", l: "Tribal Areas, MH", b: 45000000, s: "In Progress", c: "Water" }
];

// 3. URBAN INFRA (15 Items)
const urbanWorks = [
    { t: "Smart City Command Control Center", l: "Pune, MH", b: 150000000, s: "Completed", c: "Infrastructure" },
    { t: "Installation of LED Street Lights", l: "Aundh, Pune", b: 25000000, s: "Completed", c: "Infrastructure" },
    { t: "Construction of Solid Waste Management Plant", l: "Uruli Devachi", b: 450000000, s: "In Progress", c: "Infrastructure" },
    { t: "Development of public garden and jogging track", l: "Kalyani Nagar, Pune", b: 18000000, s: "Completed", c: "Infrastructure" },
    { t: "Renovation of Town Hall", l: "Pune City", b: 50000000, s: "Planned", c: "Infrastructure" },
    { t: "Multi-level car parking facility", l: "JM Road, Pune", b: 120000000, s: "Stalled", c: "Infrastructure" },
    { t: "Public toilet block construction (Swachh Bharat)", l: "Market Yard, Pune", b: 4500000, s: "Completed", c: "Infrastructure" },
    { t: "Installation of CCTV surveillance system", l: "Citywide", b: 350000000, s: "In Progress", c: "Infrastructure" },
    { t: "Slum rehabilitation housing project", l: "Yerwada, Pune", b: 850000000, s: "In Progress", c: "Infrastructure" },
    { t: "Construction of community center", l: "Warje, Pune", b: 22000000, s: "Completed", c: "Infrastructure" },
    { t: "Heritage building facade lighting", l: "Shanivar Wada", b: 6500000, s: "Planned", c: "Infrastructure" },
    { t: "Electric Vehicle charging station network", l: "Pune City", b: 40000000, s: "In Progress", c: "Infrastructure" },
    { t: "Upgradation of fire station equipment", l: "Central Fire Station", b: 55000000, s: "Completed", c: "Infrastructure" },
    { t: "Biogas plant from wet waste", l: "Katraj, Pune", b: 15000000, s: "Completed", c: "Infrastructure" },
    { t: "Development of hawker zone", l: "FC Road, Pune", b: 9000000, s: "Planned", c: "Infrastructure" }
];

// 4. HEALTH (15 Items)
const healthWorks = [
    { t: "Construction of New Medical College Building", l: "Satara, MH", b: 1500000000, s: "In Progress", c: "Health" },
    { t: "Renovation of Primary Health Center (PHC)", l: "Shirur, MH", b: 8500000, s: "Completed", c: "Health" },
    { t: "Installation of Oxygen Generation Plant", l: "District Hospital, A.Nagar", b: 25000000, s: "Completed", c: "Health" },
    { t: "Procurement of MRI Machine", l: "Sassoon Hospital, Pune", b: 60000000, s: "Completed", c: "Health" },
    { t: "Construction of 100-bed extension wing", l: "Civil Hospital, Nashik", b: 250000000, s: "Planned", c: "Health" },
    { t: "Setting up of dialysis center", l: "Bhosari, MH", b: 15000000, s: "In Progress", c: "Health" },
    { t: "Repairs to hospital staff quarters", l: "Solapur, MH", b: 12000000, s: "Stalled", c: "Health" },
    { t: "Modernization of Operation Theater", l: "YCM Hospital, Pimpri", b: 35000000, s: "Completed", c: "Health" },
    { t: "Supply of ambulance fleet (108 service)", l: "Maharashtra State", b: 80000000, s: "In Progress", c: "Health" },
    { t: "Construction of rural sub-center", l: "Mulshi, MH", b: 5500000, s: "Completed", c: "Health" },
    { t: "Upgradation of pathology laboratory", l: "Aundh District Hospital", b: 9000000, s: "Planned", c: "Health" },
    { t: "Installation of solar water heaters in hospital", l: "Latur, MH", b: 4500000, s: "Completed", c: "Health" },
    { t: "Trauma care center development", l: "Pune-Mumbai Expressway", b: 120000000, s: "In Progress", c: "Health" },
    { t: "Telemedicine facility setup", l: "Remote Tribal Areas", b: 18000000, s: "Completed", c: "Health" },
    { t: "Blood bank storage unit upgrade", l: "Red Cross, Pune", b: 6500000, s: "Planned", c: "Health" }
];

// 5. EDUCATION (10 Items)
const educationWorks = [
    { t: "Construction of new classrooms ZP School", l: "Daund, MH", b: 7500000, s: "Completed", c: "Education" },
    { t: "Repair of leaking school roof", l: "Junnar, MH", b: 1200000, s: "Completed", c: "Education" },
    { t: "Installation of Smart Classrooms (Digital)", l: "Pune Municipal Schools", b: 50000000, s: "In Progress", c: "Education" },
    { t: "Construction of school compound wall", l: "Baramati, MH", b: 3500000, s: "Completed", c: "Education" },
    { t: "New Library building construction", l: "Fergusson College, Pune", b: 45000000, s: "Planned", c: "Education" },
    { t: "Toilets block construction for girls", l: "Rural Schools, MH", b: 25000000, s: "In Progress", c: "Education" },
    { t: "Science laboratory equipment supply", l: "Govt Polytechnic, Pune", b: 15000000, s: "Completed", c: "Education" },
    { t: "Hostel building repair and painting", l: "COEP, Pune", b: 18000000, s: "Stalled", c: "Education" },
    { t: "Playground development and fencing", l: "Balewadi, Pune", b: 22000000, s: "In Progress", c: "Education" },
    { t: "Solar power installation for school", l: "Nashik ZP School", b: 6000000, s: "Planned", c: "Education" }
];

const allWorks = [...roadWorks, ...waterWorks, ...urbanWorks, ...healthWorks, ...educationWorks];

// --- API DATA ---
const govApis = [
    // Roads
    { n: "Ministry of Road Transport API", e: "https://api.morth.nic.in/v1/projects", c: "Road" },
    { n: "NHAI Data Lake", e: "https://datalake.nhai.gov.in/api/status", c: "Road" },
    { n: "PMGSY Rural Roads API", e: "https://omms.nic.in/api/v2/roads", c: "Road" },
    { n: "Maharashtra PWD Works API", e: "https://mahapwd.gov.in/api/works", c: "Road" },
    { n: "National Highway Toll API", e: "https://tis.nhai.gov.in/api/tolls", c: "Road" },
    { n: "Bhoomi Rashi Land Acquisition", e: "https://bhoomirashi.gov.in/api/land", c: "Road" },
    { n: "FASTag Transaction Analytics", e: "https://npci.org.in/api/fastag", c: "Road" },
    { n: "Setu Bharatam Bridge Data", e: "https://morth.nic.in/api/bridges", c: "Road" },
    { n: "Road Accident Database (iRAD)", e: "https://irad.parivahan.gov.in/api/stats", c: "Road" },
    { n: "e-Marg Maintenance API", e: "https://emarg.gov.in/api/maintenance", c: "Road" },
    { n: "Sugamya Bharat Access API", e: "https://accessibleindia.gov.in/api/infra", c: "Road" },
    { n: "Vahan Vehicle Reg API", e: "https://vahan.parivahan.gov.in/api", c: "Road" },

    // Water
    { n: "Jal Jeevan Mission Dashboard API", e: "https://ejalshakti.gov.in/api/jjm", c: "Water" },
    { n: "Central Ground Water Board API", e: "https://cgwb.gov.in/api/groundwater", c: "Water" },
    { n: "National River Conservation Plan", e: "https://nrcp.gov.in/api/rivers", c: "Water" },
    { n: "CPCB Water Quality Data", e: "https://cpcb.nic.in/api/water-quality", c: "Water" },
    { n: "Atal Bhujal Yojana API", e: "https://ataljal.gov.in/api/progress", c: "Water" },
    { n: "Dam Rehabilitation (DRIP) API", e: "https://damsafety.in/api/drip", c: "Water" },
    { n: "Irrigation Census Data", e: "https://mowr.gov.in/api/census", c: "Water" },
    { n: "Swachh Bharat Urban Water API", e: "https://sbmurban.org/api/water", c: "Water" },

    // Health
    { n: "Ayushman Bharat PMJAY API", e: "https://pmjay.gov.in/api/beneficiaries", c: "Health" },
    { n: "CoWIN Public API", e: "https://apisetu.gov.in/cowin/v1", c: "Health" },
    { n: "National Health Mission HMIS", e: "https://hmis.nhp.gov.in/api/stats", c: "Health" },
    { n: "eSanjeevani Telemedicine API", e: "https://esanjeevani.in/api/opd", c: "Health" },
    { n: "Ni-kshay TB Control API", e: "https://nikshay.in/api/patients", c: "Health" },
    { n: "Drug Licensing (SUGAM) API", e: "https://cdsco.gov.in/api/drugs", c: "Health" },
    { n: "Integrated Disease Surveillance", e: "https://idsp.nic.in/api/alerts", c: "Health" },
    { n: "Blood Bank Network (eRaktKosh)", e: "https://eraktkosh.in/api/stock", c: "Health" },

    // Education
    { n: "UDISE+ School Data API", e: "https://udiseplus.gov.in/api/schools", c: "Education" },
    { n: "NDEAR Education Infra API", e: "https://ndear.gov.in/api/infra", c: "Education" },
    { n: "Mid Day Meal Scheme API", e: "https://mdm.nic.in/api/meals", c: "Education" },
    { n: "Samagra Shiksha Abhiyan API", e: "https://samagra.education.gov.in/api", c: "Education" },
    { n: "NIPUN Bharat Specs API", e: "https://nipunbharat.education.gov.in/api", c: "Education" },
    { n: "NCERT Digital Library API", e: "https://ncert.nic.in/api/books", c: "Education" },

    // Other/Rural
    { n: "MNREGA Job Card API", e: "https://nrega.nic.in/api/workers", c: "Infrastructure" },
    { n: "PMAY Gramin Housing API", e: "https://pmayg.nic.in/api/houses", c: "Infrastructure" },
    { n: "Smart Cities Mission Data", e: "https://smartcities.gov.in/api/projects", c: "Infrastructure" },
    { n: "e-Gram Swaraj Portal API", e: "https://egramswaraj.gov.in/api", c: "Infrastructure" },
    { n: "AMRUT Urban Mission API", e: "https://amrut.gov.in/api/progress", c: "Infrastructure" },
    { n: "Deen Dayal Upadhyaya GKY API", e: "https://ddugky.gov.in/api/training", c: "Infrastructure" }
];

async function seed() {
    try {
        console.log("🔥 STARTING MASS SEEDING...");

        // Initialize Embedding Model
        const embeddingService = await EmbeddingService.getInstance();

        // 1. Clear Existing Data (But keep Users)
        await PublicWork.deleteMany({});
        await GovAPI.deleteMany({});
        console.log("🗑️  Cleared old PublicWork and GovAPI data.");

        // 2. Insert APIs (Fast)
        const apiDocs = govApis.map(api => ({
            name: api.n,
            endpoint: api.e,
            category: api.c,
            reliabilityScore: 0.9 + (Math.random() * 0.1) // 0.90 - 1.00
        }));
        await GovAPI.insertMany(apiDocs);
        console.log(`✅ Seeded ${apiDocs.length} Government APIs.`);

        // 3. Insert Public Works with Embeddings (Slow but Accurate)
        console.log(`⏳ Generaring AI Embeddings for ${allWorks.length} Public Works... this may take 2-3 minutes.`);
        
        let successCount = 0;
        const total = allWorks.length;

        // Process in chunks to avoid rate limits if any
        for (let i = 0; i < total; i++) {
            const work = allWorks[i];
            const textToEmbed = `${work.t} ${work.l} ${work.c} status:${work.s}`;
            
            try {
                // REAL EMBEDDING GENERATION
                const vector = await embeddingService.generateEmbedding(textToEmbed);
                
                const newWork = new PublicWork({
                    title: work.t,
                    location: work.l,
                    category: work.c,
                    budget: work.b,
                    spent: work.s === 'Completed' ? work.b : work.b * 0.6, // Estimate
                    status: work.s,
                    description: `${work.t}. A major ${work.c.toLowerCase()} project in ${work.l} with a budget of ₹${(work.b/10000000).toFixed(2)} Cr.`,
                    embedding: vector,
                    progress: work.s === 'Completed' ? 100 : (work.s === 'Planned' ? 0 : Math.floor(Math.random() * 80) + 10),
                    startDate: new Date('2023-01-01'),
                    deadline: new Date('2025-12-31')
                });

                await newWork.save();
                successCount++;
                process.stdout.write(`.`); // Visual progress
            } catch (err) {
                console.error(`\n❌ Failed to embed "${work.t}": ${err.message}`);
            }
        }

        console.log(`\n\n🎉 Successfully Seeded ${successCount}/${total} Public Works with AI Vectors!`);
        console.log("🚀 Database is now production-ready for Semantic Search.");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
