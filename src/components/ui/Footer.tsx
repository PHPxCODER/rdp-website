import { RiArrowRightUpLine } from "@remixicon/react"
import Link from "next/link"
import { DatabaseLogo } from "../../../public/DatabaseLogo"
import ThemeSwitch from "@/components/ThemeSwitch"
import { headers } from "next/headers"

const navigation = {
  product: [
    { name: "Enterprise", href: "#", external: false },
    { name: "Pricing", href: "/pricing", external: false },
    { name: "Docs", href: "/docs", external: false },
    { name: "Changelog", href: "#", external: false },
  ],
  social: [
    { name: "X", href: "https://x.com/rdpdatacenter", external: true },
    { name: "GitHub", href: "https://github.com/rdp-datacenter", external: true },
    { name: "Discord", href: "https://discord.gg/FS9CMpDB95", external: true },
    { name: "YouTube", href: "#", external: false },
  ],
  company: [
    { name: "About", href: "/about", external: false },
    { name: "Careers", href: "#", external: true },
    { name: "Contact", href: "#", external: false },
    { name: "Status", href: "https://status.rdpdatacenter.cloud", external: true },
  ],
  legal: [
    { name: "Privacy", href: "/Privacy", external: false },
    { name: "Terms", href: "/T&Cs", external: false },
    { name: "Sitemap", href: "/sitemap.xml", external: false },
    { name: "Imprint", href: "#", external: false },
  ],
}

async function getStatus(): Promise<"operational" | "downtime" | "degraded" | "maintenance" | "loading"> {
  try {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const response = await fetch(`${protocol}://${host}/api/status`, {
      cache: "no-store",
    });
    const data = await response.json();

    return data.status || "loading";
  } catch {
    return "downtime";
  }
}

async function StatusIndicator() {
  const status = await getStatus();

  const borderColor = {
    operational: "border-green-500",
    downtime: "border-red-500",
    degraded: "border-yellow-500",
    maintenance: "border-purple-500",
    loading: "border-gray-500",
  }[status];

  const bgColor = {
    operational: "bg-green-500",
    downtime: "bg-red-500",
    degraded: "bg-yellow-500",
    maintenance: "bg-purple-500",
    loading: "bg-gray-500",
  }[status];

  const statusText = {
    operational: "All Systems Operational",
    downtime: "Service Outage",
    degraded: "Partial Service Disruption",
    maintenance: "Ongoing Maintenance",
    loading: "Checking status...",
  }[status];

  return (
    <Link
      href="https://status.rdpdatacenter.cloud"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 rounded-full border border-gray-200 py-1 pl-1 pr-2 transition hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Expanding pulse ring */}
        <div
          className={`absolute w-4 h-4 border-1.5 rounded-full animate-[pulse_2s_ease-out_infinite] opacity-60 ${borderColor}`}
        />
        {/* Core dot */}
        <div className={`relative h-2 w-2 rounded-full ${bgColor}`} />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-50">{statusText}</span>
      <RiArrowRightUpLine className="size-4 text-gray-500 dark:text-gray-400" />
    </Link>
  );
}

export default function Footer() {
  return (
    <footer id="footer">
      <div className="mx-auto max-w-6xl px-3 pb-8 pt-16 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-20">
          <div className="space-y-8">
            <DatabaseLogo className="w-32 sm:w-40" />
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              Redefining the way databases are built and managed. Built in
              Switzerland, made for the world.
            </p>
            <div className="flex space-x-6">
              <ThemeSwitch />
            </div>
            <div></div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  Product
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Quick links Product"
                >
                  {navigation.product.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  Social
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Quick links Resources"
                >
                  {navigation.social.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-0.5 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  Company
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Quick links Company"
                >
                  {navigation.company.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                  Legal
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Quick links Legal"
                >
                  {navigation.legal.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:mt-20 sm:flex-row lg:mt-24 dark:border-gray-800">
          <p className="text-sm leading-5 text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} RDP Datacenter, Inc. All rights
            reserved.
          </p>
          <StatusIndicator />
        </div>
      </div>
    </footer>
  )
}
