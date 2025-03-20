"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CodeBlockProps {
  code: string
  language: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyToClipboard = () => {
    if (!mounted) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Syntax highlighting colors
  const getColoredCode = () => {
    if (language === "javascript" || language === "typescript") {
      return code
        .replace(
          /(const|let|var|function|return|import|from|export|await|async)/g,
          '<span class="text-[#569CD6]">$1</span>',
        )
        .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-[#CE9178]">$&</span>')
        .replace(/\b(true|false|null|undefined|console)\b/g, '<span class="text-[#569CD6]">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>')
        .replace(/\/\/.*/g, '<span class="text-[#6A9955]">$&</span>')
    } else if (language === "python") {
      return code
        .replace(
          /(def|class|import|from|return|if|else|elif|for|while|try|except|with|as|in)/g,
          '<span class="text-[#569CD6]">$1</span>',
        )
        .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-[#CE9178]">$&</span>')
        .replace(/\b(True|False|None|print)\b/g, '<span class="text-[#569CD6]">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>')
        .replace(/#.*/g, '<span class="text-[#6A9955]">$&</span>')
    } else {
      return code
    }
  }

  return (
    <div className="relative group">
      <div className="absolute top-0 right-0 m-2 z-10">
        <motion.button
          onClick={copyToClipboard}
          className="flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:bg-gray-700 bg-gray-800 bg-opacity-70 transition-colors"
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
      <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-md overflow-x-auto font-mono text-sm">
        <code className="block" dangerouslySetInnerHTML={{ __html: getColoredCode() }} />
      </pre>
    </div>
  )
}

export default CodeBlock

