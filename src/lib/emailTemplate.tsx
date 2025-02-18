import { Html, Head, Body, Container, Text, Heading, Img, Link, Hr } from "@react-email/components";
import { CSSProperties } from "react";

interface EmailProps {
  email: string;
  unsubscribeUrl?: string;
}

export function getSubscriptionEmailTemplate({ email, unsubscribeUrl }: EmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.heading}>
            Welcome to RDP Datacenter – The Future of Cloud Hosting
          </Heading>

          <Text style={styles.text}>Dear {email},</Text>

          <Text style={styles.text}>
            Thank you for subscribing to <strong>RDP Datacenter</strong>! We’re thrilled to have you onboard as we gear
            up to launch a next-gen cloud hosting and deployment platform.
          </Text>

          <Text style={styles.text}>As an early subscriber, you&#39;ll get exclusive access to:</Text>

          <ul style={styles.list}>
            <li>Early beta invitations</li>
            <li>Exclusive launch offers</li>
            <li>Feature previews and updates</li>
            <li>Insights into our roadmap</li>
            <li>Priority support and feedback opportunities</li>
          </ul>

          <Text style={styles.text}>
            Stay tuned—our platform is launching soon! Visit{" "}
            <Link href="https://rdpdatacenter.cloud/" style={styles.link}>
              rdpdatacenter.cloud
            </Link>{" "}
            for updates.
          </Text>

          <Text style={styles.text}>
            We appreciate your support and can&#39;t wait to build the future of cloud with you.
          </Text>

          <Text style={styles.signature}>Best regards, <br />The RDP Datacenter Team</Text>

          <Hr style={styles.hr} />

          <Footer unsubscribeUrl={unsubscribeUrl} />
        </Container>
      </Body>
    </Html>
  );
}

export function getUnsubscribeEmailTemplate({ email }: EmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h2" style={{ ...styles.heading, color: "#FF5733" }}>
            We&#39;re Sorry to See You Go
          </Heading>

          <Text style={styles.text}>Dear {email},</Text>

          <Text style={styles.text}>
            We noticed that you&#39;ve unsubscribed from our updates. We respect your decision, but we&#39;d love to keep you
            informed about our latest cloud innovations.
          </Text>

          <Text style={styles.text}>
            If you ever wish to rejoin, we’d be delighted to welcome you back. The future of enterprise-grade cloud
            hosting is just getting started.
          </Text>

          <Text style={styles.text}>Thank you for your time, and we hope to see you again!</Text>

          <Text style={styles.signature}>Best regards, <br />The RDP Datacenter Team</Text>

          <Hr style={styles.hr} />

          <Footer unsubscribeUrl="#" />
        </Container>
      </Body>
    </Html>
  );
}

// 📌 Reusable Footer Component
const Footer = ({ unsubscribeUrl }: { unsubscribeUrl?: string }) => (
  <Container style={styles.footer}>
    <div style={styles.footerTop}>
      <Img
        src="https://res.cloudinary.com/dzmuvpq5s/image/upload/v1736792428/musicbyilluzon/musicbyilluzon.png"
        alt="RDP Datacenter Logo"
        height="50"
        style={styles.logo}
      />
      <div>
        <Text style={styles.companyName}>RDP Datacenter</Text>
        <Text style={styles.tagline}>Enterprise-Grade Cloud Hosting</Text>
      </div>
    </div>

    <div style={styles.socialIcons}>
      <Link href="https://x.com/rdpdatacenter">
        <Img src="https://react.email/static/x-logo.png" alt="Twitter" height="36" />
      </Link>
      <Link href="https://linkedin.com/company/rdp-datacenter">
        <Img src="https://react.email/static/in-icon.png" alt="LinkedIn" height="36" />
      </Link>
    </div>

    <Text style={styles.contact}>
      <Link href="https://rdpdatacenter.cloud/" style={styles.link}>rdpdatacenter.cloud</Link> |{" "}
      <Link href="mailto:noc@rdpdatacenter.cloud" style={styles.link}>noc@rdpdatacenter.cloud</Link>
    </Text>

    {unsubscribeUrl && (
      <Text style={styles.unsubscribe}>
        To unsubscribe, <Link href={unsubscribeUrl} style={styles.link}>click here</Link>.
      </Text>
    )}
  </Container>
);

// 📌 Updated Styles
const styles: Record<string, CSSProperties> = {
  body: { backgroundColor: "#f4f4f4", padding: "20px" },
  container: { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "600px", margin: "auto" },
  heading: { color: "#007BFF", textAlign: "center", marginBottom: "20px" },
  text: { fontSize: "16px", color: "#333", lineHeight: "1.6" },
  list: { paddingLeft: "20px" },
  link: { color: "#007BFF", textDecoration: "none" },
  signature: { marginTop: "20px" },
  hr: { margin: "20px 0", borderTop: "2px solid #ccc" },

  // 📌 Footer Styles
  footer: { textAlign: "center", marginTop: "20px", paddingTop: "20px" },
  footerTop: { display: "flex", flexDirection: "column", alignItems: "center" },
  logo: { marginBottom: "8px" },
  companyName: { fontWeight: "bold", fontSize: "16px", color: "#333" },
  tagline: { color: "#777", marginTop: "2px", fontSize: "14px" },
  socialIcons: { display: "flex", justifyContent: "center", gap: "12px", margin: "16px 0" },
  contact: { color: "#555", marginTop: "8px", fontSize: "14px" },
  unsubscribe: { fontSize: "12px", color: "#aaa", marginTop: "16px" },
};