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

// const createUser = async (submission) => {
//   const { client, account, databases, users, storage } =
//     await createAdminClient();
//   // Create Auth user
//   const user = await account.create(
//     ID.unique(),
//     submission.value.email,
//     submission.value.password,
//     `${submission.value.firstName} ${submission.value.lastName}`
//   );

//   // await users.updatePrefs(user.$id, {
//   //   avatar: avatar.$id,
//   // });

//   // Update labels based on the role
//   if (role === "client") {
//     await users.updateLabels(user.$id, [`${role}`]);
//   } else if (role === "freelancer") {
//     await users.updateLabels(user.$id, [`${role}`]);
//   }

//   // Create a document for the user
//   await databases.createDocument(
//     DATABASE_ID,
//     role === "client" ? CLIENT_COLLECTION_ID : FREELANCER_COLLECTION_ID,
//     ID.unique(),
//     {
//       userId: user.$id,
//       firstName,
//       lastName,
//       role,
//     }
//   );
//   const session = await account.createEmailPasswordSession(email, password);

//   return session;
// };
