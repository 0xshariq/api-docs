"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"

export default function Logout() {
  const router = useRouter()
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem("auth-token")

        if (token) {
          const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"
          await axios.post(
            `${BASE_URL}/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          // Clear local storage
          localStorage.removeItem("auth-token")
          setMessage({ text: "Logged out successfully!", type: "success" })

          // Redirect after a brief delay
          setTimeout(() => {
            router.push("/login")
            router.refresh() // Refresh to update auth state
          }, 1000)
        } else {
          // If no token found, redirect immediately
          router.push("/login")
        }
      } catch (error: any) {
        console.error("Logout Error:", error)
        setMessage({
          text: error.response?.data?.message || "An error occurred during logout.",
          type: "error",
        })

        // Even if the API call fails, clear local storage and redirect
        localStorage.removeItem("auth-token")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Logging Out</h2>
        {message.text && (
          <Alert
            className={`mt-4 ${message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

