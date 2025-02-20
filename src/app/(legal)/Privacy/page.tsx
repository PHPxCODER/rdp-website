export default function PrivacyPolicy() {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl rounded-2xl border border-border p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
          <p className="mb-6">Effective Date: 20th February 2025</p>
  
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to <span className="font-semibold">RDP Datacenter</span>. We are committed to protecting your privacy and ensuring 
              that your personal data is handled securely and responsibly. This Privacy Policy outlines our data collection, 
              usage, and protection practices.
            </p>
            <p>
              By using our services, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our services.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            <p>We collect various types of information, including but not limited to:</p>
            <ul className="list-disc list-inside">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and payment details.</li>
              <li><strong>Technical Data:</strong> IP address, device information, operating system, and browser type.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on our platform, and interaction with features.</li>
              <li><strong>Cookies & Tracking:</strong> We use cookies and other tracking technologies to enhance user experience.</li>
            </ul>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc list-inside">
              <li>Provide, maintain, and improve our services.</li>
              <li>Communicate with you regarding updates, promotions, and support.</li>
              <li>Analyze usage trends to enhance user experience.</li>
              <li>Prevent fraudulent activities and ensure platform security.</li>
              <li>Comply with legal and regulatory requirements.</li>
            </ul>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">4. Data Sharing & Third Parties</h2>
            <p>We do not sell or rent your personal data. However, we may share information with:</p>
            <ul className="list-disc list-inside">
              <li><strong>Service Providers:</strong> Third-party vendors who assist in service delivery, payment processing, and analytics.</li>
              <li><strong>Legal Authorities:</strong> When required by law or in response to legal processes.</li>
              <li><strong>Business Transfers:</strong> If our business is acquired or merged, user data may be transferred as part of the transaction.</li>
            </ul>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p>
              We take reasonable precautions to protect your personal data from unauthorized access, loss, or misuse. 
              However, no system is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">6. Your Rights & Choices</h2>
            <p>You have the following rights regarding your data:</p>
            <ul className="list-disc list-inside">
              <li><strong>Access & Correction:</strong> Request access to or correction of your personal data.</li>
              <li><strong>Data Deletion:</strong> Request the deletion of your personal information, subject to legal obligations.</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails and restrict cookie tracking.</li>
            </ul>
            <p>To exercise your rights, contact us at <a href="mailto:legal@rdpdatacenter.cloud" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">legal@rdpdatacenter.cloud</a>.</p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">7. Cookies & Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance user experience, analyze trends, and track website interactions. 
              You can manage cookie preferences through your browser settings.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">8. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Any significant changes will be communicated through our website 
              or via email. Continued use of our services after changes implies acceptance of the revised policy.
            </p>
          </section>
  
          <section className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at <a href="mailto:legal@rdpdatacenter.cloud" className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full">legal@rdpdatacenter.cloud</a>.
            </p>
          </section>
        </div>
      </div>
    );
  }
  