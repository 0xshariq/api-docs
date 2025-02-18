"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Github, Menu, X } from "lucide-react"
import axios from "axios" 
const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-green-500 py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-white">
              API Docs
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/quran" className="text-white hover:text-green-100 transition-colors">
                Quran API
              </Link>
              <Link href="/weather" className="text-white hover:text-green-100 transition-colors">
                Weather API
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/0xshariq/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-100 transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            {isLoggedIn ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-green-600 hover:bg-green-100" onClick={handleLogout}>
                  Logout
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login">
                  <Button className="bg-white text-green-600 hover:bg-green-100">Login</Button>
                </Link>
              </motion.div>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 space-y-4"
          >
            <Link href="/quran" className="block text-white hover:text-green-100 transition-colors">
              Quran API
            </Link>
            <Link href="/weather" className="block text-white hover:text-green-100 transition-colors">
              Weather API
            </Link>
            {isLoggedIn ? (
              <Button className="w-full bg-white text-green-600 hover:bg-green-100" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/login" className="block">
                <Button className="w-full bg-white text-green-600 hover:bg-green-100">Login</Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

