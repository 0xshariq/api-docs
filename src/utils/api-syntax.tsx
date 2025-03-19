"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiSyntaxProps {
  baseUrl: string
  endpoint: string
  method: string
  params?: Record<string, string>
}

export function ApiSyntax({ baseUrl, endpoint, method, params }: ApiSyntaxProps) {
  const [activeTab, setActiveTab] = useState("javascript")
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const handleCopy = async (code: string, tab: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const javascriptCode = `const options = {
  method: '${method}',
  headers: {
    'Accept': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  }${
    params
      ? `,
  params: ${JSON.stringify(params, null, 2)}`
      : ""
  }
};

fetch('${baseUrl}${endpoint}', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`

  const pythonCode = `import requests

url = '${baseUrl}${endpoint}'
headers = {
  'Accept': 'application/json',
  'x-api-key': 'YOUR_API_KEY'
}${
    params
      ? `
params = ${JSON.stringify(params, null, 2)}`
      : ""
  }

response = requests.${method.toLowerCase()}(url, headers=headers${params ? ", params=params" : ""})
print(response.json())`

  const curlCode = `curl -X ${method} '${baseUrl}${endpoint}${params ? `?${new URLSearchParams(params)}` : ""}' \\
  -H 'Accept: application/json' \\
  -H 'x-api-key: YOUR_API_KEY'`

  const renderCodeBlock = (code: string, language: string) => (
    <div className="relative group">
      <pre className="bg-[#1e1e1e] text-white p-4 rounded-md font-mono text-sm overflow-x-auto max-w-full">
        <code className="break-words whitespace-pre-wrap">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCopy(code, language)}
        className={`absolute top-2 right-2 transition-all duration-300 ease-in-out ${
          copiedTab === language
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-[#2d2d2d] text-gray-300 hover:bg-[#3d3d3d]"
        }`}
      >
        {copiedTab === language ? (
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Copied!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </div>
        )}
      </Button>
    </div>
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
      </TabsList>
      <TabsContent value="javascript">{renderCodeBlock(javascriptCode, "javascript")}</TabsContent>
      <TabsContent value="python">{renderCodeBlock(pythonCode, "python")}</TabsContent>
      <TabsContent value="curl">{renderCodeBlock(curlCode, "curl")}</TabsContent>
    </Tabs>
  )
}

