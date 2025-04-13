import { GradientBackground } from "@/components/ui/GradientBackground";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Service Delivery Policy | ${siteConfig.name}`,
};

export default function ServiceDeliveryPolicy() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <GradientBackground />
      <div className="relative w-full max-w-4xl rounded-2xl border border-border p-8 shadow-lg bg-transparent backdrop-blur">
        <h1 className="text-4xl font-bold mb-6 text-center">Service Delivery Policy</h1>
        <p className="mb-6">Effective Date: 20th February 2025</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            As <span className="font-semibold">RDP Datacenter</span> provides Infrastructure as a Service (IaaS), our delivery policy 
            outlines the processes, timelines, and expectations for the provision of our cloud services. 
            All our services are delivered digitally, without physical shipping components.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">2. Service Provisioning Timeline</h2>
          <p>We strive to deliver our services according to the following timelines:</p>
          <ul className="list-disc list-inside">
            <li><strong>Standard Cloud Services:</strong> Typically provisioned within 30 minutes to 2 hours after confirmed payment.</li>
            <li><strong>Custom Configured Solutions:</strong> May require 1-24 hours depending on complexity.</li>
            <li><strong>Enterprise Dedicated Environments:</strong> Provisioning may take 1-3 business days.</li>
            <li><strong>Add-on Services:</strong> Usually activated within 1 hour of purchase.</li>
          </ul>
          <p className="mt-2">
            These timelines represent our best estimates under normal operating conditions. Actual delivery 
            times may vary based on system load, technical requirements, or verification needs.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">3. Service Activation Process</h2>
          <p>Our service activation process includes:</p>
          <ol className="list-decimal list-inside">
            <li>Order placement and payment confirmation</li>
            <li>Automated system validation</li>
            <li>Resource allocation in our datacenter</li>
            <li>Service configuration according to specifications</li>
            <li>Quality checks and validation</li>
            <li>Delivery of access credentials via secured email</li>
            <li>Welcome guide and documentation provision</li>
          </ol>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">4. Delivery Confirmation</h2>
          <p>
            Upon successful provisioning of your service, you will receive:
          </p>
          <ul className="list-disc list-inside">
            <li>A service activation email with essential access information</li>
            <li>SMS notification (if mobile number is provided)</li>
            <li>Dashboard notification within your RDP Datacenter account</li>
            <li>Service details and specifications in your client dashboard</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">5. Global Service Availability</h2>
          <p>
            Our cloud services are available globally with the following considerations:
          </p>
          <ul className="list-disc list-inside">
            <li><strong>Service Regions:</strong> You can select from multiple datacenter locations based on your needs.</li>
            <li><strong>Regional Restrictions:</strong> Some features may be restricted in certain jurisdictions due to local regulations.</li>
            <li><strong>Performance Optimization:</strong> For optimal performance, we recommend selecting the datacenter region closest to your target users.</li>
            <li><strong>Data Sovereignty:</strong> Consider local data protection laws when choosing your service region.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">6. Service Level Agreements (SLAs)</h2>
          <p>
            Our delivery policy is backed by Service Level Agreements that define our commitments to:
          </p>
          <ul className="list-disc list-inside">
            <li>Service availability (uptime guarantees)</li>
            <li>Network performance metrics</li>
            <li>Technical support response times</li>
            <li>Problem resolution timeframes</li>
            <li>Service credit eligibility in case of service disruptions</li>
          </ul>
          <p className="mt-2">
            For detailed SLA information specific to your purchased service, please refer to the Service 
            Level Agreement document in your client dashboard.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">7. Delivery Delays</h2>
          <p>
            While rare, delivery delays may occur due to:
          </p>
          <ul className="list-disc list-inside">
            <li>Technical challenges during automated provisioning</li>
            <li>Verification requirements for security purposes</li>
            <li>System maintenance or updates</li>
            <li>Unforeseen technical difficulties</li>
          </ul>
          <p className="mt-2">
            In case of delays exceeding our standard provisioning times, we will notify you promptly 
            via email with an estimated delivery timeline and explanation.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">8. Post-Delivery Support</h2>
          <p>
            After service delivery, we provide:
          </p>
          <ul className="list-disc list-inside">
            <li>24/7 technical support via ticket system</li>
            <li>Comprehensive documentation and knowledge base access</li>
            <li>Onboarding assistance for first-time users</li>
            <li>Service optimization recommendations</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">9. Contact Us</h2>
          <p>
            For any questions regarding our service delivery policy or to check on the status of a pending service, 
            please contact us at <a href="mailto:support@rdpdatacenter.in" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">support@rdpdatacenter.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}