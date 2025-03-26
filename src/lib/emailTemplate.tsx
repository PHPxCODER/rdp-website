import { Html, Head, Body, Container, Text, Heading, Img, Link, Hr } from "@react-email/components";
import { CSSProperties } from "react";
import { randomInt } from "crypto";

interface EmailProps {
  email: string;
  unsubscribeUrl?: string;
}

export function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

export function html({ token, host }: { token: string; host: string }): string {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  // Format token into groups of 3 for better readability
  const formattedToken = token.length === 6 
  ? `${token.substring(0, 2)}${token.substring(2, 4)}${token.substring(4, 6)}`
  : token;

  // Premium modern color scheme
  const colors = {
    background: "#F7F9FC",
    primary: "#8B5CF6", // Indigo
    text: "#1F2937", // Near black
    primaryDark: "#7C3AED",
    primaryGradientStart: "#818CF8", // Lighter indigo for gradient
    primaryGradientEnd: "#4F46E5", // Darker indigo for gradient
    secondary: "#10B981", // Emerald
    dark: "#111827",
    gray: "#4B5563",
    lightGray: "#9CA3AF",
    border: "#E5E7EB",
    textSecondary: "#6B7280", // Medium gray
    success: "#10B981", // Green for confirmation elements
    white: "#FFFFFF"
  };

  // Current year
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Your Verification Code</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    table {border-collapse: collapse;}
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <style>
    @media only screen and (min-width: 600px) {
      .card-container {
        padding: 40px 24px !important;
      }
      .card {
        width: 480px !important;
        border-radius: 24px !important;
      }
      .card-footer {
        border-bottom-left-radius: 24px !important;
        border-bottom-right-radius: 24px !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      .dark-mode-only {
        display: block !important;
      }
      .light-mode-only {
        display: none !important;
      }
    }
  </style>
</head>
<body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; padding: 0; background-color: ${colors.background}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Email wrapper -->
  <div class="card-container" style="padding: 20px 10px;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <!-- Main card -->
          <table class="card" width="100%" style="max-width: 480px; border-collapse: separate; border-spacing: 0; overflow: hidden; border-radius: 16px; background-color: ${colors.white}; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Header with brand logo or name -->
            <tr>
              <td>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="text-align: center; padding: 32px 30px 24px;">
                      <!-- Brand symbol/logo placeholder - replace with your branding -->
                      <div style="height: 42px; width: 42px; border-radius: 12px; margin: 0 auto; background: linear-gradient(135deg, ${colors.primaryGradientStart} 0%, ${colors.primaryGradientEnd} 100%); text-align: center; font-weight: bold; color: white; font-size: 24px; line-height: 42px;">
                        R
                      </div>
                      <p style="margin: 14px 0 0; font-size: 16px; font-weight: 600; color: ${colors.dark};">
                        RDP Datacenter</p>
                      <p style="margin: 0px 0 0; font-size: 12px; font-weight: 600; color: ${colors.dark};"> 
                        ${escapedHost}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Main content -->
            <tr>
              <td style="padding: 0 30px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td>
                      <h1 style="margin: 0 0 16px; font-size: 24px; line-height: 1.25; color: ${colors.dark}; font-weight: 700; text-align: center;">
                        Verification Code
                      </h1>
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: ${colors.gray}; text-align: center;">
                        Use the code below to complete your sign-in
                      </p>
                      
                      <!-- OTP Container -->
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 32px;">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%); border-radius: 16px; padding: 24px 0; width: 100%;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <td>
                                    <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: ${colors.primary}; text-align: center;">
                                      ${formattedToken}
                                    </div>
                                    
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Info text -->
                      <p style="margin: 0 0 20px; font-size: 15px; line-height: 24px; color: ${colors.text};">
                        This code will expire in <span style="color: ${colors.primaryDark}; font-weight: 600;">3 minutes</span>.
                      </p>
                      <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: ${colors.gray};">
                        If you didn't request this code, you can safely ignore this message. Someone might have typed your email address by mistake.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Security tip section -->
            <tr>
              <td style="padding: 0 30px 32px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FAFAFA; border-radius: 12px; overflow: hidden; border-left: 4px solid ${colors.success};">
                  <tr>
                    <td style="padding: 16px;">
                      <p style="margin: 0; font-size: 14px; color: ${colors.textSecondary};">
                        <strong style="color: ${colors.success};">Security Note:</strong> We will never ask you to share your verification code.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer with subtle branding - contained within main card -->
            <tr>
              <td>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FAFAFA; border-top: 1px solid ${colors.border}; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;" class="card-footer">
                  <tr>
                    <td style="padding: 24px 30px; text-align: center;">
                      <p style="margin: 0 0 16px; font-size: 13px; line-height: 20px; color: #333333; text-align: center; font-weight: 500;">
                        © ${currentYear} RDP Datacenter. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; line-height: 18px; color: #666666;">
                        This is an automated message. Please do not reply.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
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
            <Link href="https://rdpdatacenter.in/" style={styles.link}>
              rdpdatacenter.in
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
      <Link href="https://rdpdatacenter.in/" style={styles.link}>rdpdatacenter.in</Link> |{" "}
      <Link href="mailto:noc@rdpdatacenter.in" style={styles.link}>noc@rdpdatacenter.in</Link>
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