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
      <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-lg overflow-x-auto font-mono text-sm max-w-full">
        <code className="break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: getColoredCode() }} />
      </pre>
      <AnimatePresence>
        <motion.button
          onClick={copyToClipboard}
          className={`absolute top-2 right-2 p-2 rounded-md transition-all duration-300 ease-in-out flex items-center space-x-1 ${
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

export default CodeBlock

