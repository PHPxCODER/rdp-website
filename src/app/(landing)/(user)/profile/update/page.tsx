import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import UpdateProfileForm from './UpdateProfileForm';

export const metadata = {
  title: `Update Profile | ${siteConfig.name}`,
};

const UpdateProfilePage = async() => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/auth');
  }

  if (!session.user?.id) {
    redirect('/dash');
  }

  // Fetch full user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      image: true,
    },
  });

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <br/>
      <UpdateProfileForm
        initialData={{
          name: user.name || "",
          phone: user.phoneNumber || "",
          image: user.image || ""
        }}
        userId={user.id}
      />
      <Toaster />
    </>
  );
};

export default UpdateProfilePage;