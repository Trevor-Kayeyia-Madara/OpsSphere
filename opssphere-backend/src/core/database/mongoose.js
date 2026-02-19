const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose 7+ automatically uses new URL parser and unified topology
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = connectDB;
