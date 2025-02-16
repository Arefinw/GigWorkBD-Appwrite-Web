// app/controllers/authController.js
import {
  createAdminClient,
  createSessionClient,
  ID,
  Permission,
  Role,
} from "../utils/appwrite";
import { getSession, commitSession } from "../utils/session";
import {
  DATABASE_ID,
  CLIENT_COLLECTION,
  FREELANCER_COLLECTION,
  USER_COLLECTION,
} from "../utils/config";
import { Permission } from "node-appwrite";

//  Create user
export async function createUser(submission) {
  let user;
  try {
    const { account, databases, users, storage } = await createAdminClient();

    // Get user data
    const { password, confirmPassword, firstName, lastName, ...userData } =
      submission.value;

    // Create Auth user
    user = await account.create(
      ID.unique(),
      userData.email,
      password,
      `${firstName} ${lastName}`
    );

    // Update labels based on the role
    if (userData.role === "client") {
      await users.updateLabels(user.$id, [`${userData.role}`]);
    } else if (userData.role === "freelancer") {
      await users.updateLabels(user.$id, [`${userData.role}`]);
    }

    // Create session
    const session = await account.createEmailPasswordSession(
      userData.email,
      password
    );

    // Create a document for the user
    await databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION,
      ID.unique(),
      {
        userId: user.$id,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        provider: "email",
        ...userData,
      },
      [Permission.write(Role.user(user.$id))]
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

export async function registerWithGoogle(origin) {
  try {
    // Create session client
    const { account } = await createAdminClient();

    // Create OAuth2 session
    const appwriteSession = await account.createOAuth2Session(
      "google",
      `${origin}/callback`,
      `${origin}/callback`
    );
    return appwriteSession;
  } catch (error) {
    console.error("Registration user:", error.message);
    throw new Error(`Registration failed: ${error.message}`);
  }
}

//  Login
export async function login(submission) {
  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession(
    submission.value.email,
    submission.value.password
  );
  return session;
}

//  Login with Google
export async function loginWithGoogle(origin) {
  try {
    // Create session client
    const { account } = await createSessionClient();

    // Create OAuth2 session
    const session = await account.createOAuth2Session(
      "google",
      `${origin}/callback`,
      `${origin}/callback`
    );
    return session;
  } catch (error) {
    console.error("Login user:", error.message);
    throw new Error(`Login failed: ${error.message}`);
  }
}

//  Logout
export async function logout() {
  return null;
}
