"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button, Input } from "@heroui/react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationSubscribe() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "🎉 Subscription Successful!",
          description: "Check your email for confirmation.",
          variant: "default",
        })
        setEmail("")
      } else if (response.status === 409) {
        toast({
          title: "⚠ Already Subscribed",
          description: "You're already subscribed to the newsletter.",
          variant: "default",
        })
      } else {
        toast({
          title: "Subscription Failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full pt-16">
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

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              size="sm"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
            <Button type="submit" size="sm" variant="ghost" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
