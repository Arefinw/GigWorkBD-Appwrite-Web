import { Query } from "node-appwrite";
import { createAdminClient } from "../utils/appwrite";
import { createClient } from "../utils/client/appwrite";
import { DATABASE_ID, USER_COLLECTION } from "../utils/config";

export async function getUser(userId) {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
      Query.equal("userId", userId),
    ]);

    return user.documents[0];
  } catch (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
}

export async function getClientUser(userId, secret) {
  try {
    const { databases } = await createClient(secret);

    const user = await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
      Query.equal("userId", userId),
    ]);
    console.log("userId", userId);
    console.log("user", user);
    return user.documents[0];
  } catch (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
}
