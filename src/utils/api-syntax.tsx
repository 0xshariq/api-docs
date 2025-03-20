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

  const renderCodeBlock = (code: string, language: string) => (
    <div className="relative group">
      <div className="absolute top-0 right-0 m-2 z-10">
        <motion.button
          onClick={() => handleCopy(code, language)}
          className="flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:bg-gray-700 bg-gray-800 bg-opacity-70 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copiedTab === language ? (
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
      <pre className="bg-[#1e1e1e] text-white p-4 rounded-md overflow-x-auto font-mono text-sm">
        <code className="block whitespace-pre">
          {language === "javascript" ? (
            <>
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
              params: ${JSON.stringify(params, null, 2).replace(/"([^"]+)":/g, '"<span class="text-[#CE9178]">$1</span>":')}`
                : ""}
              <br />
              {"}"};
              <br />
              <br />
              axios(config)
              <br />
              {"  "}.then(response =&gt; console.log(JSON.stringify(response.data)))
              <br />
              {"  "}.catch(error =&gt; console.log(error));
            </>
          ) : language === "python" ? (
            <>
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
              params = ${JSON.stringify(params, null, 2).replace(/"([^"]+)":/g, '"<span class="text-[#CE9178]">$1</span>":')}`
                : ""}
              <br />
              <br />
              response = requests.<span className="text-[#569CD6]">{method.toLowerCase()}</span>(url, headers=headers
              {params ? ", params=params" : ""})
              <br />
              <span className="text-[#569CD6]">print</span>(response.json())
            </>
          ) : (
            <>
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
            </>
          )}
        </code>
      </pre>
    </div>
  )

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
        <div className="mt-0 p-0">
          {activeTab === "javascript" && renderCodeBlock(javascriptCode, "javascript")}
          {activeTab === "python" && renderCodeBlock(pythonCode, "python")}
          {activeTab === "curl" && renderCodeBlock(curlCode, "curl")}
        </div>
      </div>
    </div>
  )
}

