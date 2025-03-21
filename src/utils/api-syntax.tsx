"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApiSyntaxProps {
  baseUrl: string;
  endpoint: string;
  method: string;
  params?: Record<string, string>;
}

export function ApiSyntax({ baseUrl, endpoint, method, params }: ApiSyntaxProps) {
  const [activeTab, setActiveTab] = useState<"javascript" | "python" | "curl" | "php" | "go" | "ruby">("javascript");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopy = async (code: string, tab: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const codeSnippets = {
    javascript: `const axios = require('axios');

const config = {
  method: '${method}',
  url: '${baseUrl}${endpoint}',
  headers: { 
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  }${params ? `,
  params: ${JSON.stringify(params, null, 2)}` : ""}
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`,

    python: `import requests

url = '${baseUrl}${endpoint}'
headers = {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY'
}${params ? `
params = ${JSON.stringify(params, null, 2)}` : ""}

response = requests.${method.toLowerCase()}(url, headers=headers${params ? ", params=params" : ""})
print(response.json())`,

    curl: `curl -X ${method} '${baseUrl}${endpoint}${params ? `?${new URLSearchParams(params)}` : ""}' \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: YOUR_API_KEY'`,

    php: `<?php
require 'vendor/autoload.php';

$client = new \\GuzzleHttp\\Client();

$response = $client->request('${method}', '${baseUrl}${endpoint}', [
  'headers' => [
    'Content-Type' => 'application/json',
    'x-api-key' => 'YOUR_API_KEY'
  ]${params ? `,
  'query' => ${JSON.stringify(params, null, 2)}` : ""}
]);

echo $response->getBody();
?>`,

    go: `package main

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
}`,

    ruby: `require 'uri'
require 'net/http'
require 'json'

url = URI("${baseUrl}${endpoint}")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(url)
request["Content-Type"] = "application/json"
request["x-api-key"] = "YOUR_API_KEY"

response = http.request(request)
puts response.read_body`,
  };

  const renderCodeBlock = (code: string, language: string) => (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <motion.button
          onClick={() => handleCopy(code, language)}
          className="flex items-center justify-center h-8 px-2 rounded-md text-gray-400 hover:bg-gray-700 bg-gray-800 bg-opacity-70 transition-colors"
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
      <pre className="bg-[#1e1e1e] text-[#D4D4D4] p-4 rounded-b-md overflow-x-auto font-mono text-sm m-0">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
      <div className="w-full">
        <div className="bg-gray-100 border-b border-gray-200 overflow-x-auto">
          <div className="flex h-10 items-center justify-start p-0 bg-transparent w-full">
            {Object.keys(codeSnippets).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 h-full rounded-none border-b-2 ${
                  activeTab === tab ? "border-green-600 text-green-600" : "border-transparent"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {renderCodeBlock(codeSnippets[activeTab], activeTab)}
      </div>
    </div>
  );
}