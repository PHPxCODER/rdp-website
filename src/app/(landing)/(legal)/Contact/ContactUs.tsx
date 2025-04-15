"use client"

import { useState } from "react";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  BuildingOffice2Icon, 
  EnvelopeIcon, 
  PhoneIcon,
  ClockIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

export default function ContactUs() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly!",
        variant: "default",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen py-12 px-6">
      <GradientBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Have questions about our services? Need technical support? We&apos;re here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Card */}
          <div className="col-span-1 space-y-8">
            <div className="backdrop-blur-md bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <EnvelopeIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <a href="mailto:support@rdpdatacenter.in" className="text-amber-500 hover:underline block">support@rdpdatacenter.in</a>
                    <a href="mailto:noc@rdpdatacenter.in" className="text-amber-500 hover:underline block">noc@rdpdatacenter.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PhoneIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href="#" className="text-amber-500 hover:underline">No Phone Support</a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sales and Support</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <BuildingOffice2Icon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Business Address</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Maddilapalem, Vizag<br />
                      Andhra Pradesh 530013<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ClockIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-gray-600 dark:text-gray-300">24/7 Technical Support</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sales: Mon-Fri, 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <GlobeAltIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Service Regions</p>
                    <p className="text-gray-600 dark:text-gray-300">Global services with datacenter locations in:</p>
                    <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside ml-1">
                      <li>Asia Pacific - Mumbai</li>
                      <li>Asia Pacific - Hyderabad</li>
                      <li>Asia Pacific - Visakhapatnam</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-1 lg:col-span-2 backdrop-blur-md bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[150px]"
                />
              </div>

              <Button 
                type="submit" 
                color="primary" 
                size="lg" 
                className="w-full md:w-auto"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-3">Quick Support Options</h3>
              <div className="flex flex-wrap gap-4">
                <Button as="a" href="https://rdpdatacenter.in/dash" target="_blank" color="default" variant="flat">
                  Client Dashboard
                </Button>
                <Button as="a" href="https://status.rdpdatacenter.in" target="_blank" color="default" variant="flat">
                  System Status
                </Button>
                <Button as="a" href="https://docs.rdpdatacenter.in" target="_blank" color="default" variant="flat">
                  Knowledge Base
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 backdrop-blur-md bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-600 dark:text-amber-500">What is your standard response time?</h3>
              <p className="text-gray-600 dark:text-gray-300">For technical support tickets, we aim to respond within 30 minutes. Sales inquiries are typically answered within 2-4 business hours.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-600 dark:text-amber-500">Do you offer emergency support?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, our priority support is available 24/7 for critical infrastructure issues for customers on Business and Enterprise plans.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-600 dark:text-amber-500">How do I upgrade my current plan?</h3>
              <p className="text-gray-600 dark:text-gray-300">You can upgrade your plan directly from your client dashboard or by contacting our sales team at sales@rdpdatacenter.in.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-600 dark:text-amber-500">Do you offer custom solutions?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, we specialize in custom IaaS solutions for enterprises. Contact our sales team to discuss your specific requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}