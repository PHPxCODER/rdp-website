import ServiceDeliveryPolicy from './ShippingPage';
import { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Shipping Policy | ${siteConfig.name}`,
  description: "Information about our service delivery processes, timelines, and what to expect when purchasing RDP Datacenter services.",
};

export default function Page() {
  return <ServiceDeliveryPolicy />;
}