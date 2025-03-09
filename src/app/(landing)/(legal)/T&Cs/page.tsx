import { GradientBackground } from "@/components/ui/GradientBackground";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `T&Cs | ${siteConfig.name}`,
};

export default function TermsAndConditions() {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GradientBackground />
        <div className="w-full max-w-4xl rounded-2xl border border-border p-8 shadow-lg bg-transparent backdrop-blur">
          <h1 className="text-4xl font-bold mb-6 text-center">Terms & Conditions</h1>
          <p className="mb-4">Effective Date: 20th February 2025</p>
  
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              These Terms & Conditions govern your use of <span className="font-semibold">RDP Datacenter</span>. By accessing our services, you agree to comply with these terms.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">2. User Obligations</h2>
            <p>As a user, you agree to:</p>
            <ul className="list-disc list-inside">
              <li>Provide accurate registration details</li>
              <li>Use our services only for lawful purposes</li>
              <li>Avoid engaging in any malicious or fraudulent activities</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">3. Service Availability</h2>
            <p>
              We strive to maintain uninterrupted services but do not guarantee 100% uptime. Scheduled maintenance and unforeseen outages may occur.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
            <p>
              We are not liable for any indirect, incidental, or consequential damages resulting from the use of our services. Our liability is limited to the maximum extent permitted by law.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">5. Payment & Billing</h2>
            <p>
              If you subscribe to our paid services, you agree to provide accurate billing information. Payments are non-refundable unless explicitly stated otherwise.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p>
              All content, trademarks, and data associated with RDP Datacenter are the intellectual property of the company. Unauthorized use or reproduction is prohibited.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">7. Account Security</h2>
            <p>
              You are responsible for maintaining the security of your account credentials. We are not liable for unauthorized access due to negligence on your part.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms & Conditions at any time. Changes will be effective upon posting on our website. Continued use of our services implies acceptance of updated terms.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">9. Dispute Resolution</h2>
            <p>
              Any disputes arising under these terms will be first attempted to be resolved through negotiation. If unresolved, disputes will be subject to arbitration as per Indian laws.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">10. Governing Law</h2>
            <p>
              These Terms & Conditions are governed by Indian law. Any legal disputes shall be resolved in Indian courts.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p>
              For inquiries about these terms, email us at <a href="mailto:legal@rdpdatacenter.in" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">legal@rdpdatacenter.in
              </a>.
            </p>
          </section>
        </div>
      </div>
    );
  }
