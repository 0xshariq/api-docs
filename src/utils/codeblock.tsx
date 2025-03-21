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

  const renderJavaScript = () => {
    return code
      .split("\n")
      .map((line) => {
        // Replace keywords
        const processedLine = line
          .replace(
            /(const|let|var|function|return|import|from|export|await|async|require)/g,
            '<span class="text-[#569CD6]">$1</span>',
          )
          .replace(/\b(console)\b/g, '<span class="text-[#4EC9B0]">$1</span>')
          .replace(/\.(log|then|catch|stringify)/g, '.<span class="text-[#DCDCAA]">$1</span>')
          .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-[#CE9178]">$&</span>')
          .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-[#569CD6]">$1</span>')
          .replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>')
          .replace(/\/\/.*/g, '<span class="text-[#6A9955]">$&</span>')

        return `<span class="line">${processedLine || " "}</span>`
      })
      .join("\n")
  }

  const renderPython = () => {
    return code
      .split("\n")
      .map((line) => {
        // Replace keywords
        const processedLine = line
          .replace(
            /(def|class|import|from|return|if|else|elif|for|while|try|except|with|as|in)/g,
            '<span class="text-[#569CD6]">$1</span>',
          )
          .replace(/\b(print)\b/g, '<span class="text-[#DCDCAA]">$1</span>')
          .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-[#CE9178]">$&</span>')
          .replace(/\b(True|False|None)\b/g, '<span class="text-[#569CD6]">$1</span>')
          .replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>')
          .replace(/#.*/g, '<span class="text-[#6A9955]">$&</span>')

        return `<span class="line">${processedLine || " "}</span>`
      })
      .join("\n")
  }

  const getHighlightedCode = () => {
    if (language === "javascript" || language === "typescript") {
      return renderJavaScript()
    } else if (language === "python") {
      return renderPython()
    } else {
      return code
        .split("\n")
        .map((line) => `<span class="line">${line || " "}</span>`)
        .join("\n")
    }
  }

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <motion.button
          onClick={copyToClipboard}
          className="flex items-center justify-center h-8 px-2 rounded-md text-gray-400 hover:bg-gray-700 bg-gray-800 bg-opacity-70 transition-colors"
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
                className="flex items-center"
              >
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <Copy className="h-4 w-4 mr-1" />
                <span className="text-xs">Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-md overflow-x-auto font-mono text-sm m-0">
        <code dangerouslySetInnerHTML={{ __html: getHighlightedCode() }} />
      </pre>
    </div>
  )
}

export default CodeBlock

