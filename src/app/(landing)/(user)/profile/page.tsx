import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import ProfileClientWrapper from "./ProfileClientWrapper";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: `Profile | ${siteConfig.name}`,
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    redirect("/auth");
  }

  // Fetch full user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      name: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
      image: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) {
    redirect("/auth");
  }

  // Prepare user data for the client component
  const userData = {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.name,
    role: user.role,
    phone: user.phoneNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    image: user.image,
    twoFactorEnabled: user.twoFactorEnabled,
  };

  return (
    <>
      <ProfileClientWrapper user={userData} />
      <Toaster />
    </>
  );
};

export default ProfilePage;