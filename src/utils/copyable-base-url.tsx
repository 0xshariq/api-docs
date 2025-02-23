"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CopyableBaseUrlProps {
  url: string
}

export function CopyableBaseUrl({ url }: CopyableBaseUrlProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative inline-flex items-center">
      <code className="bg-gray-100 px-2 py-1 rounded">{url}</code>
      <button
        onClick={handleCopy}
        className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
      </button>
    </div>
  )
}

