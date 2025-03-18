"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import axios from "axios"

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

export default function Logout() {
  const router = useRouter()
  const [message, setMessage] = useState({ text: "Logging you out...", type: "info" })
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem("auth-token")

        if (token) {
          // Make API request to logout
          await axios.post(
            `${BASE_URL}/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
        }

        // Clear local storage
        localStorage.removeItem("auth-token")
        localStorage.removeItem("user-info")

        setMessage({ text: "You have been successfully logged out!", type: "success" })

        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push("/login")
              router.refresh()
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error) {
        console.error("Logout Error:", error)

        // Even if the API call fails, we should still clear local storage
        localStorage.removeItem("auth-token")
        localStorage.removeItem("user-info")

        setMessage({
          text: "There was an issue with the logout process, but you've been logged out locally.",
          type: "warning",
        })

        // Start countdown anyway
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push("/login")
              router.refresh()
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-200 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <LogOut className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-green-700">Logging Out</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              className={`
                ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : message.type === "warning"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : message.type === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                }
              `}
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>

            {message.type === "success" && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Redirecting to login page in {countdown} seconds...</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${(countdown / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

