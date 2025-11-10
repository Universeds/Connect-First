const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/connect-first');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        password: '123',
        role: 'manager'
      });
      console.log('✓ Admin account created (username: admin, password: 123)');
    } else {
      console.log('✓ Admin account already exists');
    }

    // Check if helper already exists
    const existingHelper = await User.findOne({ username: 'helper' });
    if (!existingHelper) {
      await User.create({
        username: 'helper',
        password: '321',
        role: 'helper'
      });
      console.log('✓ Helper account created (username: helper, password: 321)');
    } else {
      console.log('✓ Helper account already exists');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault Accounts:');
    console.log('  Manager: username=admin, password=123');
    console.log('  Helper:  username=helper, password=321');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
