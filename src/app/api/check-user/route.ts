import {  NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkUser(req: NextRequest) {
    console.log(req)
    const body = await req.json();
  const { email } = body;

    const exists = await prisma.user.findFirst({
        where: {
            email: {
                equals: email
            }
        }
    })

    console.log(email, exists)

    return NextResponse.json({exists: !(exists == null)})
}

export {checkUser as POST}