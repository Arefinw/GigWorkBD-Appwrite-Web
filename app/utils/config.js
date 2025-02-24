// utils/config.js
import dotenv from "dotenv";
dotenv.config();

const API_ENDPOINT = process.env.API_ENDPOINT;
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY_SECRET = process.env.API_KEY_SECRET;
const DATABASE_ID = process.env.DATABASE_ID;
const USER_COLLECTION = process.env.USER_COLLECTION;
const GIG_COLLECTION = process.env.GIG_COLLECTION;
const APPLICATION_COLLECTION = process.env.APPLICATION_COLLECTION;
const PROFILE_BUCKET = process.env.PROFILE_BUCKET;
const SESSION_SECRET = process.env.SESSION_SECRET;

export {
  API_ENDPOINT,
  PROJECT_ID,
  API_KEY_SECRET,
  DATABASE_ID,
  USER_COLLECTION,
  GIG_COLLECTION,
  APPLICATION_COLLECTION,
  PROFILE_BUCKET,
  SESSION_SECRET,
};
