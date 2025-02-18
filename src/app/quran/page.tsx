"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Copy } from "lucide-react"
import axios from "axios"
import endpointCards from "@/data/quranApiEndpoints.json"

const BASE_URL = "https://quran-api-ny11.onrender.com/api/v2/quran"

const languageOptions = [
  { value: "eng", label: "English" },
  { value: "arabic", label: "Arabic" },
  { value: "urdu", label: "Urdu" },
]

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
      </button>
    </div>
  )
}

export default function QuranAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("surah")
  const [surahNumber, setSurahNumber] = useState("")
  const [ayahNumber, setAyahNumber] = useState("")
  const [language, setLanguage] = useState("eng")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      let endpoint = ""
      switch (activeEndpoint) {
        case "surah":
          endpoint = `surah/${surahNumber}`
          break
        case "ayah":
          endpoint = `${surahNumber}:${ayahNumber}&lang=${language}`
          break
      }

      const response = await axios.get(`${BASE_URL}/${endpoint}`)
      setResult(response.data)
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Quran API Documentation</h1>

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
                Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{BASE_URL}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                <p className="text-gray-600 mb-2">
                  All API requests require an API key to be included in the request headers:
                </p>
                <CodeBlock
                  language="javascript"
                  code={`const headers = {
  'x-api-key': 'YOUR_API_KEY'
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Example Request</h3>
                <CodeBlock
                  language="javascript"
                  code={`const axios = require('axios');

const config = {
  method: 'get',
  url: '${BASE_URL}/surah/1',
  headers: {
    'Accept': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
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
                        <code>{typeof card.sampleResponse === 'string' ? card.sampleResponse : JSON.stringify(card.sampleResponse, null, 2)}</code>
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
              <CardDescription>Test the API endpoints with different parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select onValueChange={setActiveEndpoint} defaultValue={activeEndpoint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surah">Get Surah</SelectItem>
                    <SelectItem value="ayah">Get Ayah</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Surah Number (1-114)"
                    value={surahNumber}
                    onChange={(e) => setSurahNumber(e.target.value)}
                    min="1"
                    max="114"
                    required
                  />

                  {activeEndpoint === "ayah" && (
                    <>
                      <Input
                        type="number"
                        placeholder="Ayah Number"
                        value={ayahNumber}
                        onChange={(e) => setAyahNumber(e.target.value)}
                        min="1"
                        required
                      />
                      <Select onValueChange={setLanguage} defaultValue={language}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

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

