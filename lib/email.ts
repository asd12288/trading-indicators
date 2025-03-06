import { Resend } from 'resend';
import { NewSubscriptionEmail } from '@/components/emails/NewSubscriptionEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendWelcomeEmailParams {
  userName: string;
  userEmail: string;
  plan: string;
  expirationDate: string;
}

export async function sendWelcomeEmail({
  userName,
  userEmail,
  plan,
  expirationDate,
}: SendWelcomeEmailParams) {
  try {
    await resend.emails.send({
      from: 'Trader Map <noreply@trader-map.com>',
      to: userEmail,
      subject: '🎉 Welcome to Trader Map Pro!',
      react: NewSubscriptionEmail({
        userName,
        userEmail,
        plan,
        expirationDate,
      }),
    });
    console.log('✉️ Welcome email sent successfully to', userEmail);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
}
