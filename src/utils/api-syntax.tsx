"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeBlock from "@/utils/codeblock"

interface ApiSyntaxProps {
  baseUrl: string
  endpoint: string
  method: string
  params?: Record<string, string>
}

export function ApiSyntax({ baseUrl, endpoint, method, params }: ApiSyntaxProps) {
  const [activeTab, setActiveTab] = useState("javascript")

  const javascriptCode = `
const axios = require('axios');

const config = {
  method: '${method.toLowerCase()}',
  url: '${baseUrl}${endpoint}',
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

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));
`

  const pythonCode = `
import requests

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
print(response.json())
`

  const curlCode = `
curl -X ${method.toUpperCase()} '${baseUrl}${endpoint}${params ? `?${new URLSearchParams(params)}` : ""}' \\
  -H 'Accept: application/json' \\
  -H 'x-api-key: YOUR_API_KEY'
`

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
      </TabsList>
      <TabsContent value="javascript">
        <CodeBlock language="javascript" code={javascriptCode} />
      </TabsContent>
      <TabsContent value="python">
        <CodeBlock language="python" code={pythonCode} />
      </TabsContent>
      <TabsContent value="curl">
        <CodeBlock language="bash" code={curlCode} />
      </TabsContent>
    </Tabs>
  )
}

