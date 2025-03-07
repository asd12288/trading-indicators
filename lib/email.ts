import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Welcome Email
// Welcome Email (Styled)
export async function sendWelcomeProEmail({
  userName,
  userEmail,
  expirationDate,
}: {
  userName: string;
  userEmail: string;
  expirationDate: string;
}) {
  await resend.emails.send({
    from: "support@trader-map.com",
    to: userEmail,
    subject: "🎉 Welcome to Trader Map Pro!",
    html: `
      <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px; background-color:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
        <h2 style="color:#0f172a; font-size:24px; margin-bottom:16px;">🎉 Welcome to Trader Map Pro, ${userName}!</h2>
        <p style="color:#334155; font-size:16px; line-height:1.5;">
          Your subscription is now active until <strong>${new Date(expirationDate).toLocaleDateString()}</strong>.
        </p>
        <p style="color:#334155; font-size:16px; line-height:1.5;">
          Enjoy premium features including advanced analytics, real-time updates, and more.
        </p>
        <div style="margin-top:24px; text-align:center;">
          <a href="https://trader-map.com" style="background-color:#0f172a; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px;">Go to Your Dashboard</a>
        </div>
        <p style="margin-top:32px; color:#64748b; font-size:14px; text-align:center;">
          Need help? Contact us at <a href="mailto:support@trader-map.com" style="color:#475569;">support@trader-map.com</a>
        </p>
      </div>
    `,
  });
}


export async function sendReceiptEmail({
  userEmail,

  amount,
  paymentMethod,
  date,
}: {
  userName: string;
  userEmail: string;
  paymentId: string;
  amount: string;
  paymentMethod: string;
  date: string;
}) {
  await resend.emails.send({
    from: "billing@trader-map.com",
    to: userEmail,
    subject: "📄 Trader Map Payment Receipt",
    html: `
      <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px; background-color:#f8fafc; border-radius:10px;">
        <h2 style="text-align:center; color:#0f172a;">Payment Receipt</h2>
        <p style="color:#334155;">Hi ${userEmail},</p>
        <p style="color:#334155;">
          Thank you for your payment! Here are the details:
        </p>
        <table style="width:100%; border-collapse:collapse; margin-top:20px;">
          <tr>
            <td style="border-bottom:1px solid #e2e8f0; padding:10px; color:#475569;"><strong>Payment ID</strong></td>
          </tr>
          <tr>
            <td style="padding:10px; color:#475569;"><strong>Amount</strong></td>
            <td style="padding:10px; color:#475569;">${amount}$</td>
          </tr>
          <tr>
            <td style="padding:10px; color:#475569;"><strong>Payment Method</strong></td>
            <td style="padding:10px; color:#475569;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding:10px; color:#475569;"><strong>Date</strong></td>
            <td style="padding:10px; color:#475569;">${new Date(date).toLocaleString()}</td>
          </tr>
        </table>
        <p style="text-align:center; margin-top:30px;">
          <a href="https://trader-map.com/dashboard" style="background-color:#1e293b; color:white; padding:10px 20px; border-radius:6px; text-decoration:none;">View Your Account</a>
        </p>
        <p style="margin-top:30px; color:#64748b; font-size:14px; text-align:center;">
          If you have questions, contact <a href="mailto:support@trader-map.com" style="color:#64748b;">support@trader-map.com</a>.
        </p>
      </div>
    `,
  });
}
