import { EmailTemplate } from "@/components/EmailContactTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message, title } = await request.json();

    const { error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["support@trader-map.com"],
      subject: `New Contact Form Submission from ${name}`,
      react: EmailTemplate({
        name,
        email,
        message,
        title,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
