"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import axios from "axios"

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth-token")

      if (token) {
        await axios.get(`${BASE_URL}/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        localStorage.removeItem("auth-token")
      }

      setIsLoggedIn(false)
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
      localStorage.removeItem("auth-token")
      setIsLoggedIn(false)
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
        </div>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <Button className="bg-white text-green-600 hover:bg-green-100" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-white text-green-600 hover:bg-green-100">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

