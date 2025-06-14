// app/utils/client/appwrite.js
import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_API_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);

export { client, databases };
