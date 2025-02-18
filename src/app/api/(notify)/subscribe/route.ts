import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/nodemailer';
import { getSubscriptionEmailTemplate } from '@/lib/emailTemplate';
import { render } from '@react-email/render';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
    }

    // Check if the user is already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (existingSubscriber) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 409 });
    }

    // Generate token and expiry date
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 1);

    // Save the subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        tokenExpiry,
      },
    });

    // Generate unsubscribe URL
    const unsubscribeUrl = `${process.env.NEXTAUTH_URL}/api/unsubscribe?token=${subscriber.token}`;

    // Generate email HTML using react-email renderer
    const emailComponent = getSubscriptionEmailTemplate({ email, unsubscribeUrl });
    const html = await render(emailComponent);

    // Send confirmation email
    const subject = 'Thank You for Subscribing!';
    await sendEmail(email, subject, html);

    return NextResponse.json({ message: 'Subscription Successful!' }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
