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
import { API_ENDPOINT, PROJECT_ID } from "../config";

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
