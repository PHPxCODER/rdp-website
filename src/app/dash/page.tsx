import React from 'react'
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { OPTIONS } from "@/auth.config"
import { siteConfig }  from '@/config/site'

export const metadata = {
    title: `Dashboard | ${siteConfig.name}`,
  };

const DashPage = async() => {
  const session = await getServerSession(OPTIONS)
  if(!session){
    redirect('/auth')
  }
  return (
    <div>
    <h1>Welcome {session.user?.role}<br/>
    {session.user?.email}<br/>
    {session.user?.phone}<br/>
    </h1><Image src={session.user?.image ?? '/images/avatar.png'} alt={session.user?.name ?? ''} width={100} height={100} /> 
    </div>
  )
}

export default DashPage