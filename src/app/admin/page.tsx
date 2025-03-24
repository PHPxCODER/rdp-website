// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";

export default async function AdminDashboardPage() {
  const session = await getServerSession(OPTIONS);
  
  // Server-side protection
  if (!session) {
    redirect("/auth");
  }
  
  if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
    redirect("/dash");
  }

  // Redirect to the jobs management page which is our main admin view
  redirect("/admin/jobs");
}