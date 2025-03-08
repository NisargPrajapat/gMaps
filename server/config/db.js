import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      retryWrites: true,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Retry connection after delay
    console.log('⏳ Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Event listeners for connection management
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Disconnected! Reconnecting...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB Error:', error);
  mongoose.disconnect(); // Will trigger disconnected event and reconnection
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

export default connectDB;