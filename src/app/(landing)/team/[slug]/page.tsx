import { team } from "@/config/team";
import { notFound } from "next/navigation";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { siteConfig } from "@/config/site";
import TeamMemberDetail from "../TeamMemberDetail";

export async function generateStaticParams() {
  return team.map((member) => ({
    slug: member.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const teamMember = team.find(
    (member) => member.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!teamMember) {
    return {
      title: "Member Not Found | " + siteConfig.name,
    };
  }

  return {
    title: `${teamMember.name} - ${teamMember.role} | ${siteConfig.name}`,
    description: `Learn more about ${teamMember.name}, ${teamMember.role} at ${siteConfig.name}`,
  };
}

export default function TeamMemberPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const teamMember = team.find(
    (member) => member.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!teamMember) {
    notFound();
  }

  return (
    <div className="relative min-h-screen py-12 px-6">
      <GradientBackground />
      <TeamMemberDetail member={teamMember} />
    </div>
  );
}