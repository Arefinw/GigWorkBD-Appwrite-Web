import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createAdminClient, ID } from "../../utils/appwrite";

export async function loader({ request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return redirect("/login");
  }

  retu;
}
