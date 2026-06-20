const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Branch = require('./src/models/Branch');
const User = require('./src/models/User');
const Event = require('./src/models/Event');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Branch.deleteMany({});
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create Branches
    const branches = await Branch.insertMany([
      {
        name: 'GLT Main Headquarters',
        address: 'lekki lagos nigeria',
        latitude: 6.4698,
        longitude: 3.5852,
        contact: '+1 234 567 890'
      },
      {
        name: 'GLT Ikeja Branch',
        address: 'ikeja lagos',
        latitude: 6.6018,
        longitude: 3.3515,
        contact: '+1 987 654 321'
      },
      {
        name: 'GLT Agricola Branch',
        address: 'Agricola, off UI, Oyo state',
        latitude: 7.4487,
        longitude: 3.9059,
        contact: '+1 987 654 321'
      },
      {
        name: 'GLT Lekki (Light House)',
        address: 'Lekki, Lagos, Nigeria',
        latitude: 6.4698,
        longitude: 3.5852,
        contact: '+234 800 000 0001'
      },
      {
        name: 'GLT Ile-Ife',
        address: 'Ile-Ife, Osun State, Nigeria',
        latitude: 7.4823,
        longitude: 4.5609,
        contact: '+234 800 000 0002'
      },
      {
        name: 'GLT Akure',
        address: 'Akure, Ondo State, Nigeria',
        latitude: 7.257,
        longitude: 5.2058,
        contact: '+234 800 000 0003'
      },
      {
        name: 'GLT Osogbo',
        address: 'Osogbo, Osun State, Nigeria',
        latitude: 7.7719,
        longitude: 4.556,
        contact: '+234 800 000 0004'
      },
      {
        name: 'GLT Ilesa',
        address: 'Ilesa, Osun State, Nigeria',
        latitude: 7.6179,
        longitude: 4.7344,
        contact: '+234 800 000 0005'
      },
      {
        name: 'GLT Agricola',
        address: 'Agricola, off UI, Oyo State, Nigeria',
        latitude: 7.4487,
        longitude: 3.9059,
        contact: '+234 800 000 0006'
      },
      {
        name: 'GLT Challenge',
        address: 'Challenge, Ibadan, Oyo State, Nigeria',
        latitude: 7.3773,
        longitude: 3.9142,
        contact: '+234 800 000 0007'
      },
      {
        name: 'GLT Houston',
        address: 'Houston, Texas, USA',
        latitude: 29.7604,
        longitude: -95.3698,
        contact: '+1 800 000 0008'
      },
      {
        name: 'GLT Ondo',
        address: 'Ondo, Ondo State, Nigeria',
        latitude: 7.0934,
        longitude: 4.8357,
        contact: '+234 800 000 0009'
      },
      {
        name: 'GLT Ogbomoso',
        address: 'Ogbomoso, Oyo State, Nigeria',
        latitude: 8.1336,
        longitude: 4.243,
        contact: '+234 800 000 0010'
      },
      {
        name: 'GLT Abuja',
        address: 'Abuja, FCT, Nigeria',
        latitude: 9.0765,
        longitude: 7.3986,
        contact: '+234 800 000 0011'
      },
      {
        name: 'GLT Accra',
        address: 'Accra, Ghana',
        latitude: 5.6037,
        longitude: -0.187,
        contact: '+233 800 000 0012'
      },
      {
        name: 'GLT Enugu',
        address: 'Enugu, Enugu State, Nigeria',
        latitude: 6.5244,
        longitude: 7.5106,
        contact: '+234 800 000 0013'
      },
      {
        name: 'GLT Bayelsa',
        address: 'Yenagoa, Bayelsa State, Nigeria',
        latitude: 4.9268,
        longitude: 6.2676,
        contact: '+234 800 000 0014'
      },
      {
        name: 'GLT Ajah',
        address: 'Ajah, Lagos, Nigeria',
        latitude: 6.469,
        longitude: 3.558,
        contact: '+234 800 000 0015'
      },
      {
        name: 'GLT Isolo',
        address: 'Isolo, Lagos, Nigeria',
        latitude: 6.544,
        longitude: 3.323,
        contact: '+234 800 000 0016'
      },
      {
        name: 'GLT Egbeda',
        address: 'Egbeda, Lagos, Nigeria',
        latitude: 6.582,
        longitude: 3.291,
        contact: '+234 800 000 0017'
      },
      {
        name: 'GLT Dallas',
        address: 'Dallas, Texas, USA',
        latitude: 32.7767,
        longitude: -96.797,
        contact: '+1 800 000 0018'
      },
      {
        name: 'GLT Birmingham',
        address: 'Birmingham, United Kingdom',
        latitude: 52.4862,
        longitude: -1.8904,
        contact: '+44 800 000 0019'
      },
      {
        name: 'GLT PhaseII OAUTH',
        address: 'Phase II, OAU, Ile-Ife, Osun State, Nigeria',
        latitude: 7.524,
        longitude: 4.5428,
        contact: '+234 800 000 0020'
      },
      {
        name: 'GLT Gwagwalada',
        address: 'Gwagwalada, FCT, Nigeria',
        latitude: 8.942,
        longitude: 7.081,
        contact: '+234 800 000 0021'
      }
    ]);

    // Create Users (hash admin password so seeded admin can log in)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('123456', salt);

    await User.create({
      fullName: 'Admin User',
      email: 'admin@glt.com',
      password: hashed,
      role: 'admin',
      branch: branches[0]._id
    });

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
