"use client"

import { useState, useEffect } from "react"
import { Check, Copy, Terminal } from "lucide-react"
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
    <div className="relative flex flex-wrap items-center bg-[#1e1e1e] text-[#D4D4D4] rounded-lg p-3 font-mono text-sm overflow-hidden group">
      <div className="flex items-center space-x-2 mr-2 mb-1 sm:mb-0">
        <Terminal className="h-4 w-4 text-green-400 flex-shrink-0" />
        <span className="text-green-400 font-semibold whitespace-nowrap">BASE_URL</span>
      </div>
      <div className="w-full sm:w-auto sm:flex-grow overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <span className="text-[#CE9178] break-all">{`"${url}"`}</span>
      </div>
      <AnimatePresence>
        <motion.button
          onClick={handleCopy}
          className={`mt-2 sm:mt-0 sm:ml-2 px-3 py-1 rounded transition-all duration-300 ease-in-out flex items-center space-x-1 ${
            copied ? "bg-green-500 text-white" : "bg-[#2d2d2d] text-gray-300 hover:bg-[#3d3d3d]"
          }`}
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  )
}

