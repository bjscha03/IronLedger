import { redirect } from "next/navigation";

// Temporarily redirect to dashboard for UI preview
// Will add auth check back when database is set up

export default function Home() {
  redirect("/dashboard");
}
