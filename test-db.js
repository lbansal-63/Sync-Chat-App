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
  process.exit(0);
} catch (error) {
  console.error('FAILURE: Could not connect to DB');
  console.error(error);
  process.exit(1);
}
