"use client"
import Link from "next/link";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { CommandMenu } from "@/components/command-menu";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { ExternalLink } from "lucide-react";

export function SiteHeader() {
  const { data: session } = useSession();
  return (
    <header
      className={cn(
        "supports-backdrop-blur:bg-background/90 sticky top-0 z-40 w-full border-border bg-background/10 backdrop-blur",
      )}
    >
      <div className="container mx-auto flex h-12 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center gap-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0",
                )}
              >
                <Icons.gitHub className="size-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0",
                )}
              >
                <Icons.twitter className="size-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
            {/* User Avatar Dropdown */}
            <Dropdown placement="bottom-end" shouldBlockScroll={false} className="bg-background/60 backdrop-blur">
              <DropdownTrigger>
                <Avatar
                  isBordered={false}
                  as="button"
                  className="transition-transform w-7 h-7 text-xs"
                  color="secondary"
                  name={typeof session?.user?.name === 'string' ? session.user.name : "User"}
                  size="sm"
                  src={typeof session?.user?.image === 'string' ? session.user.image : "/images/avatar.png"}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  {session ? (
                    <>
                      <p className="font-semibold">
                        Signed in as {typeof session?.user?.name === "string" ? session.user.name : "User"}
                      </p>
                      <p className="text-sm text-default-500">
                        {typeof session?.user?.email === "string" ? session.user.email : ""}
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold">Not Signed in</p>
                  )}
                </DropdownItem>

                {/* Home */}
                <DropdownItem key="home" href="/">Home</DropdownItem>

                {/* Show these only when user is logged in */}
                {session && (
                  <>
                    <DropdownItem key="profile" href="/dash">My Profile</DropdownItem>
                    <DropdownItem key="update" href="/update-profile">Update Profile</DropdownItem>
                  </>
                )}

                {/* Privacy & Other Links */}
                <DropdownItem key="privacy" href="/Privacy">Privacy Policy</DropdownItem>
                <DropdownItem key="t&cs" href="/T&Cs">Terms & Conditions</DropdownItem>
                <DropdownItem key="status" href="https://status.rdpdatacenter.cloud" target="_blank">
                  <div className="flex items-center gap-2">
                    <span>Status Page</span>
                    <ExternalLink className="size-4" />
                  </div>
                </DropdownItem>

                {/* Authentication Links */}
                {session ? (
                  <DropdownItem key="signout" color="danger" onPress={() => signOut()}>
                    Sign Out
                  </DropdownItem>
                ) : (
                  <DropdownItem key="signin" color="primary" href="/auth">
                    Sign In
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </nav>
        </div>
      </div>
      {/* <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0" /> */}
    </header>
  );
}
