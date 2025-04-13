import { GradientBackground } from "@/components/ui/GradientBackground";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Cancellation & Refund Policy | ${siteConfig.name}`,
};

export default function CancellationPolicy() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <GradientBackground />
      <div className="relative w-full max-w-4xl rounded-2xl border border-border p-8 shadow-lg bg-transparent backdrop-blur">
        <h1 className="text-4xl font-bold mb-6 text-center">Cancellation & Refund Policy</h1>
        <p className="mb-6">Effective Date: 20th February 2025</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Service Cancellation</h2>
          <p>
            At <span className="font-semibold">RDP Datacenter</span>, we understand that your needs might change. You 
            can cancel your subscription or service at any time through your client dashboard or by contacting our 
            support team at <a href="mailto:billing@rdpdatacenter.in" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">billing@rdpdatacenter.in</a>.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">2. Cancellation Timeline</h2>
          <p>The following timeline applies to service cancellations:</p>
          <ul className="list-disc list-inside">
            <li><strong>Monthly Services:</strong> To avoid being billed for the next month, cancellation must be requested at least 24 hours before the billing cycle ends.</li>
            <li><strong>Annual Services:</strong> For annual subscriptions, cancellation requests should be made at least 7 days before the renewal date.</li>
            <li><strong>One-time Services:</strong> One-time service purchases cannot be cancelled after deployment or provision has begun.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">3. Refund Eligibility</h2>
          <p>Our refund policy is as follows:</p>
          <ul className="list-disc list-inside">
            <li><strong>Within 7 Days:</strong> Full refund for recurring services if cancelled within 7 days of the initial purchase (money-back guarantee).</li>
            <li><strong>Monthly Services:</strong> No prorated refunds for partial months - service will remain active until the end of the current billing period.</li>
            <li><strong>Annual Services:</strong> Prorated refund may be issued for the unused portion, less any applicable discounts received for the annual commitment.</li>
            <li><strong>Setup Fees:</strong> One-time setup fees are non-refundable once the service provisioning has begun.</li>
            <li><strong>Add-ons and Optional Services:</strong> Generally non-refundable once activated or used.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">4. How to Request a Refund</h2>
          <p>To request a refund, please follow these steps:</p>
          <ol className="list-decimal list-inside">
            <li>Log in to your client dashboard at <a href="https://rdpdatacenter.in/dash" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">rdpdatacenter.in/dash</a></li>
            <li>Navigate to the &quot;Billing&quot; section</li>
            <li>Select the service for which you&apos;re requesting a refund</li>
            <li>Click on &quot;Request Refund&quot; and follow the prompts</li>
            <li>Alternatively, email our billing team at <a href="mailto:billing@rdpdatacenter.in" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">billing@rdpdatacenter.in</a> with your account details and refund reason</li>
          </ol>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">5. Refund Processing Time</h2>
          <p>
            Approved refunds will be processed within 7-10 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution:
          </p>
          <ul className="list-disc list-inside">
            <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
            <li><strong>Bank Transfers:</strong> 3-7 business days</li>
            <li><strong>Digital Wallets:</strong> 1-3 business days</li>
            <li><strong>Razorpay/Other Payment Processors:</strong> According to their respective policies</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">6. Non-Refundable Services</h2>
          <p>The following services are generally non-refundable:</p>
          <ul className="list-disc list-inside">
            <li>Domain registration and renewal fees</li>
            <li>SSL certificates once issued</li>
            <li>Services cancelled after the money-back guarantee period</li>
            <li>Services terminated due to violations of our Terms of Service</li>
            <li>Custom development or consulting work</li>
          </ul>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">7. Service Credits</h2>
          <p>
            In some cases, we may offer service credits instead of monetary refunds. These credits can be applied to future purchases or renewals of our services. Service credits do not expire and are non-transferable.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">8. Changes to this Policy</h2>
          <p>
            We reserve the right to modify this policy at any time. Changes will be effective upon posting on our website. Continued use of our services after such changes constitutes your acceptance of the revised policy.
          </p>
        </section>

        <section className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold">9. Contact Us</h2>
          <p>
            If you have any questions regarding this Cancellation & Refund Policy, please contact us at <a href="mailto:billing@rdpdatacenter.in" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">billing@rdpdatacenter.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}