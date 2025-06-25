"use client";

import { Pricing } from "@/components/prismui/pricing";

const rdpPlans = [
  {
    name: "STARTER",
    price: "2999",
    yearlyPrice: "2399", // 20% discount
    period: "per month",
    features: [
      "1 vCPU, 2GB RAM",
      "20GB NVMe SSD Storage",
      "1TB Monthly Transfer",
      "Shared IP Address",
      "Basic DDoS Protection",
      "Email Support (48hrs)",
      "99.5% Uptime SLA",
      "Access to Control Panel",
      "Auto Backups (Weekly)",
    ],
    description: "Perfect for personal projects and small websites",
    buttonText: "Start Free Trial",
    href: "/auth",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "5999",
    yearlyPrice: "4799", // 20% discount
    period: "per month",
    features: [
      "2 vCPU, 4GB RAM",
      "50GB NVMe SSD Storage",
      "3TB Monthly Transfer",
      "Dedicated IP Address",
      "Advanced DDoS Protection",
      "Priority Support (24hrs)",
      "99.9% Uptime SLA",
      "Full Root Access",
      "Auto Backups (Daily)",
      "Load Balancer Support",
      "Team Collaboration (5 users)",
      "SSL Certificates Included",
    ],
    description: "Ideal for growing businesses and web applications",
    buttonText: "Get Started",
    href: "/auth",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "12999",
    yearlyPrice: "10399", // 20% discount
    period: "per month",
    features: [
      "4 vCPU, 8GB RAM",
      "100GB NVMe SSD Storage",
      "Unlimited Monthly Transfer",
      "Multiple Dedicated IPs",
      "Enterprise DDoS Protection",
      "24/7 Dedicated Support",
      "99.99% Uptime SLA",
      "Complete Infrastructure Control",
      "Real-time Backups",
      "Advanced Load Balancing",
      "Unlimited Team Members",
      "Custom SSL Certificates",
      "Priority Resource Allocation",
      "Compliance Certifications",
      "White-label Solutions",
    ],
    description: "For large organizations with mission-critical workloads",
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false,
  },
];

function RDPDatacenterPricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Pricing Cards */}
      <Pricing 
        plans={rdpPlans}
        title="Choose Your Perfect Hosting Plan"
        description="All plans include our core features with no hidden fees. Scale up or down anytime with just a few clicks."
      />

      {/* Hero Section with Key Guarantees - Moved Below Pricing */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Transparent Cloud Hosting Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our high-performance cloud hosting plans designed for Indian businesses. 
            All plans include enterprise-grade security, 24/7 monitoring, and our commitment to reliability.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4 flex items-center justify-center">
                {/* Expanding pulse ring */}
                <div className="absolute w-4 h-4 border-1.5 rounded-full animate-[pulse_2s_ease-out_infinite] opacity-60 border-green-500" />
                {/* Core dot */}
                <div className="relative h-2 w-2 rounded-full bg-green-500" />
              </div>
              <span className="text-foreground font-medium">99.9%+ Uptime Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4 flex items-center justify-center">
                {/* Expanding pulse ring */}
                <div className="absolute w-4 h-4 border-1.5 rounded-full animate-[pulse_2s_ease-out_infinite] opacity-60 border-blue-500" />
                {/* Core dot */}
                <div className="relative h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <span className="text-foreground font-medium">Indian Data Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4 flex items-center justify-center">
                {/* Expanding pulse ring */}
                <div className="absolute w-4 h-4 border-1.5 rounded-full animate-[pulse_2s_ease-out_infinite] opacity-60 border-purple-500" />
                {/* Core dot */}
                <div className="relative h-2 w-2 rounded-full bg-purple-500" />
              </div>
              <span className="text-foreground font-medium">24/7 Expert Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RDP Datacenter?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast Performance</h3>
              <p className="text-muted-foreground">NVMe SSD storage and optimized infrastructure for maximum speed</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">Advanced DDoS protection and security monitoring included</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944l.2 6.05L12 15 11.8 8.994" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Scalable Infrastructure</h3>
              <p className="text-muted-foreground">Easily upgrade your resources as your business grows</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-lg font-semibold mb-2">Do you offer a free trial?</h3>
              <p className="text-muted-foreground">Yes! We offer a 7-day free trial for all new customers. No credit card required to get started.</p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards, debit cards, UPI, net banking, and digital wallets popular in India.</p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">Absolutely! You can change your plan anytime from your control panel. Upgrades are instant, and downgrades take effect at your next billing cycle.</p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-lg font-semibold mb-2">Where are your data centers located?</h3>
              <p className="text-muted-foreground">Our primary data centers are located in Mumbai, Delhi, and Bangalore to ensure low latency for Indian customers.</p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-lg font-semibold mb-2">What kind of support do you provide?</h3>
              <p className="text-muted-foreground">We offer 24/7 technical support via email, chat, and phone. Our expert team has an average response time of under 30 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied customers who trust RDP Datacenter for their hosting needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth" 
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Your Free Trial
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RDPDatacenterPricing;