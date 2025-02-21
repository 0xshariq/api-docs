"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import endpointCards from "@/data/weatherApiEndpoints.json"
import CodeBlock from "@/utils/codeblock"
import Image from "next/image"
import { WeatherResponse } from "../../types/weather"

const BASE_URL = "https://weather-api-7qxy.onrender.com/api/v2"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export default function WeatherAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("current")
  const [city, setCity] = useState("")
  const [days, setDays] = useState("3")
  const [result, setResult] = useState<WeatherResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const endpoint = activeEndpoint === "current" ? "current" : "forecast"
      const params = new URLSearchParams({
        city,
        ...(activeEndpoint === "forecast" && { days }),
      })

      const response = await axios.get<WeatherResponse>(`${BASE_URL}/${endpoint}?${params}`, {
        headers: { "x-api-key": API_KEY },
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Weather API Documentation</h1>

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
  url: '${BASE_URL}/current&city=London',
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
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Parameters</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {card.parameters.map((param, i) => (
                          <li key={i}>
                            <code className="bg-gray-100 px-1 rounded">{param.name}</code>
                            {param.required && <span className="text-red-500">*</span>} - {param.type} -{" "}
                            {param.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Headers</h4>
                      <code className="bg-gray-100 px-2 py-1 rounded">{card.headers}</code>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Example Request</h4>
                      <code className="bg-gray-100 px-2 py-1 rounded">{card.exampleRequest}</code>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sample Response</h4>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
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
              <CardDescription>Test the weather API endpoints with different parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select onValueChange={setActiveEndpoint} defaultValue={activeEndpoint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Get Current Weather</SelectItem>
                    <SelectItem value="forecast">Get Weather Forecast</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                {activeEndpoint === "forecast" && (
                  <Select onValueChange={setDays} defaultValue={days}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select forecast days" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 3, 5, 7].map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d} {d === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {result.current && result.current.condition && result.current.condition.icon && (
                    <div>
                      <Image
                        src={`https:${result.current.condition.icon}`}
                        alt={result.current.condition.text || "Weather condition"}
                        width={64}
                        height={64}
                        className="rounded-lg"
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        Weather Icon URL:{" "}
                        <a
                          href={`https:${result.current.condition.icon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >{`https:${result.current.condition.icon}`}</a>
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

