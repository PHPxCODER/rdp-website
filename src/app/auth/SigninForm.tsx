"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function SigninForm() {
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0) // State to track OTP attempts
  const { toast } = useToast() // ShadCN UI toast hook
  const router = useRouter()

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  })

  // Check for OAuth errors in URL query params
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error")
    if (error) {
      toast({
        title: "Google OAuth Error",
        description:
          error === "OAuthCallbackError"
            ? "There was an error with the Google sign-in. Please try again."
            : `An error occurred: ${error}`,
        variant: "destructive",
      })
    }
  }, [toast])

  // Function to handle email submission for OTP login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if email is provided
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email before proceeding.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
  
    try {
      // Check if the user exists in the database
      const checkUserResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
  
      const { exists } = await checkUserResponse.json()
  
      if (!exists) {
        toast({
          title: "User Not Registered",
          description: "The email you entered is not registered. Please sign up first.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
  
      // If the user exists, send the OTP via NextAuth sign-in
      const response = await signIn("email", { email, redirect: false })
  
      if (response?.error) {
        toast({
          title: "Error",
          description: `Failed to send OTP: ${response.error}`,
          variant: "destructive",
        })
      } else {
        setEmailSubmitted(true)
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your email. Please check your inbox.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error during email submission:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle OTP submission with attempt limit
  const handleOtpSubmit = async (data: z.infer<typeof OTPFormSchema>) => {
    if (attemptCount >= 3) {
      toast({
        title: "Maximum Attempts Reached",
        description: "You have exceeded the maximum number of OTP attempts.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const formattedEmail = encodeURIComponent(email.toLowerCase().trim())
    const formattedCode = encodeURIComponent(data.pin)
    const formattedCallback = encodeURIComponent('/dash')
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`
    
    const response = await fetch(otpRequestURL)

    if (response.ok) {
      router.push('/dash')
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "default",
      })
    } else {
      setAttemptCount((prev) => prev + 1) // Increment attempt count on failure
      toast({
        title: "Error",
        description: `Invalid OTP. Attempts left: ${3 - attemptCount - 1}`,
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/dash", redirect: false })
    if (result?.error) {
      toast({
        title: "Google OAuth Error",
        description: "There was an issue signing in with Google. Please try again.",
        variant: "destructive",
      })
    } else if (result?.url) {
      router.push(result.url)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          {emailSubmitted
            ? `Enter the OTP sent to ${email}`
            : "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!emailSubmitted ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="meow@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending email..." : "Signin Using OTP Code"}
              </Button>

              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" type="button">
                Login with Google
              </Button>
            </div>
          </form>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOtpSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || attemptCount >= 3} // Disable if maximum attempts reached
              >
                {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
              </Button>

              {attemptCount >= 3 && (
                <div className="text-red-500 text-center">
                  You have exceeded the maximum number of OTP attempts.
                </div>
              )}
            </form>
          </Form>
        )}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SigninForm
