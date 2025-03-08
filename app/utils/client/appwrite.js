// app/utils/client/appwrite.js
import {
  Account,
  Client,
  Databases,
  Storage,
  ID,
  Query,
  Role,
  Permission,
} from "appwrite";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const MESSAGE_COLLECTION = import.meta.env.VITE_MESSAGE_COLLECTION;
export const CONVERSATION_COLLECTION = import.meta.env
  .VITE_CONVERSATION_COLLECTION;

const createClient = async (secret) => {
  try {
    const client = new Client()
      .setEndpoint(API_ENDPOINT)
      .setProject(PROJECT_ID);
    if (secret) {
      await client.setSession(secret);
    }

    return {
      account: new Account(client),
      databases: new Databases(client),
      storage: new Storage(client),
      client,
    };
  } catch (error) {
    console.error("Error creating session client:", error.message);
    return null;
  }
};

export { createClient, ID, Query, Role, Permission };
