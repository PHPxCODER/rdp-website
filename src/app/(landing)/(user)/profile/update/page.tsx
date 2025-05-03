import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { siteConfig } from "@/config/site";
import UpdateProfileForm from './UpdateProfileForm';

export const metadata = {
  title: `Update Profile | ${siteConfig.name}`,
};

const UpdateProfilePage = async() => {
  const session = await getServerSession(OPTIONS);
  
  if (!session) {
    redirect('/auth');
  }
  
  if (!session.user?.id) {
    redirect('/dash');
  }

  return (
    <>
      <br/>
      <UpdateProfileForm 
        initialData={{
          name: session.user.name || "",
          phone: session.user.phone || "",
          image: session.user.image || ""
        }}
        userId={session.user.id}
      />
      <Toaster />
    </>
  );
};

export default UpdateProfilePage;