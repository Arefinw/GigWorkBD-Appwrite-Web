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
import Cookies from "js-cookie";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const USER_COLLECTION = import.meta.env.VITE_USER_COLLECTION;
export const MESSAGE_COLLECTION = import.meta.env.VITE_MESSAGE_COLLECTION;
export const CONVERSATION_COLLECTION = import.meta.env
  .VITE_CONVERSATION_COLLECTION;

async function createClient(session) {
  const client = new Client()
    .setEndpoint(API_ENDPOINT) // Correct endpoint URL
    .setProject(PROJECT_ID); // Correct project ID method
  if (session) {
    client.setSession(session);
  }
  const COOKIE_KEY = `a_session_${PROJECT_ID}`;

  Cookies.set(COOKIE_KEY, session);

  const cookieFallback = {
    [COOKIE_KEY]: session,
  };
  console.log(cookieFallback);
  localStorage.setItem("cookieFallback", JSON.stringify(cookieFallback));

  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    client,
  };
}

export { createClient, ID, Query, Role, Permission };
