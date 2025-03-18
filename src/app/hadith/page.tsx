"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import endpointCards from "@/data/hadithApiEndpoints.json"
import { CopyableBaseUrl } from "@/utils/copyable-base-url"
import { ApiSyntax } from "@/utils/api-syntax"
import CodeBlock from "@/utils/codeblock"

const BASE_URL = "https://hadith-api.onrender.com"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

interface HadithResponse {
  [key: string]: unknown
}

export default function HadithAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("1")
  const [edition, setEdition] = useState("eng-bukhari")
  const [hadithNumber, setHadithNumber] = useState("")
  const [sectionNumber, setSectionNumber] = useState("")
  const [result, setResult] = useState<HadithResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      let endpoint = ""
      const params: Record<string, string> = { key: API_KEY || "" }

      switch (activeEndpoint) {
        case "1":
          endpoint = `/api/v1/hadith/${edition}/${hadithNumber}`
          break
        case "2":
          endpoint = "/api/v1/hadith/editions"
          break
        case "3":
          endpoint = `/api/v1/hadith/${edition}/sections/${sectionNumber}`
          break
        case "4":
          endpoint = "/api/v1/hadith/info"
          break
      }

      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params,
        headers: { "Content-Type": "application/json" },
      })

      setResult(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const editions = [
    { value: "eng-bukhari", label: "Sahih Bukhari (English)" },
    { value: "ara-bukhari", label: "Sahih Bukhari (Arabic)" },
    { value: "eng-muslim", label: "Sahih Muslim (English)" },
    { value: "ara-muslim", label: "Sahih Muslim (Arabic)" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Hadith API Documentation</h1>

      <Tabs defaultValue="docs" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="tryit">Try It Out</TabsTrigger>
        </TabsList>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Base URL: <CopyableBaseUrl url={BASE_URL} />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                <p className="text-gray-600 mb-2">All API requests require the appropriate headers:</p>
                <ApiSyntax baseUrl={BASE_URL} endpoint="/api/v1/hadith/en-sahihbukhari/1" method="GET" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Example Request</h3>
                <CodeBlock
                  language="javascript"
                  code={`const axios = require('axios');

const config = {
  method: 'get',
  url: '${BASE_URL}/api/v1/hadith/en-sahihbukhari/1',
  headers: { 
    'Content-Type': 'application/json'
  }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {endpointCards.map((card, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription className="font-mono">{card.endpoint}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Headers:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{card.headers}</code>
                    </p>
                    <p>
                      <strong>Example Request:</strong>{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">{card.exampleRequest}</code>
                    </p>
                    <div>
                      <strong>Sample Response:</strong>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2">
                        <code>{JSON.stringify(card.sampleResponse, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tryit">
          <Card>
            <CardHeader>
              <CardTitle>Try the API</CardTitle>
              <CardDescription>Test the Hadith API endpoints with different parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select onValueChange={setActiveEndpoint} defaultValue={activeEndpoint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointCards.map((card, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {card.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(activeEndpoint === "1" || activeEndpoint === "3") && (
                  <Select onValueChange={setEdition} defaultValue={edition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select edition" />
                    </SelectTrigger>
                    <SelectContent>
                      {editions.map((edition) => (
                        <SelectItem key={edition.value} value={edition.value}>
                          {edition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {activeEndpoint === "1" && (
                  <Input
                    type="number"
                    placeholder="Enter hadith number"
                    value={hadithNumber}
                    onChange={(e) => setHadithNumber(e.target.value)}
                    required
                  />
                )}

                {activeEndpoint === "3" && (
                  <Input
                    type="number"
                    placeholder="Enter section number"
                    value={sectionNumber}
                    onChange={(e) => setSectionNumber(e.target.value)}
                    required
                  />
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Send Request"}
                </Button>
              </form>

              {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

              {result && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Response:</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                    <pre className="overflow-x-auto">
                      <code>{JSON.stringify(result, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

