import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import SignupForm from './SignupForm'
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Sign Up | ${siteConfig.name}`,
};

const page = async() => {
  const session = await auth.api.getSession({ headers: await headers() })
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