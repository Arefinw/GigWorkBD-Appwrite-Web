// app/controllers/authController.js
import { createAdminClient, createSessionClient, ID } from "../utils/appwrite";
import { getSession, commitSession } from "../utils/session";
import {
  DATABASE_ID,
  CLIENT_COLLECTION,
  FREELANCER_COLLECTION,
} from "../utils/config";

export async function createUser(submission) {
  let user;
  try {
    const { account, databases, users, storage } = await createAdminClient();

    // Create Auth user
    user = await account.create(
      ID.unique(),
      submission.value.email,
      submission.value.password,
      `${submission.value.firstName} ${submission.value.lastName}`
    );

    // Update Phone number
    await account.updatePhone(user.$id, submission.value.phone);

    // Get user data
    const { password, ...userData } = submission.value;
    // Update labels based on the role
    if (userData.role === "client") {
      await users.updateLabels(user.$id, [`${userData.role}`]);
    } else if (userData.role === "freelancer") {
      await users.updateLabels(user.$id, [`${userData.role}`]);
    }

    // Verification
    await account.createEmailVerification(
      `${window.location.origin}/verifyEmail`
    );

    // Create session
    const session = await account.createEmailPasswordSession(
      userData.email,
      password
    );

    // Create a document for the user
    await databases.createDocument(
      DATABASE_ID,
      userData.role === "client" ? CLIENT_COLLECTION : FREELANCER_COLLECTION,
      ID.unique(),
      {
        user: user.$id,
        ...userData,
      }
    );

    return session;
  } catch (error) {
    console.error("Registration user:", error.message);

    // TODO: Clean up
    // if (user?.$id) {
    //   await account.deleteUser(user.$id);
    // }
    throw new Error(`Registration failed: ${error.message}`);
  }
}

export async function registerWithGoogle() {
  try {
    // Create session client
    const { account } = await createSessionClient();

    // Create OAuth2 session
    const session = await account.createOAuth2Session(
      "google",
      `${window.location.origin}/callback`,
      `${window.location.origin}/callback`
    );
    return session;
  } catch (error) {
    console.error("Registration user:", error.message);
    throw new Error(`Registration failed: ${error.message}`);
  }
}
