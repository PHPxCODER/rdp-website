import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import SignupForm from './SignupForm'
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Sign Up | ${siteConfig.name}`,
};

const page = async() => {
  const session = await getServerSession()
  if(session){
    redirect('/dash')
  }
  return (
    <>
    <br/>
    <SignupForm />
    <Toaster />
    </>
  )
}

export default page