import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './backend/.env') });

const databaseURL = process.env.DATABASE_URL;

console.log('Attempting to connect to:', databaseURL);

try {
  await mongoose.connect(databaseURL);
  console.log('SUCCESS: Connected to DB');
  
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const usersCollection = collections.find(c => c.name === 'users');

  if (usersCollection) {
    const indexes = await db.collection('users').indexes();
    console.log('Indexes on users collection:');
    console.log(JSON.stringify(indexes, null, 2));
  } else {
    console.log('Users collection not found.');
  }

  process.exit(0);
} catch (error) {
  console.error('FAILURE:');
  console.error(error);
  process.exit(1);
}
