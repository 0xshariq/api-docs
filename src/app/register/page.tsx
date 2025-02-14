"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: "", type: "" })
    setIsLoading(true)

    try {
      const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"
      const response = await axios.post(`${BASE_URL}/register`, { name, email, password })

      if (response.data.message) {
        setMessage({ text: "Registration successful! Please login.", type: "success" })

        // Redirect to login page after a brief delay
        setTimeout(() => {
          router.push("/login")
        }, 200)
      }
    } catch (error: any) {
      console.log("Error:", error)
      setMessage({
        text: error.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
        {message.text && (
          <Alert
            className={`mt-4 ${message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

