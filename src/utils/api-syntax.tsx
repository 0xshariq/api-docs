"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ApiSyntaxProps {
  baseUrl: string
  endpoint: string
  method: string
  params?: Record<string, string>
}

export function ApiSyntax({ baseUrl, endpoint, method, params }: ApiSyntaxProps) {
  const [activeTab, setActiveTab] = useState<"javascript" | "python" | "curl">("javascript")
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const handleCopy = async (code: string, tab: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const javascriptCode = `const axios = require('axios');

const config = {
  method: '${method}',
  url: '${baseUrl}${endpoint}',
  headers: { 
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  }${
    params
      ? `,
  params: ${JSON.stringify(params, null, 2)}`
      : ""
  }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`

  const pythonCode = `import requests

url = '${baseUrl}${endpoint}'
headers = {
  'Content-Type': 'application/json',
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
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: YOUR_API_KEY'`

  const getActiveCode = () => {
    switch (activeTab) {
      case "javascript":
        return javascriptCode
      case "python":
        return pythonCode
      case "curl":
        return curlCode
      default:
        return javascriptCode
    }
  }

  return (
    <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
      <div className="w-full">
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="flex h-10 items-center justify-start p-0 bg-transparent w-full">
            <button
              onClick={() => setActiveTab("javascript")}
              className={`flex-1 h-full rounded-none border-b-2 ${activeTab === "javascript" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`flex-1 h-full rounded-none border-b-2 ${activeTab === "python" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab("curl")}
              className={`flex-1 h-full rounded-none border-b-2 ${activeTab === "curl" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              cURL
            </button>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute top-2 right-2 z-10">
            <motion.button
              onClick={() => handleCopy(getActiveCode(), activeTab)}
              className="flex items-center justify-center h-8 px-2 rounded-md text-gray-400 hover:bg-gray-700 bg-gray-800 bg-opacity-70 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copiedTab === activeTab ? (
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

          {activeTab === "javascript" && (
            <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
              <code>
                <span className="text-[#569CD6]">const</span> axios = <span className="text-[#569CD6]">require</span>(
                <span className="text-[#CE9178]">&#39;axios&#39;</span>);
                <br />
                <br />
                <span className="text-[#569CD6]">const</span> config = {"{"}
                <br />
                {"  "}method: <span className="text-[#CE9178]">&#39;{method}&#39;</span>,
                <br />
                {"  "}url:{" "}
                <span className="text-[#CE9178]">
                  &#39;{baseUrl}
                  {endpoint}&#39;
                </span>
                ,
                <br />
                {"  "}headers: {"{"}
                <br />
                {"    "}
                <span className="text-[#CE9178]">&#39;Content-Type&#39;</span>:{" "}
                <span className="text-[#CE9178]">&#39;application/json&#39;</span>,
                <br />
                {"    "}
                <span className="text-[#CE9178]">&#39;x-api-key&#39;</span>:{" "}
                <span className="text-[#CE9178]">&#39;YOUR_API_KEY&#39;</span>
                <br />
                {"  "}
                {"}"}
                {params
                  ? `,
                params: ${JSON.stringify(params, null, 2).replace(/"([^"]+)":/g, '"$1":')}`
                  : ""}
                <br />
                {"}"};
                <br />
                <br />
                axios(config)
                <br />
                {"  "}.<span className="text-[#DCDCAA]">then</span>(response =&gt; console.
                <span className="text-[#DCDCAA]">log</span>(JSON.<span className="text-[#DCDCAA]">stringify</span>
                (response.data)))
                <br />
                {"  "}.<span className="text-[#DCDCAA]">catch</span>(error =&gt; console.
                <span className="text-[#DCDCAA]">log</span>(error));
              </code>
            </pre>
          )}

          {activeTab === "python" && (
            <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
              <code>
                <span className="text-[#569CD6]">import</span> requests
                <br />
                <br />
                url ={" "}
                <span className="text-[#CE9178]">
                  &#39;{baseUrl}
                  {endpoint}&#39;
                </span>
                <br />
                headers = {"{"}
                <br />
                {"  "}
                <span className="text-[#CE9178]">&#39;Content-Type&#39;</span>:{" "}
                <span className="text-[#CE9178]">&#39;application/json&#39;</span>,
                <br />
                {"  "}
                <span className="text-[#CE9178]">&#39;x-api-key&#39;</span>:{" "}
                <span className="text-[#CE9178]">&#39;YOUR_API_KEY&#39;</span>
                <br />
                {"}"}
                {params
                  ? `
                params = ${JSON.stringify(params, null, 2).replace(/"([^"]+)":/g, '"$1":')}`
                  : ""}
                <br />
                <br />
                response = requests.<span className="text-[#DCDCAA]">{method.toLowerCase()}</span>(url, headers=headers
                {params ? ", params=params" : ""})
                <br />
                <span className="text-[#DCDCAA]">print</span>(response.<span className="text-[#DCDCAA]">json</span>())
              </code>
            </pre>
          )}

          {activeTab === "curl" && (
            <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
              <code>
                curl -X {method}{" "}
                <span className="text-[#CE9178]">
                  &#39;{baseUrl}
                  {endpoint}
                  {params ? `?${new URLSearchParams(params)}` : ""}&#39;
                </span>{" "}
                \
                <br />
                {"  "}-H <span className="text-[#CE9178]">&#39;Content-Type: application/json&#39;</span> \
                <br />
                {"  "}-H <span className="text-[#CE9178]">&#39;x-api-key: YOUR_API_KEY&#39;</span>
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

