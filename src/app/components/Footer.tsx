import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-600 to-green-500 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">API Documentation</h3>
            <p className="text-sm text-green-100">Comprehensive documentation for our Quran and Weather APIs.</p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/0xshariq"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-100 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/ShariqueCh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-100 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a href="khanshariq92213@gmail.com" className="hover:text-green-100 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quran" className="hover:text-green-100 transition-colors">
                  Quran API
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-green-100 transition-colors">
                  Weather API
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-green-100 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-green-100 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-green-100 transition-colors">
                  API Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-100 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-100 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-100 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        <div className="mt-8 pt-8 border-t border-green-400">
          <p className="text-center text-sm">© {new Date().getFullYear()} API Documentation. All rights reserved.</p>
        </div>
      </div>
    </div>
    </footer>
  )
}

