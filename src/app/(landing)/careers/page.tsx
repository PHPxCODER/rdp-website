import { Career } from "./Career";
import { siteConfig } from "@/config/site";

export const metadata = {
    title: `Join Our Team | ${siteConfig.name}`,
  };

export default function Page() {
  return <Career />;
}
