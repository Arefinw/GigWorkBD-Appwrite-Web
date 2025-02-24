// app/routes/_auth+/verify.jsx

export async function loader({ request, params }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../utils/session");
  const { createSessionClient } = await import("../../utils/appwrite");
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("secret") || !session.get("userId")) {
    return redirect("/login");
  }
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");

  console.log("userId", userId);
  console.log("secret", secret);
  const { account } = await createSessionClient(session.get("secret"));

  await account.updateVerification(userId, secret);

  return true;
}
