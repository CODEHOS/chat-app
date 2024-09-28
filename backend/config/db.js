const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,   // Still needed for optimized connection handling
      useNewUrlParser: true,      // Ensures the use of the new MongoDB connection string parser
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
