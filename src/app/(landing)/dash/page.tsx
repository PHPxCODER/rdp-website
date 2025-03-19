import React from "react";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { OPTIONS } from "@/auth.config";
import { siteConfig } from "@/config/site";
import SignOutButton from "@/components/ui/SignoutButton"; 
import {GradientBackground} from "@/components/ui/GradientBackground";
import GreetingMessage from "@/components/ui/GreetingMessage";
import { ConfettiFireworks } from "@/components/ui/Confetti";
import JobPostingForm from "./JobPostingForm";

export const metadata = {
  title: `Dashboard | ${siteConfig.name}`,
};

const DashPage = async () => {
  const session = await getServerSession(OPTIONS);

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="relative flex flex-col items-center top-10 justify-center">
      {/* Gradient Background */}
      <ConfettiFireworks />
      <GradientBackground />

      <div className="max-w-3xl mx-auto p-6 shadow-md rounded-lg backdrop-blur-md">
        {/* Dynamic Greeting Message */}
        <GreetingMessage />

        <h1 className="text-2xl font-semibold mt-2">
          Welcome, {session.user?.name || "User"}!
        </h1>

        <div className="mt-4 flex items-center gap-4">
          <Image
            src={session.user?.image ?? "/images/avatar.png"}
            alt={session.user?.name ?? "User Avatar"}
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <p className="text-white-600"><strong>Role:</strong> {session.user?.role || "N/A"}</p>
            <p className="text-white-600"><strong>Email:</strong> {session.user?.email || "N/A"}</p>
            <p className="text-white-600"><strong>Phone:</strong> {session.user?.phone || "N/A"}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <SignOutButton />
      </div>
      {session.user.role == "ADMIN" && <div className="mt-8 w-full max-w-3xl p-6 shadow-md rounded-lg backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4">Add a Job Posting</h2>
        <JobPostingForm />
      </div>}
    </div>
  );
};

export default DashPage;
