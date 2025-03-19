"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import endpointCards from "@/data/quranApiEndpoints.json"
import { CopyableBaseUrl } from "@/utils/copyable-base-url"
import { ApiSyntax } from "@/utils/api-syntax"
import Image from "next/image"

const BASE_URL = "https://quran-api-ny11.onrender.com/api/v2/quran"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const languageOptions = [
  { value: "eng", label: "English" },
  { value: "arabic", label: "Arabic" },
  { value: "urdu", label: "Urdu" },
]

interface JsonResponse {
  [key: string]: unknown
}

interface ApiResponse {
  type: "json" | "audio" | "image"
  data: JsonResponse | string
}

export default function QuranAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("1")
  const [surahNumber, setSurahNumber] = useState("")
  const [verseNumber, setVerseNumber] = useState("")
  const [language, setLanguage] = useState("eng")
  const [reciter, setReciter] = useState("")
  const [paraNumber, setParaNumber] = useState("")
  const [pageNumber, setPageNumber] = useState("")
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      let endpoint = ""
      const params: Record<string, string> = {}

      switch (activeEndpoint) {
        case "1":
          endpoint = "surah"
          break
        case "2":
          endpoint = `surah/${surahNumber}`
          break
        case "3":
          endpoint = `${surahNumber}:${verseNumber}&lang=${language}`
          break
        case "4":
          endpoint = `audio/${reciter}/${surahNumber}:${verseNumber}`
          break
        case "5":
          endpoint = "reciters"
          break
        case "6":
          endpoint = `para/${paraNumber}:${pageNumber}`
          break
        case "7":
          endpoint = `surah/${surahNumber}:${pageNumber}`
          break
        case "8":
          endpoint = ""
          break
      }

      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        params,
        headers: { "x-api-key": API_KEY },
        responseType:
          activeEndpoint === "4" || activeEndpoint === "6" || activeEndpoint === "7" ? "arraybuffer" : "json",
      })

      let responseType: "json" | "audio" | "image" = "json"
      let responseData: JsonResponse | string = response.data

      if (activeEndpoint === "4") {
        responseType = "audio"
        const blob = new Blob([response.data], { type: "audio/mpeg" })
        responseData = URL.createObjectURL(blob)
      } else if (activeEndpoint === "6" || activeEndpoint === "7") {
        responseType = "image"
        const blob = new Blob([response.data], { type: "image/png" })
        responseData = URL.createObjectURL(blob)
      }

      setResult({ type: responseType, data: responseData })
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Quran API Documentation</h1>

      <Tabs defaultValue="docs" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
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
                <p className="text-gray-600 mb-2">
                  All API requests require an API key to be included in the request headers:
                </p>
                <ApiSyntax baseUrl={BASE_URL} endpoint="/surah/1" method="GET" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {endpointCards.map((card, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription className="font-mono break-words">{card.endpoint}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Headers:</strong>{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded break-words block overflow-x-auto">
                        {card.headers}
                      </code>
                    </p>
                    <p>
                      <strong>Example Request:</strong>{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded break-words block overflow-x-auto">
                        {card.exampleRequest}
                      </code>
                    </p>
                    <div>
                      <strong>Sample Response:</strong>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-w-full">
                        <code className="break-words whitespace-pre-wrap">
                          {typeof card.sampleResponse === "string"
                            ? card.sampleResponse
                            : JSON.stringify(card.sampleResponse, null, 2)}
                        </code>
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
                    {endpointCards.map((card, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {card.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(activeEndpoint === "2" ||
                  activeEndpoint === "3" ||
                  activeEndpoint === "4" ||
                  activeEndpoint === "7") && (
                  <Input
                    type="number"
                    placeholder="Surah Number (1-114)"
                    value={surahNumber}
                    onChange={(e) => setSurahNumber(e.target.value)}
                    min="1"
                    max="114"
                    required
                  />
                )}

                {(activeEndpoint === "3" || activeEndpoint === "4") && (
                  <Input
                    type="number"
                    placeholder="Verse Number"
                    value={verseNumber}
                    onChange={(e) => setVerseNumber(e.target.value)}
                    min="1"
                    required
                  />
                )}

                {activeEndpoint === "3" && (
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
                )}

                {activeEndpoint === "4" && (
                  <Input
                    type="text"
                    placeholder="Reciter (e.g., Alafasy_64kbps)"
                    value={reciter}
                    onChange={(e) => setReciter(e.target.value)}
                    required
                  />
                )}

                {(activeEndpoint === "6" || activeEndpoint === "7") && (
                  <>
                    <Input
                      type="number"
                      placeholder="Para Number (1-30)"
                      value={paraNumber}
                      onChange={(e) => setParaNumber(e.target.value)}
                      min="1"
                      max="30"
                      required={activeEndpoint === "6"}
                    />
                    <Input
                      type="number"
                      placeholder="Page Number"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(e.target.value)}
                      min="1"
                      required
                    />
                  </>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Send Request"}
                </Button>
              </form>

              {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

              {result && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Response:</h3>
                  {result.type === "json" && (
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                      <pre className="overflow-x-auto max-w-full">
                        <code className="break-words whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                  {result.type === "audio" && typeof result.data === "string" && (
                    <div>
                      <audio controls className="w-full">
                        <source src={result.data} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <p className="mt-2 text-sm text-gray-600 break-words">
                        Audio URL:{" "}
                        <a
                          href={result.data}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {result.data}
                        </a>
                      </p>
                    </div>
                  )}
                  {result.type === "image" && typeof result.data === "string" && (
                    <div>
                      <Image
                        src={result.data || "/placeholder.svg"}
                        alt="Quran page"
                        className="max-w-full h-auto rounded-lg"
                      />
                      <p className="mt-2 text-sm text-gray-600 break-words">
                        Image URL:{" "}
                        <a
                          href={result.data}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {result.data}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

