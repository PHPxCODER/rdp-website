"use client";

import RDPLogo from "@/components/RDPLogo";
import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { docsConfig } from "@/config/docs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link href="/" className="relative mr-6 flex items-center space-x-1">
            <RDPLogo className="size-6 mb-1" />
            <span className="hidden font-bold md:inline-block">
              {siteConfig.name}
            </span>
            <Badge variant="secondary">Beta</Badge>
          </Link>
        </ContextMenuTrigger>
      </ContextMenu>
      <nav className="hidden items-center space-x-6 text-sm font-medium xl:flex">
        {docsConfig.mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href!}
            aria-label={item.title}

            target={item.external ? "_blank" : undefined}
            className={cn(
              "flex items-center justify-center transition-colors hover:text-foreground/80",
              pathname === item.href
                ? "text-foreground"
                : pathname.startsWith(item.href!) && item.href !== "/"
                  ? "text-foreground"
                  : "text-foreground/60",
            )}
          >
            <span className="shrink-0">{item.title}</span>
            {item.label && (
              <span className="ml-2 rounded-md bg-[#FFBD7A] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
            {item.external && <ExternalLinkIcon className="ml-2 size-4" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
