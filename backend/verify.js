import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const databaseURL = process.env.DATABASE_URL;

async function checkIndexes() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(databaseURL);
    console.log('Connected!');

    const collection = mongoose.connection.db.collection('users');
    const indexes = await collection.indexes();
    
    console.log('Current indexes on "users" collection:');
    console.log(JSON.stringify(indexes, null, 2));

    const phoneIndex = indexes.find(idx => idx.name === 'phoneNumber_1');
    if (phoneIndex) {
      console.log('FOUND: phoneNumber_1 index exists.');
    } else {
      console.log('NOT FOUND: phoneNumber_1 index does not exist.');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkIndexes();
