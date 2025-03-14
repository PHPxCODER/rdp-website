"use client";

import {Button, Link} from "@heroui/react";
import {ArrowRightIcon} from "@heroui/shared-icons";
import {clsx} from "@heroui/shared-utils";
import NextLink from "next/link";
import Newsletter from "@/components/Newsletter";
import {FeaturesGrid} from "./features-grid";
import {sectionWrapper, subtitle, title} from "@/components/primitives";
import {GithubIcon, NextJsIcon} from "@/components/ui/heroui-icon";
import {useIsMounted} from "@/hooks/use-is-mounted";
import {siteConfig} from "@/config/site";

const bannerSuggestions = [
  {
    title: "Instant Deployments",
    description:
      "Push your code, and we handle the rest. Deploy seamlessly with RDP Datacenter.",
    icon: <GithubIcon className="text-pink-500" />,
    href: "/dash",
  },
  {
    title: "Global Edge Network",
    description: (
      <>
        Serve your users at lightning speed with our worldwide infrastructure using Edge Network.
      </>
    ),
    icon: <NextJsIcon className="text-pink-500" />,
    href: "/dash",
  },
];

export const PrettyBanner = () => {
  const isMounted = useIsMounted();

  return (
    <>
    <section className={sectionWrapper({
        isBlurred: true,
        class: "mt-16 lg:mt-44 ",
      })}
    >
    <div className=" border-t border-b px-8 w-screen flex justify-center items-center relative">
      <div className=" w-full max-w-7xl py-10 grid grid-cols-12 gap-6 md:gap-0 z-20">
        <div className="flex flex-col gap-2 col-span-12 md:col-span-6">
          <div className="flex flex-col">
            <h1 className={title({size: "md", class: "inline"})}>Deploy. Scale. Succeed.</h1>
            <div>
              <h1 className={title({size: "md"})}>with&nbsp;</h1>
              <h1 className={title({size: "md", color: "violet", class: "inline"})}>RDP Datacenter</h1>
            </div>
          </div>
          <p className={subtitle({class: "md:w-full text-base lg:text-lg"})}>
          Experience seamless cloud deployment and scalability like never before.
          </p>
          <div className="flex flex-row gap-3 justify-start">
            <Button
              as={NextLink}
              className="text-sm"
              color="secondary"
              endContent={
                <ArrowRightIcon
                  className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
                  strokeWidth={2}
                />
              }
              href="/dash"
              radius="full"
              size="md"
            >
              Get Started
            </Button>
            <Button
              isExternal
              as={Link}
              className="text-sm"
              href={siteConfig.links.github}
              radius="full"
              size="md"
              startContent={<GithubIcon />}
              variant="bordered"
            >
              Github
            </Button>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <FeaturesGrid
            classNames={{
              base: "lg:grid-cols-2",
            }}
            features={bannerSuggestions}
          />
        </div>
      </div>
      </div>
      <div
        className={clsx(
          "absolute -top-20 lg:top-10 -translate-y-1/2 w-screen h-screen -z-50 opacity-0",
          "data-[mounted=true]:opacity-100 transition-opacity",
          "bg-left bg-no-repeat bg-[url('/gradients/looper-pattern.svg')]",
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1]",
          "after:bg-gradient-to-b after:from-transparent after:to-white/80 dark:after:to-black/20 after:z-[-1]",
        )}
        style={{ transform: "translateY(-50%)" }} 
        data-mounted={isMounted}
      />
      <Newsletter />
    </section>
    
    </>
  );
};
