import { Query } from "node-appwrite";
import { createAdminClient } from "../utils/appwrite";
import { DATABASE_ID, USER_COLLECTION } from "../utils/config";

export async function getUser(userId) {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
      Query.equal("userId", userId),
    ]);

    return user.documents[0].$id;
  } catch (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
}
