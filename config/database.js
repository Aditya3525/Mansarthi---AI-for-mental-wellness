const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mental-wellbeing-app');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        console.error('Please ensure MongoDB is running and accessible');
        process.exit(1);
    }
};

module.exports = connectDB;