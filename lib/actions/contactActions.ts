"use server";

import { Resend } from "resend";
import { EmailContactTemplate } from "@/components/EmailContactTemplate";
import { z } from "zod";

// Define validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  title: z.string().min(2, { message: "Please select a title" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate form data
    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email
    const { error } = await resend.emails.send({
      from: "Trader Map <contact@trader-map.com>",
      to: ["support@trader-map.com"],
      subject: `Contact Form: ${formData.title} - ${formData.name}`,
      react: EmailContactTemplate({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        title: formData.title,
      }),
    });

    if (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        message: "Failed to send email. Please try again later.",
      };
    }

    return {
      success: true,
      message:
        "Your message has been sent successfully! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
