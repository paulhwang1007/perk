"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<String | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
  
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
  
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        // Check if email confirmation is required/sent
        setError("Check your email for confirmation link!")
        setLoading(false)
      }
    }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Perk</h1>
          <p className="text-muted-foreground">Master your credit card portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Loading..." : "Sign In"}
            </Button>
            <Button variant="outline" type="button" onClick={handleSignUp} disabled={loading} className="w-full">
                Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
