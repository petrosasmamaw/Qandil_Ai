"use server";

import { auth } from "@/lib/auth";
import { headers, redirect } from "next/headers";

export async function signOutAction() {
  const headersList = await headers();
  const signOutCookie = headersList.get("cookie") || "";

  await auth.api.signOut({
    headers: { cookie: signOutCookie },
  });

  redirect("/auth/login");
}
