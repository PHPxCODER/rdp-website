"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { useLanyard } from "react-use-phplanyard";
import { EarthIcon } from "@/components/ui/earth";
import { GithubIcon } from "@/components/ui/github";
import { AudioLinesIcon } from "@/components/ui/audio-lines";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { TeamMember, teamMemberDetails } from "@/config/team";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TeamMemberDetailProps {
  member: TeamMember;
}



const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
  offline: "bg-gray-400",
};

const statusMapping: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "DND",
};

export default function TeamMemberDetail({ member }: TeamMemberDetailProps) {
  const [loading, setLoading] = useState(true);
  const { data } = useLanyard({ userId: member.discordid || "" });
  const status = data?.data?.discord_status || "offline";
  const city = data?.data?.kv?.city || null;


  const isMobile = data?.data?.active_on_discord_mobile;
  const isDesktop = data?.data?.active_on_discord_desktop || data?.data?.active_on_discord_web;

  const validStatus = statusMapping[status] || "Offline";

  const statusText = isMobile
    ? `${validStatus} on Phone`
    : isDesktop
      ? `${validStatus} on Desktop`
      : "Zzz...";

  const memberInfo = teamMemberDetails[member.name] || {
    description: "Team member at RDP Datacenter working on our cloud infrastructure and services.",
    achievements: ["Contributing to our cloud platform development"],
    skills: ["Cloud Infrastructure", "Team Collaboration"]
  };
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto relative z-10">
      <Link href="/team">
        <Button 
          variant="light" 
          className="mb-6 flex items-center gap-2"
          startContent={<ArrowLeftIcon size={16} />}
        >
          Back to Team
        </Button>
      </Link>

      <Card className={cn(
        "p-8 rounded-lg backdrop-blur-md border mb-8",
        "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
      )}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative">
            {loading ? (
              <Skeleton className="w-32 h-32 rounded-full" />
            ) : (
              <>
                <Avatar src={member.image} size="lg" className="w-32 h-32" />
                
                {member.discordid && (
                  <div className="absolute bottom-3 right-2 w-4 h-4 rounded-full ring-[3px] ring-white dark:ring-black group flex justify-center">
                    <span className={cn("w-full h-full rounded-full", statusColors[status])}></span>
                    
                    <div className="absolute z-10 mb-1 px-2 py-1 bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none bottom-full rounded-lg w-max">
                      {statusText}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="text-center md:text-left">
            {loading ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-32 mb-2 rounded-sm" />
                <Skeleton className="h-4 w-24 mb-4 rounded-sm" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{member.name}</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-1">{member.role}</p>
                
                {city && (
                  <div className="flex items-center justify-center md:justify-start gap-1 text-gray-400 dark:text-gray-500 mb-4">
                    <MapPinIcon size={14} />
                    <span className="text-sm">{city}</span>
                  </div>
                )}
                {!city && <div className="mb-4"></div>}
              </>
            )}
            
            <div className="flex gap-3 justify-center md:justify-start mb-4">
              {loading ? (
                <>
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="w-9 h-9 rounded-full" />
                </>
              ) : (
                <>
                  {member.linkedin && (
                    <Button isIconOnly variant="light" href={member.linkedin} target="_blank" as="a">
                      <LinkedinIcon size={18} />
                    </Button>
                  )}
                  {member.github && (
                    <Button isIconOnly variant="light" href={member.github} target="_blank" as="a">
                      <GithubIcon size={18} />
                    </Button>
                  )}
                  {member.soundcloud && (
                    <Button isIconOnly variant="light" href={member.soundcloud} target="_blank" as="a">
                      <AudioLinesIcon size={18} />
                    </Button>
                  )}
                  {member.website && (
                    <Button isIconOnly variant="light" href={member.website} target="_blank" as="a">
                      <EarthIcon size={18} />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn(
          "p-6 rounded-lg backdrop-blur-md border col-span-1 md:col-span-3",
          "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
        )}>
          {loading ? (
            <>
              <Skeleton className="h-7 w-32 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-4/5" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {memberInfo.description}
              </p>
            </>
          )}
        </Card>

        <Card className={cn(
          "p-6 rounded-lg backdrop-blur-md border",
          "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
        )}>
          {loading ? (
            <>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Key Achievements</h2>
              <ul className="space-y-2">
                {memberInfo.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card className={cn(
          "p-6 rounded-lg backdrop-blur-md border",
          "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
        )}>
          {loading ? (
            <>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {memberInfo.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-200/50 dark:bg-gray-800/50 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className={cn(
          "p-6 rounded-lg backdrop-blur-md border",
          "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
        )}>
          {loading ? (
            <>
              <Skeleton className="h-7 w-28 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Connect</h2>
              <div className="space-y-3">
                {member.linkedin && (
                  <Button color="primary" as="a" href={member.linkedin} target="_blank" className="w-full" variant="flat">
                    Connect on LinkedIn
                  </Button>
                )}
                {member.github && (
                  <Button color="default" as="a" href={member.github} target="_blank" className="w-full" variant="flat">
                    Follow on GitHub
                  </Button>
                )}
                {member.website && (
                  <Button color="secondary" as="a" href={member.website} target="_blank" className="w-full" variant="flat">
                    Visit Website
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}