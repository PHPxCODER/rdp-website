"use client"
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { team } from "@/config/docs";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"

export function Team() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 ">
                {team.map((member, index) => (
                    <Card
                        key={index}
                        className={cn(
                            "shadow-lg p-6 rounded-lg backdrop-blur-md border",
                            "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
                        )}
                    >
                        <CardHeader className="flex flex-col items-center">
                            {loading ? (
                                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                            ) : (
                                <Avatar src={member.image} size="lg" className="w-24 h-24 mb-4" />
                            )}
                            {loading ? (
                                <Skeleton className="w-40 h-7 rounded mb-2" />
                            ) : (
                                <h2 className="text-xl font-semibold">{member.name}</h2>
                            )}
                            {loading ? (
                                <Skeleton className="w-28 h-5 rounded" />
                            ) : (
                                <p className="text-gray-500 text-sm">{member.role}</p>
                            )}
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
                                    <Button isIconOnly variant="light" href={member.linkedin} as="a">
                                        <FaLinkedin size={18} />
                                    </Button>
                                    <Button isIconOnly variant="light" href={member.github} as="a">
                                        <FaGithub size={18} />
                                    </Button>
                                    <Button isIconOnly variant="light" href={member.website} as="a">
                                        <Globe size={18} />
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
