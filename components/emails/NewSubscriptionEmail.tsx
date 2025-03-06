import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NewSubscriptionEmailProps {
  userName: string;
  userEmail: string;
  plan: string;
  expirationDate: string;
}

export const NewSubscriptionEmail = ({
  userName,
  userEmail,
  plan,
  expirationDate,
}: NewSubscriptionEmailProps) => {
  const formattedDate = new Date(expirationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Trader Map Pro - Your subscription is now active!
      </Preview>
      <Body
        style={{
          margin: "0",
          padding: "0",
          backgroundColor: "#0f172a",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        <Container
          style={{
            margin: "40px auto",
            width: "465px",
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Heading
            style={{
              color: "#f1f5f9",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "30px 0",
            }}
          >
            Welcome to Trader Map Pro! 🚀
          </Heading>

          <Text
            style={{ color: "#cbd5e1", fontSize: "16px", lineHeight: "24px" }}
          >
            Hi {userName},
          </Text>

          <Section
            style={{
              backgroundColor: "#334155",
              padding: "16px",
              borderRadius: "8px",
              margin: "24px 0",
            }}
          >
            <Text style={{ color: "#e2e8f0", fontSize: "14px", margin: "0" }}>
              <strong>Subscription Details:</strong>
            </Text>
            <Text
              style={{ color: "#cbd5e1", fontSize: "14px", margin: "8px 0" }}
            >
              Plan: {plan}
            </Text>
            <Text
              style={{ color: "#cbd5e1", fontSize: "14px", margin: "8px 0" }}
            >
              Email: {userEmail}
            </Text>
            <Text
              style={{ color: "#cbd5e1", fontSize: "14px", margin: "8px 0" }}
            >
              Valid until: {formattedDate}
            </Text>
          </Section>

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Link
              href="https://trader-map.com/smart-alerts"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Go to Dashboard
            </Link>
          </Section>

          <Text style={{ color: "#94a3b8", fontSize: "12px" }}>
            If you have any questions, contact us at support@trader-map.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewSubscriptionEmail;
