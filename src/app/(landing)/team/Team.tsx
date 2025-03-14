"use client"
import { useLanyard } from "react-use-phplanyard";
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { EarthIcon } from "@/components/ui/earth";
import { GithubIcon } from "@/components/ui/github";
import { AudioLinesIcon } from "@/components/ui/audio-lines";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { team, TeamMember } from "@/config/docs";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
    online: "bg-emerald-500",
    idle: "bg-amber-400",
    dnd: "bg-rose-400",
    offline: "bg-gray-400",
};

export function Team() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                {team.map((member) => (
                    <TeamMemberCard key={member.discordid || member.name} member={member} loading={loading} />
                ))}
            </div>
        </div>
    );
}

interface TeamMemberCardProps {
    member: TeamMember;
    loading: boolean;
}

function TeamMemberCard({ member, loading }: TeamMemberCardProps) {
    const { data } = useLanyard({ userId: member.discordid || "" });
    const status = data?.data?.discord_status || "offline";

    return (
        <Card
            className={cn(
                "shadow-lg p-6 rounded-lg backdrop-blur-md border",
                "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
            )}
        >
            <CardHeader className="flex flex-col items-center relative">
                {loading ? (
                    <Skeleton className="w-24 h-24 rounded-full mb-4" />
                ) : (
                    <div className="relative">
                        <Avatar src={member.image} size="lg" className="w-24 h-24 mb-4" />
                        {member.discordid && (
                            <span
                                className={cn(
                                    "absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white",
                                    statusColors[status]
                                )}
                            />
                        )}
                    </div>
                )}
                {loading ? <Skeleton className="w-40 h-7 rounded mb-2" /> : <h2 className="text-xl font-semibold">{member.name}</h2>}
                {loading ? <Skeleton className="w-28 h-5 rounded" /> : <p className="text-gray-500 text-sm">{member.role}</p>}
            </CardHeader>
            <CardFooter className="flex justify-center gap-3">
                {loading ? (
                    <div className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
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
                            <Button isIconOnly variant="light" href={member.github} target="_blank" as="a">
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
            </CardFooter>
        </Card>
    );
}
