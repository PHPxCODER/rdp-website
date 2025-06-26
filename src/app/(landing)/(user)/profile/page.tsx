import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { OPTIONS } from "@/auth.config";
import { siteConfig } from "@/config/site";
import ProfileClientWrapper from "./ProfileClientWrapper";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: `Profile | ${siteConfig.name}`,
};

const ProfilePage = async () => {
  const session = await getServerSession(OPTIONS);

  if (!session || !session.user) {
    redirect("/auth");
  }

  // Prepare user data for the client component
  const userData = {
    id: session.user.id,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    name: session.user.name,
    role: session.user.role,
    phone: session.user.phone,
    createdAt: session.user.createdAt,
    updatedAt: session.user.updatedAt,
    image: session.user.image,
    twoFactorEnabled: session.user.twoFactorEnabled,
  };

  return (
    <>
      <ProfileClientWrapper user={userData} />
      <Toaster />
    </>
  );
};

export default ProfilePage;