import CancellationPolicy from './CancellationPolicy';
import { Metadata } from 'next';
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Cancellation & Refund Policy | ${siteConfig.name}`,
  description: "Learn about our cancellation and refund policies for RDP Datacenter cloud services.",
};

export default function Page() {
  return <CancellationPolicy />;
}