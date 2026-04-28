import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const databaseURL = process.env.DATABASE_URL;

console.log('STARTING SCRIPT');
console.log('DB URL:', databaseURL);

if (!databaseURL) {
  console.error('ERROR: DATABASE_URL is not defined in .env');
  process.exit(1);
}

const run = async () => {
  try {
    console.log('Connecting...');
    await mongoose.connect(databaseURL, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected successfully!');

    // The error says "test.users", so let's check the current database name
    console.log('Current DB:', mongoose.connection.name);

    const db = mongoose.connection.useDb('test'); // Force use 'test' as per error message
    console.log('Using DB:', db.name);

    const collection = db.collection('users');
    const indexes = await collection.indexes();
    
    console.log('INDEXES FOUND:');
    console.log(JSON.stringify(indexes, null, 2));

    const phoneIndex = indexes.find(idx => idx.name === 'phoneNumber_1');
    if (phoneIndex) {
      console.log('CONFIRMED: phoneNumber_1 index exists.');
    } else {
      console.log('NOT FOUND: phoneNumber_1 index does not exist in "test" DB.');
    }

    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('CAUGHT ERROR:', err.message);
    process.exit(1);
  }
};

run();
