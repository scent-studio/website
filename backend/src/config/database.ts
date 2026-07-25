const mongoose = require('mongoose');
const env = require('./env');

interface DbOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  family: number;
  retryWrites: boolean;
  retryReads: boolean;
}

const connectDB = async (): Promise<void> => {
  const options: DbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    retryReads: true,
  };

  let retries = 5;
  let connected = false;

  while (retries > 0 && !connected) {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('error', (err: Error) => {
        console.error(`MongoDB connection error: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      connected = true;
    } catch (error: any) {
      retries -= 1;
      console.error(`MongoDB connection failed (${retries} retries left): ${error.message}`);

      if (retries === 0) {
        console.error('All MongoDB connection retries exhausted');
        process.exit(1);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;

export {};
