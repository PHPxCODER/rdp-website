"use client";

import { GradientBackground } from "@/components/ui/GradientBackground";
import { siteConfig } from "@/config/site";
import { seoConfig } from "@/config/seo";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { SearchIcon, HomeIcon, UserIcon, ShieldIcon, BriefcaseIcon, GlobeIcon } from "lucide-react";

interface SitemapSection {
  title: string;
  icon: React.ReactNode;
  pages: {
    title: string;
    url: string;
    description?: string;
  }[];
}

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Group pages by their section based on URL structure
  const sections: SitemapSection[] = [
    {
      title: "Main Pages",
      icon: <HomeIcon className="w-5 h-5" />,
      pages: Object.values(seoConfig.pages)
        .filter(page => 
          page.url === "/" || 
          page.url === "/dash" || 
          page.url === "/auth" || 
          page.url === "/team")
        .map(page => ({
          title: page.title.replace(` | ${siteConfig.name}`, ""),
          url: page.url,
          description: page.description
        }))
    },
    {
      title: "Authentication",
      icon: <UserIcon className="w-5 h-5" />,
      pages: [
        { 
          title: "Sign In", 
          url: "/auth",
          description: "Access your account to manage your cloud services" 
        },
        { 
          title: "Sign Up", 
          url: "/auth/signup",
          description: "Create a new account to get started with our services"
        }
      ]
    },
    {
      title: "Team",
      icon: <UserIcon className="w-5 h-5" />,
      pages: Object.values(seoConfig.pages)
        .filter(page => page.url.startsWith("/team/"))
        .map(page => ({
          title: page.title.replace(` | ${siteConfig.name}`, ""),
          url: page.url,
          description: page.description
        }))
    },
    {
      title: "Legal",
      icon: <ShieldIcon className="w-5 h-5" />,
      pages: [
        { 
          title: "Terms & Conditions", 
          url: "/T&Cs",
          description: "Our terms of service and usage policies"
        },
        { 
          title: "Privacy Policy", 
          url: "/Privacy",
          description: "How we handle and protect your data"
        },
        { 
          title: "Cancellation & Refund Policy", 
          url: "/Cancellation",
          description: "Our policies for cancellations and refunds"
        },
        { 
          title: "Service Delivery Policy", 
          url: "/Shipping",
          description: "How we deliver our cloud services"
        },
        { 
          title: "Contact Us", 
          url: "/Contact",
          description: "Get in touch with our team"
        }
      ]
    },
    {
      title: "Others",
      icon: <BriefcaseIcon className="w-5 h-5" />,
      pages: [
        { 
          title: "Careers", 
          url: "/careers",
          description: "Join our team and grow your career with us" 
        },
        { 
          title: "Sitemap", 
          url: "/sitemap",
          description: "Overview of all pages on our website" 
        }
      ]
    }
  ];

  // Filter sections based on search query and active filter
  const filteredSections = sections
    .filter(section => activeFilter === "all" || section.title.toLowerCase() === activeFilter.toLowerCase())
    .map(section => ({
      ...section,
      pages: section.pages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(section => section.pages.length > 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen py-12 px-6">
      <GradientBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Sitemap
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Find your way around the {siteConfig.name} website with our comprehensive sitemap.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="backdrop-blur-md bg-white/70 dark:bg-black/10 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-black/20 focus:ring-amber-500 focus:border-amber-500 text-gray-900 dark:text-white"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
                              <div className="flex gap-2 flex-wrap justify-center">
                <FilterButton 
                  active={activeFilter === "all"} 
                  onClick={() => setActiveFilter("all")}
                  icon={<GlobeIcon className="w-4 h-4" />}
                >
                  All
                </FilterButton>
                {sections.map(section => (
                  <FilterButton 
                    key={section.title}
                    active={activeFilter === section.title.toLowerCase()} 
                    onClick={() => setActiveFilter(section.title.toLowerCase())}
                    icon={section.icon}
                  >
                    {section.title}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        {filteredSections.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {filteredSections.map((section) => (
              <motion.div 
                key={section.title}
                variants={item}
                className="backdrop-blur-md bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-amber-900/20 transition-shadow duration-300"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-full bg-amber-500/20 text-amber-500">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{section.title}</h2>
                </div>
                <ul className="space-y-4">
                  {section.pages.map((page) => (
                    <li key={page.url} className="group">
                      <Link href={page.url} className="block">
                        <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {page.title}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
                              ↗
                            </span>
                          </div>
                          {page.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{page.description}</p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-xl text-gray-600 dark:text-gray-400">No pages match your search criteria.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveFilter('all');}}
              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm"
        >
          <p>
            Can&apos;t find what you&apos;re looking for? <Link href="/Contact" className="text-amber-500 hover:underline">Contact our team</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

function FilterButton({ children, active, onClick, icon }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
        active 
          ? 'bg-amber-600 text-white' 
          : 'bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/70'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}