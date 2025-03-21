"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Check } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedApiKey = localStorage.getItem("api-key")
      setApiKey(storedApiKey)
    }
  }, [])

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const features = [
    {
      title: "Accessibility",
      description: "Free access to our collection of APIs.",
      icon: "🔓",
    },
    {
      title: "Diverse Collection",
      description: "Comprehensive APIs for different needs.",
      icon: "🌐",
    },
    {
      title: "Simplified Integration",
      description: "Clear documentation & code samples.",
      icon: "📝",
    },
    {
      title: "Community-Driven",
      description: "A vibrant developer community.",
      icon: "👥",
    },
    {
      title: "API Key Security",
      description: "Your API key is securely stored and encrypted.",
      icon: "🔒",
    },
  ]

  const apis = [
    {
      title: "Quran API",
      desc: "Access Quranic verses, translations, and audio recitations with our comprehensive API.",
      link: "/quran",
      icon: "📖",
    },
    {
      title: "Weather API",
      desc: "Get real-time weather data and detailed forecasts for any location worldwide.",
      link: "/weather",
      icon: "🌤️",
    },
    {
      title: "Hadith API",
      desc: "Explore authentic Hadith collections with translations and references.",
      link: "/hadith",
      icon: "📚",
    },
    {
      title: "Recipe Finder API",
      desc: "Discover recipes, ingredients, and cooking instructions from around the world.",
      link: "/recipe",
      icon: "🍳",
    },
    {
      title: "GitHub User Activity API",
      desc: "Track and analyze GitHub user activities and contributions.",
      link: "/github",
      icon: "🐱",
    },
    {
      title: "Image-to-Text API",
      desc: "Convert images to text with OCR technology and machine learning models.",
      link: "/image-to-text",
      icon: "🖼️",
    },
    {
      title: "Currency Exchange API",
      desc: "Get real-time currency exchange rates and historical data.",
      link: "/currency",
      icon: "💱",
    },
    {
      title: "URL Shortener API",
      desc: "Shorten URLs and track click analytics with our URL shortener service.",
      link: "/url-shortener",
      icon: "🔗",
    },
    {
      title: "IP Geolocation API",
      desc: "Lookup IP addresses and get detailed geolocation information.",
      link: "/ip-geolocation",
      icon: "🌍",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="container mx-auto px-4 py-12 md:px-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-6 text-5xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 mb-8">
            Access a collection of free, powerful APIs for your projects.
          </p>
          {apiKey ? (
            <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copy API Key
                </>
              )}
            </Button>
          ) : (
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Register to Get API Key</Button>
            </Link>
          )}
        </motion.section>

        {/* API Cards Section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {apis.map((api, index) => (
            <motion.div key={index} variants={item}>
              <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 h-full">
                <CardHeader>
                  <div className="text-3xl mb-2">{api.icon}</div>
                  <CardTitle className="text-xl text-green-700">{api.title}</CardTitle>
                  <CardDescription>{api.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={api.link}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="mb-8 text-3xl font-extrabold text-center text-green-700">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div key={index} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 h-full">
                  <CardHeader>
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <CardTitle className="text-xl text-green-700">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}

