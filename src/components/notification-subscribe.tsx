"use client"

import type React from "react"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function NotificationSubscribe() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically call an API to handle the subscription
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="w-full py-16 border-t border-primary/10">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
            <Bell className="w-5 h-5 text-primary" />
          </div>

          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Stay updated with our latest releases
          </h2>

          <p className="text-muted-foreground max-w-[600px]">
            Subscribe to our newsletter and be the first to know about new features, updates, and best practices.
          </p>

          {subscribed ? (
            <div className="bg-primary/10 p-4 rounded-lg text-foreground">
              <p>Thanks for subscribing! We&apos;ll keep you updated.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
              />
              <Button
                type="submit"
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "transition-colors duration-200",
                )}
              >
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}

