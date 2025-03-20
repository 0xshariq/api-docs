"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CopyableBaseUrlProps {
  url: string
}

export function CopyableBaseUrl({ url }: CopyableBaseUrlProps) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = async () => {
    if (!mounted) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-gray-50 rounded-md border border-gray-200 p-4 font-mono text-sm">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="text-gray-500 mb-1">
            <span className="text-gray-700 font-semibold">BASE_URL</span>
          </div>
          <div className="text-blue-600 break-all">{url}</div>
        </div>
        <motion.button
          onClick={handleCopy}
          className="flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-200 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Copy className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}

