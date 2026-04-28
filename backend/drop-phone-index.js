import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

const databaseURL = process.env.DATABASE_URL;

async function dropIndex() {
  try {
    console.log('Connecting to database...');
    if (!databaseURL) {
      throw new Error('DATABASE_URL is not defined in .env');
    }
    await mongoose.connect(databaseURL);
    console.log('Connected!');

    // The error says "test.users", so we check "test" database
    const db = mongoose.connection.useDb('test');
    const collection = db.collection('users');
    
    console.log('Attempting to drop "phoneNumber_1" index from "test.users"...');
    await collection.dropIndex('phoneNumber_1');
    console.log('SUCCESS: "phoneNumber_1" index dropped.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    if (err.codeName === 'IndexNotFound' || err.message.includes('index not found')) {
      console.log('INFO: "phoneNumber_1" index not found. It may have already been dropped or does not exist in the "test" database.');
      // Also check the default database from the URL if it wasn't "test"
      const defaultDb = mongoose.connection.db;
      try {
          console.log(`Checking default database "${mongoose.connection.name}"...`);
          await defaultDb.collection('users').dropIndex('phoneNumber_1');
          console.log(`SUCCESS: "phoneNumber_1" index dropped from default database "${mongoose.connection.name}".`);
      } catch (innerErr) {
          console.log(`INFO: Index not found in "${mongoose.connection.name}" either.`);
      }
      await mongoose.disconnect();
      process.exit(0);
    }
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

dropIndex();
