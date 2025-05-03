import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Dashboard | ${siteConfig.name}`,
};

const DashPage = async () => {
  redirect("/profile");
};

export default DashPage;
