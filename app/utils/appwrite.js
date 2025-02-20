// app/utils/appwrite.js
import {
  Client,
  Account,
  Databases,
  Avatars,
  ID,
  Users,
  Storage,
  Permission,
  Role,
} from "node-appwrite";

import { API_ENDPOINT, PROJECT_ID, API_KEY_SECRET } from "./config";

const createAdminClient = async () => {
  try {
    const adminClient = new Client()
      .setEndpoint(API_ENDPOINT)
      .setProject(PROJECT_ID)
      .setKey(API_KEY_SECRET);

    return {
      account: new Account(adminClient),
      databases: new Databases(adminClient),
      avatars: new Avatars(adminClient),
      users: new Users(adminClient),
      storage: new Storage(adminClient),
    };
  } catch (error) {
    console.error("Error creating admin client:", error.message);
    return null;
  }
};

const createSessionClient = async (secret) => {
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
    };
  } catch (error) {
    console.error("Error creating session client:", error.message);
    return null;
  }
};

export { createAdminClient, createSessionClient, ID, Permission, Role };
