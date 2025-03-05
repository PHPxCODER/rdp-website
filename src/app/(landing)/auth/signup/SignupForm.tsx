"use client"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@heroui/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GradientBackground } from "@/components/ui/GradientBackground"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export function SignupForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const GoogleIcon = () => <FcGoogle size={24} />;
  const GithubIcon = () => <FaGithub size={24} />;

  const handleCreateAccount = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      toast({
        title: "Invite Only Phase",
        description: "Sign-Ups are currently restricted to invited users.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    const result = await signIn("google", { callbackUrl: "/dash", redirect: false })
    if (result?.error) {
      toast({
        title: "Google OAuth Error",
        description: "There was an issue signing in with Google. Please try again.",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    } else if (result?.url) {
      router.push(result.url)
    }
  }

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true)
    const result = await signIn("github", { callbackUrl: "/dash", redirect: false })
    if (result?.error) {
      toast({
        title: "Github OAuth Error",
        description: "There was an issue signing in with Github. Please try again.",
        variant: "destructive",
      })
      setIsGithubLoading(false)
    } else if (result?.url) {
      router.push(result.url)
    }
  }
  return (
    <div className="relative flex items-center justify-center">
      <GradientBackground />
      <Card className="mx-auto max-w-sm relative z-10 bg-black/10 backdrop-blur border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="meow@rdpdatacenter.cloud"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" color="primary" radius="full" className="w-full" disabled={isSubmitting} isLoading={isSubmitting} onPress={handleCreateAccount}>
              {isSubmitting ? "Processing..." : "Create an account"}
            </Button>
            <Button onPress={handleGoogleSignIn} isLoading={isGoogleLoading} disabled={isGoogleLoading} variant="light" radius="full" className="flex items-center gap-2">
              {!isGoogleLoading && <GoogleIcon />}
              Sign up with Google
            </Button>

            <Button onPress={handleGithubSignIn} isLoading={isGithubLoading} disabled={isGithubLoading} variant="light" radius="full" className="flex items-center gap-2">
              {!isGithubLoading && <GithubIcon />}
              Sign up with Github
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default SignupForm