'use client';

import { useEffect, useState } from "react";
import { ArrowLeft, Server, Wifi, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import StatusIndicator from "@/components/StatusIndicator";
import emitter from "@/lib/emitter";

const containerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const serverVariants: Variants = {
  initial: {
    scale: 1
  },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const NotFound = () => {
  const [status, setStatus] = useState<"operational" | "downtime" | "degraded" | "maintenance" | "loading">("loading");
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data.status || "downtime");
      } catch (error) {
        console.error("Error fetching status:", error);
        setStatus("downtime");
      }
    }

    fetchStatus();
  }, []);

  useEffect(() => {
    // Emit event to show ProBanner on 404 page
    emitter.emit("proBannerForceShow");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Server Icon Grid */}
        <motion.div
          className="grid grid-cols-3 gap-4 justify-items-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            variants={serverVariants}
            animate="animate"
            initial="initial"
          >
            <Server className="text-blue-500 w-12 h-12" />
          </motion.div>

          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <AlertCircle className="text-red-500 w-16 h-16" />
          </motion.div>

          <motion.div
            variants={serverVariants}
            animate="animate"
            initial="initial"
          >
            <Server className="text-blue-500 w-12 h-12" />
          </motion.div>
        </motion.div>

        {/* Connection Lines Animation */}
        <motion.div
          className="relative h-2 mx-auto w-3/4 mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            animate={{
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Wifi className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-blue-500 w-8 h-8" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="space-y-4"
          variants={itemVariants}
        >
          <motion.h1 className="text-7xl font-bold text-foreground">
            404
          </motion.h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The requested resource could not be located on our servers.
            Please check the URL or return to the dashboard.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            className="mt-8 bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500/10 group transition-all duration-300"
            onClick={() => window.location.href = '/'}
          >
            <motion.div
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </motion.div>
            Return to Homepage
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <StatusIndicator status={status} />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default NotFound;