const mongoose = require('mongoose');

// MongoDB connection string
// For local MongoDB: 'mongodb://localhost:27017/connect_first'
// For MongoDB Atlas: Use your connection string from Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/connect_first';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB Connected Successfully');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
