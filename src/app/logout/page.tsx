"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

export default function Logout() {
  const router = useRouter()
  const [message, setMessage] = useState({ text: "Logging you out...", type: "info" })

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        if (token) {
          await axios.post(
            `${BASE_URL}/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
        }
        localStorage.removeItem("auth-token")
        setMessage({ text: "Logged out successfully!", type: "success" })
      } catch (error) {
        console.error("Logout Error:", error)
        setMessage({ text: "An error occurred during logout.", type: "error" })
      } finally {
        setTimeout(() => {
          router.push("/login")
          router.refresh()
        }, 1000)
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Logging Out</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert
            className={message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

