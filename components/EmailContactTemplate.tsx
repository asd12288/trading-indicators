import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
  title: string;
}

export const EmailContactTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  message,
  title,
}) => (
  <div style={{ fontFamily: "sans-serif", lineHeight: 1.6 }}>
    <h1 style={{ color: "#333795" }}>New Contact Form Submission</h1>
    <div
      style={{
        backgroundColor: "#f7f9fc",
        padding: "20px",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>Contact Information</h2>
      <p style={{ margin: "0 0 5px 0" }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ margin: "0 0 5px 0" }}>
        <strong>Email:</strong> {email}
      </p>
      <p style={{ margin: "0 0 5px 0" }}>
        <strong>Title/Role:</strong> {title}
      </p>
    </div>

    <div
      style={{
        backgroundColor: "#f7f9fc",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>Message</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
    </div>

    <div style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>
      <p>This message was sent from the Trader Map contact form.</p>
    </div>
  </div>
);
