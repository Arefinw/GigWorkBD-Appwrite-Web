// app/routes/_auth+/callback.jsx

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession, commitSession } = await import("../../utils/session");
  const { createAdminClient } = await import("../../utils/appwrite");
  const { DATABASE_ID, CLIENT_COLLECTION, FREELANCER_COLLECTION } =
    await import("../../utils/config");

  try {
    const { userId, secret } = await request.json();

    const { account } = await createAdminClient();
    const appwriteSession = await account.createSession(userId, secret);

    const session = await getSession();
    session.set("userId", appwriteSession.userId);
    session.set("secret", appwriteSession.secret);

    // Get logged in user details from Appwrite
    const user = await account.get();
    if (!user) {
      return redirect("/login");
    }

    const { databases } = await createAdminClient();
    const email = user.email;

    // Check if user already exists in our database
    const clientRes = await databases.listDocuments(
      DATABASE_ID,
      CLIENT_COLLECTION,
      [{ key: "email", value: email, operator: "equal" }]
    );
    const freelancerRes = await databases.listDocuments(
      DATABASE_ID,
      FREELANCER_COLLECTION,
      [{ key: "email", value: email, operator: "equal" }]
    );

    if (clientRes.documents.length > 0 || freelancerRes.documents.length > 0) {
      return redirect("/dashboard", {
        status: 302,
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    // If user is new, redirect to complete profile
    return redirect("/complete-profile", {
      status: 302,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error.message);
    return redirect("/login");
  }
}
