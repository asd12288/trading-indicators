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
  Row,
  Column,
  Hr,
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
        Welcome to Trader Map - Your subscription is now active!
      </Preview>
      <Body
        style={{
          margin: "0",
          padding: "0",
          backgroundColor: "#f5f5f5",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        <Container
          style={{
            margin: "40px auto",
            width: "600px",
            backgroundColor: "#ffffff",
            padding: "0",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header with Logo */}
          <Section
            style={{
              backgroundColor: "#152238",
              padding: "30px 0",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: "0 auto",
                fontSize: "30px",
                fontWeight: "bold",
                color: "#ffffff",
                letterSpacing: "0.5px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              Trader<span style={{ color: "#60a5fa" }}>Map</span>
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: "40px 30px 20px" }}>
            <Heading
              style={{
                color: "#152238",
                fontSize: "24px",
                fontWeight: "bold",
                margin: "0 0 30px",
                textAlign: "center",
              }}
            >
              Welcome to Trader Map! 🚀
            </Heading>

            <Text
              style={{ color: "#333333", fontSize: "16px", lineHeight: "24px" }}
            >
              Hi {userName},
            </Text>

            <Text
              style={{ color: "#333333", fontSize: "16px", lineHeight: "24px" }}
            >
              Thank you for subscribing to Trader Map. Your account has been
              activated, and you now have full access to all the powerful
              trading tools and insights our platform offers.
            </Text>

            {/* Subscription Details Box */}
            <Section
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                margin: "24px 0",
                border: "1px solid #e9ecef",
              }}
            >
              <Text
                style={{
                  color: "#152238",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "0 0 15px",
                }}
              >
                Subscription Details:
              </Text>
              <Row>
                <Column>
                  <Text
                    style={{
                      color: "#555555",
                      fontSize: "14px",
                      margin: "5px 0",
                    }}
                  >
                    <strong>Plan:</strong> {plan}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text
                    style={{
                      color: "#555555",
                      fontSize: "14px",
                      margin: "5px 0",
                    }}
                  >
                    <strong>Email:</strong> {userEmail}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text
                    style={{
                      color: "#555555",
                      fontSize: "14px",
                      margin: "5px 0",
                    }}
                  >
                    <strong>Valid until:</strong> {formattedDate}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Text
              style={{ color: "#333333", fontSize: "16px", lineHeight: "24px" }}
            >
              Get started right away with our advanced trading tools and
              real-time market analysis.
            </Text>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Link
                href="https://trader-map.com/smart-alerts"
                style={{
                  backgroundColor: "#2c64e7",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Go to Dashboard
              </Link>
            </Section>

            <Hr style={{ borderTop: "1px solid #e6e6e6", margin: "30px 0" }} />

            <Text
              style={{
                color: "#333333",
                fontSize: "16px",
                lineHeight: "24px",
              }}
            >
              If you have any questions or need assistance, our support team is
              always ready to help.
            </Text>

            <Text
              style={{
                color: "#333333",
                fontSize: "16px",
                lineHeight: "24px",
              }}
            >
              Happy Trading!
            </Text>

            <Text
              style={{
                color: "#333333",
                fontSize: "16px",
                lineHeight: "24px",
                margin: "30px 0 10px",
              }}
            >
              The Trader Map Team
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              textAlign: "center",
            }}
          >
            <Text
              style={{ color: "#666666", fontSize: "12px", margin: "0 0 10px" }}
            >
              © {new Date().getFullYear()} Trader Map. All rights reserved.
            </Text>

            <Text
              style={{ color: "#666666", fontSize: "12px", margin: "10px 0" }}
            >
              If you have any questions, contact us at{" "}
              <Link
                href="mailto:support@trader-map.com"
                style={{ color: "#2c64e7", textDecoration: "none" }}
              >
                support@trader-map.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewSubscriptionEmail;
