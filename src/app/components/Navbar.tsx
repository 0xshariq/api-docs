"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth-token")

      if (token) {
        const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"
        await axios.get(`${BASE_URL}/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Clear local storage and redirect
        localStorage.removeItem("auth-token")
        router.push("/login")
        router.refresh()
      } else {
        // If no token is found, just redirect to login
        router.push("/login")
      }
    } catch (error: any) {
      console.error("Logout failed:", error)
      localStorage.removeItem("auth-token")
      router.push("/login")
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-green-600 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex space-x-4">
          <Link href="/" className="rounded px-4 py-2 text-white hover:bg-green-700">
            Home
          </Link>
          <Link href="/quran" className="rounded px-4 py-2 text-white hover:bg-green-700">
            Quran API
          </Link>
          <Link href="/weather" className="rounded px-4 py-2 text-white hover:bg-green-700">
            Weather API
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="rounded px-4 py-2 text-white hover:bg-green-700">
            Login
          </Link>
          <Button className="text-white hover:bg-green-700 hover:text-white" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
