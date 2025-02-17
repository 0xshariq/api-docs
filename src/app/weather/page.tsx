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

export default function WeatherAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("current")
  const [city, setCity] = useState("")
  const [days, setDays] = useState("3")
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchData = async (endpoint: string) => {
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await axios.get(
        `https://weather-api-7qxy.onrender.com/api/v2/${endpoint}?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&city=${city}${activeEndpoint === "forecast" ? `&days=${days}` : ""}`,
      )
      setResult(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("An error occurred while fetching data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(activeEndpoint)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Weather API</h1>

      <Tabs defaultValue="tryItOut" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="tryItOut">Try It Out</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="tryItOut">
          <Card>
            <CardHeader>
              <CardTitle>Try the Weather API</CardTitle>
              <CardDescription>Select an endpoint and fill in the required fields to test the API</CardDescription>
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

                <Input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />

                {activeEndpoint === "forecast" && (
                  <Select onValueChange={setDays} defaultValue={days}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of days" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 14 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? "day" : "days"}
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <div className="space-y-6">
            {endpointCards.map((card, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.endpoint}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Headers:</strong> {card.headers}
                    </p>
                    <p>
                      <strong>Query :</strong> {card.query}
                    </p>
                    <p>
                      <strong>Example Request:</strong> {card.exampleRequest}
                    </p>
                    <div>
                      <strong>Sample Response:</strong>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2">{JSON.stringify(card.sampleResponse, null, 2)}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

