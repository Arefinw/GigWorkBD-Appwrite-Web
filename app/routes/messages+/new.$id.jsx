// app/routes/messages+/new.$id.jsx

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { id } = params;
  const { getSession } = await import("../../utils/session");
  const { getClientUser } = await import("../../middleware/database");
  const { createClient, ID, Query, Role, Permission } = await import(
    "../../utils/client/appwrite"
  );
  const { createAdminClient } = await import("../../utils/appwrite");
  const { DATABASE_ID, USER_COLLECTION, CONVERSATION_COLLECTION } =
    await import("../../utils/config");

  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("secret") || !session.get("userId")) {
    return redirect("/login");
  }

  try {
    const { databases } = await createAdminClient();
    const user = await getClientUser(
      session.get("userId"),
      session.get("secret")
    );

    // Get clientId
    const clientId = session.get("userId");
    console.log("clientId", clientId);

    // Get freelancerId
    const freelancer = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION,
      id
    );

    // Check for existing conversation
    const existingConversations = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      [
        Query.equal("clientId", clientId),
        Query.equal("freelancerId", freelancer.$id),
      ]
    );
    console.log("existingConversations", existingConversations);

    if (existingConversations.total > 0) {
      return redirect(`/messages/${existingConversations.documents[0].$id}`);
    }

    // Create new conversation
    const newConversation = await databases.createDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      ID.unique(),
      {
        clientId: user.$id,
        freelancerId: freelancer.$id,
        status: "online",
      },
      [
        Permission.write(Role.user(clientId)),
        Permission.write(Role.user(freelancer.userId)),
      ]
    );

    return redirect(`/messages/${newConversation.$id}`);
  } catch (error) {
    console.error(error);
    return false;
  }
}

// This route doesn't need a component since it's just a loader
export default function NewConversation() {
  return null;
}
