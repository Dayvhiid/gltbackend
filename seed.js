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
    const mainBranch = await Branch.create({
      name: 'GLT Main Headquarters',
      address: 'lekki lagos nigeria',
      latitude: 6.4698,
      longitude: 3.5852,
      contact: '+1 234 567 890'
    });

    const ikejaBranch = await Branch.create({
      name: 'GLT ikeja Branch',
      address: 'ikeja lagos',
      latitude: 6.6018,
      longitude: 3.3515,
      contact: '+1 987 654 321'
    });

    const AgricolaBranch = await Branch.create({
      name: 'GLT Agricols Branch',
      address: 'Agricola, off ui Oyo state',
      latitude: 7.4487,
      longitude: 3.9059,
      contact: '+1 987 654 321'
    });

    // Create Users (hash admin password so seeded admin can log in)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('123456', salt);

    await User.create({
      fullName: 'Admin User',
      email: 'admin@glt.com',
      password: hashed,
      role: 'admin',
      branch: mainBranch._id
    });

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
