const User = require('./models/User');
const { connectDB } = require('./config/database');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MariaDB
    await connectDB();
    console.log('Connected to MariaDB');

    // Check if admin already exists
    const existingAdmin = await User.findByUsername('admin');
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
    const existingHelper = await User.findByUsername('helper');
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
