import Link from "next/link";
import { headers } from "next/headers"
import { RiArrowRightUpLine } from "@remixicon/react"

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
  
  export async function StatusIndicator() {
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
        href="https://status.rdpdatacenter.in"
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