"use client";

import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { useState, useEffect } from "react";
import { Linkedin, Github, Globe } from "lucide-react";

const team = [
  {
    name: "Subhadeep Pramanik",
    role: "Founder",
    image: "/team/phpxcoder.jpg",
    linkedin: "https://linkedin.com/in/phpxcoder",
    github: "https://github.com/phpxcoder",
    website: "https://phpxcoder.in",
  },
  {
    name: "Dinesh Yerra",
    role: "Co-Founder & CTO",
    image: "/team/dinokage.jpg",
    linkedin: "https://linkedin.com/in/dinesh-yerra-24031a206/",
    github: "https://github.com/dinokage",
    website: "https://dinokage.in",
  },
  {
    name: "Rahul Kose",
    role: "Co-Founder",
    image: "/team/rgxjapan.jpg",
    linkedin: "#",
    github: "#",
    website: "https://kandabhaja.nl",
  },
];

export default function TeamPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulating API delay
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Meet Our Team</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {team.map((member, index) => (
          <Card key={index} className="shadow-lg p-4">
            <CardHeader className="flex flex-col items-center">
              {loading ? (
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
              ) : (
                <Avatar src={member.image} size="lg" className="mb-4" />
              )}
              {loading ? (
                <Skeleton className="w-32 h-6 rounded" />
              ) : (
                <h2 className="text-xl font-semibold">{member.name}</h2>
              )}
              <p className="text-gray-500">{member.role}</p>
            </CardHeader>
            <CardFooter className="flex justify-center gap-3">
              <Button isIconOnly variant="light" href={member.linkedin} as="a">
                <Linkedin size={18} />
              </Button>
              <Button isIconOnly variant="light" href={member.github} as="a">
                <Github size={18} />
              </Button>
              <Button isIconOnly variant="light" href={member.website} as="a">
                <Globe size={18} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
