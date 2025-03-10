import * as React from "react";

interface NewSubscriptionEmailProps {
  userName: string;
  userEmail: string;
  plan: string;
  subscriptionDate: string;
}

const NewSubscriptionEmail: React.FC<NewSubscriptionEmailProps> = ({
  userName,
  userEmail,
  plan,
  subscriptionDate,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ color: "#333", textAlign: "center" }}>🎉 Welcome to {plan} Plan!</h2>
      <p>Hi {userName},</p>
      <p>
        Thank you for subscribing to our <strong>{plan}</strong> plan! Your subscription is now active as of{" "}
        <strong>{subscriptionDate}</strong>.
      </p>
      <p>
        You can now enjoy all the premium features and benefits. If you have any questions, feel free to reach out to
        our support team.
      </p>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <a
          href="https://trader-map.com/smart-alerts"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Go to Dashboard
        </a>
      </div>

      <p style={{ fontSize: "12px", color: "#777", marginTop: "30px" }}>
        If you didn't sign up for this subscription, please contact our support at{" "}
        <a href="mailto:support@trader-map.com">support@trader-map.com</a>.
      </p>

      <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ddd" }} />
      <p style={{ fontSize: "12px", color: "#777", textAlign: "center" }}>
        © {new Date().getFullYear()} Trader map. All rights reserved.
      </p>
    </div>
  );
};

export default NewSubscriptionEmail;
