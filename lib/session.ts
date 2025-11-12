import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export async function getSession() {
  const session = await getServerSession(authOptions)
  console.log("Session retrieved:", JSON.stringify(session, null, 2))
  return session
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  console.log("User ID from session:", session?.user?.id)
  return session?.user?.id ?? null
}
