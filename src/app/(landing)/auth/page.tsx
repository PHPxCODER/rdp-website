import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import SigninForm from './SigninForm'
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Sign In | ${siteConfig.name}`,
};

const page = async() => {
  const session = await getServerSession()
  if(session){
    redirect('/dash')
  }
  return (
    <>
    <br/>
    <SigninForm />
    <Toaster />
    </>
  )
}

export default page