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
  const [activeTab, setActiveTab] = useState<"javascript" | "python" | "curl" | "php" | "go" | "ruby">("javascript")
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

  const phpCode = `<?php
require 'vendor/autoload.php';

$client = new \\GuzzleHttp\\Client();

$response = $client->request('${method}', '${baseUrl}${endpoint}', [
  'headers' => [
    'Content-Type' => 'application/json',
    'x-api-key' => 'YOUR_API_KEY'
  ]${
    params
      ? `,
  'query' => ${JSON.stringify(params, null, 2)}`
      : ""
  }
]);

echo $response->getBody();
?>`

  const goCode = `package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "${baseUrl}${endpoint}"
  req, _ := http.NewRequest("${method}", url, nil)
  
  req.Header.Add("Content-Type", "application/json")
  req.Header.Add("x-api-key", "YOUR_API_KEY")
  
  res, _ := http.DefaultClient.Do(req)
  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)
  
  fmt.Println(string(body))
}`

  const rubyCode = `require 'uri'
require 'net/http'
require 'json'

url = URI("${baseUrl}${endpoint}")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(url)
request["Content-Type"] = "application/json"
request["x-api-key"] = "YOUR_API_KEY"

response = http.request(request)
puts response.read_body`

  const getActiveCode = () => {
    switch (activeTab) {
      case "javascript":
        return javascriptCode
      case "python":
        return pythonCode
      case "curl":
        return curlCode
      case "php":
        return phpCode
      case "go":
        return goCode
      case "ruby":
        return rubyCode
      default:
        return javascriptCode
    }
  }

  return (
    <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
      <div className="w-full">
        <div className="bg-gray-100 border-b border-gray-200 overflow-x-auto">
          <div className="flex h-10 items-center justify-start p-0 bg-transparent w-full">
            <button
              onClick={() => setActiveTab("javascript")}
              className={`px-4 h-full rounded-none border-b-2 ${activeTab === "javascript" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`px-4 h-full rounded-none border-b-2 ${activeTab === "python" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab("curl")}
              className={`px-4 h-full rounded-none border-b-2 ${activeTab === "curl" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveTab("php")}
              className={`px-4 h-full rounded-none border-b-2 ${activeTab === "php" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              PHP
            </button>
            <button
              onClick={() => setActiveTab("go")}
              className={`px-4 h-full rounded-none border-b-2 ${activeTab === "go" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              Go
            </button>
            <button
              onClick={() => setActiveTab("ruby")}
              className={`px-4 h-full rounded-none border-b-2 ${activeTab === "ruby" ? "border-green-600 text-green-600" : "border-transparent"}`}
            >
              Ruby
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

          {activeTab === "php" && (
            <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
              <code>
                <span className="text-[#569CD6]">&lt;?php</span>
                <br />
                <span className="text-[#569CD6]">require</span>{" "}
                <span className="text-[#CE9178]">&#39;vendor/autoload.php&#39;</span>;
                <br />
                <br />
                $client = <span className="text-[#569CD6]">new</span> \GuzzleHttp\Client();
                <br />
                <br />
                $response = $client-&gt;<span className="text-[#DCDCAA]">request</span>(
                <span className="text-[#CE9178]">&#39;{method}&#39;</span>,{" "}
                <span className="text-[#CE9178]">
                  &#39;{baseUrl}
                  {endpoint}&#39;
                </span>
                , [
                <br />
                {"  "}
                <span className="text-[#CE9178]">&#39;headers&#39;</span> =&gt; [
                <br />
                {"    "}
                <span className="text-[#CE9178]">&#39;Content-Type&#39;</span> =&gt;{" "}
                <span className="text-[#CE9178]">&#39;application/json&#39;</span>,
                <br />
                {"    "}
                <span className="text-[#CE9178]">&#39;x-api-key&#39;</span> =&gt;{" "}
                <span className="text-[#CE9178]">&#39;YOUR_API_KEY&#39;</span>
                <br />
                {"  "}]
                {params
                  ? `,
                &#39;query&#39; => ${JSON.stringify(params, null, 2).replace(/"([^"]+)":/g, '"$1":')}`
                  : ""}
                <br />
                ]);
                <br />
                <br />
                <span className="text-[#DCDCAA]">echo</span> $response-&gt;
                <span className="text-[#DCDCAA]">getBody</span>();
                <br />
                <span className="text-[#569CD6]">?&gt;</span>
              </code>
            </pre>
          )}

          {activeTab === "go" && (
            <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
              <code>
                <span className="text-[#569CD6]">package</span> main
                <br />
                <br />
                <span className="text-[#569CD6]">import</span> (
                <br />
                {"  "}
                <span className="text-[#CE9178]">"fmt"</span>
                <br />
                {"  "}
                <span className="text-[#CE9178]">"net/http"</span>
                <br />
                {"  "}
                <span className="text-[#CE9178]">"io/ioutil"</span>
                <br />
                )
                <br />
                <br />
                <span className="text-[#569CD6]">func</span> <span className="text-[#DCDCAA]">main</span>() {"{"}
                <br />
                {"  "}url :={" "}
                <span className="text-[#CE9178]">
                  "{baseUrl}
                  {endpoint}"
                </span>
                <br />
                {"  "}req, _ := http.<span className="text-[#DCDCAA]">NewRequest</span>(
                <span className="text-[#CE9178]">"{method}"</span>, url, <span className="text-[#569CD6]">nil</span>)
                <br />
                {"  "}
                <br />
                {"  "}req.Header.<span className="text-[#DCDCAA]">Add</span>(
                <span className="text-[#CE9178]">"Content-Type"</span>,{" "}
                <span className="text-[#CE9178]">"application/json"</span>)
                <br />
                {"  "}req.Header.<span className="text-[#DCDCAA]">Add</span>(
                <span className="text-[#CE9178]">"x-api-key"</span>,{" "}
                <span className="text-[#CE9178]">"YOUR_API_KEY"</span>)
                <br />
                {"  "}
                <br />
                {"  "}res, _ := http.DefaultClient.<span className="text-[#DCDCAA]">Do</span>(req)
                <br />
                {"  "}
                <span className="text-[#569CD6]">defer</span> res.Body.<span className="text-[#DCDCAA]">Close</span>()
                <br />
                {"  "}body, _ := ioutil.<span className="text-[#DCDCAA]">ReadAll</span>(res.Body)
                <br />
                {"  "}
                <br />
                {"  "}fmt.<span className="text-[#DCDCAA]">Println</span>(<span className="text-[#569CD6]">string</span>
                (body))
                <br />
                {"}"}
              </code>
            </pre>
          )}

          {activeTab === "ruby" && (
            <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
              <code>
                <span className="text-[#569CD6]">require</span> <span className="text-[#CE9178]">&#39;uri&#39;</span>
                <br />
                <span className="text-[#569CD6]">require</span>{" "}
                <span className="text-[#CE9178]">&#39;net/http&#39;</span>
                <br />
                <span className="text-[#569CD6]">require</span> <span className="text-[#CE9178]">&#39;json&#39;</span>
                <br />
                <br />
                url = <span className="text-[#DCDCAA]">URI</span>(
                <span className="text-[#CE9178]">
                  "{baseUrl}
                  {endpoint}"
                </span>
                )
                <br />
                <br />
                http = <span className="text-[#DCDCAA]">Net::HTTP</span>.<span className="text-[#DCDCAA]">new</span>
                (url.host, url.port)
                <br />
                http.use_ssl = <span className="text-[#569CD6]">true</span>
                <br />
                <br />
                request ={" "}
                <span className="text-[#DCDCAA]">
                  Net::HTTP::{method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}
                </span>
                .<span className="text-[#DCDCAA]">new</span>(url)
                <br />
                request[<span className="text-[#CE9178]">"Content-Type"</span>] ={" "}
                <span className="text-[#CE9178]">"application/json"</span>
                <br />
                request[<span className="text-[#CE9178]">"x-api-key"</span>] ={" "}
                <span className="text-[#CE9178]">"YOUR_API_KEY"</span>
                <br />
                <br />
                response = http.<span className="text-[#DCDCAA]">request</span>(request)
                <br />
                <span className="text-[#DCDCAA]">puts</span> response.read_body
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

