import ContactUs from './ContactUs';
import { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: "Get in touch with the RDP Datacenter team for sales inquiries, technical support, or general questions.",
};

export default function Page() {
  return <ContactUs />;
}