import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/nodemailer';
import { getUnsubscribeEmailTemplate } from '@/lib/emailTemplate';
import { render } from '@react-email/render';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Invalid or missing token.' }, { status: 400 });
    }

    // Find subscriber by token
    const subscriber = await prisma.subscriber.findUnique({ where: { token } });

    if (!subscriber) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 404 });
    }

    // Check if the token has expired
    if (new Date() > subscriber.tokenExpiry) {
      return NextResponse.json({ message: 'Token has expired.' }, { status: 400 });
    }

    const email = subscriber.email;

    // Delete the subscriber
    await prisma.subscriber.delete({ where: { token } });

    // Render React Email template into HTML
    const emailHtml = await render(getUnsubscribeEmailTemplate({ email }));

    // Send "Sorry to see you go" email
    const subject = 'Sorry to See You Go';

    try {
      await sendEmail(email, subject, emailHtml);
      console.log('Unsubscribe email sent successfully');
    } catch (emailError) {
      console.error('Error sending unsubscribe email:', emailError);
    }

    return NextResponse.redirect(`${process.env.PROD_URL}/unsubscribed?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Error Unsubscribing:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}
