"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Github, Menu, X, LogOut, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh()
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
              <Link href="/hadith" className="text-white hover:text-green-100 transition-colors">
                Hadith API
              </Link>
              <Link href="/recipes" className="text-white hover:text-green-100 transition-colors">
                Recipe API
              </Link>
              <Link href="/github" className="text-white hover:text-green-100 transition-colors">
                GitHub API
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-100 transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-white text-green-600 hover:bg-green-100 flex items-center space-x-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login">
                  <Button className="bg-white text-green-600 hover:bg-green-100 flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
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
            <Link href="/hadith" className="block text-white hover:text-green-100 transition-colors">
              Hadith API
            </Link>
            <Link href="/recipes" className="block text-white hover:text-green-100 transition-colors">
              Recipe API
            </Link>
            <Link href="/github" className="block text-white hover:text-green-100 transition-colors">
              GitHub API
            </Link>
            {isAuthenticated ? (
              <Button
                className="w-full bg-white text-green-600 hover:bg-green-100 flex items-center justify-center space-x-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Link href="/login" className="block">
                <Button className="w-full bg-white text-green-600 hover:bg-green-100 flex items-center justify-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

