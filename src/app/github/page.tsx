"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import CodeBlock from "@/utils/codeblock"
import githubData from "@/data/githubApiEndpoints.json"

const BASE_URL = "https://github-user-activity-api.onrender.com/api/v1/github"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

interface GitHubActivity {
  type: string
  repo: string
  timestamp: string
}

interface GitHubResponse {
  status: string
  data: {
    username: string
    activities: GitHubActivity[]
  }
}

export default function GitHubAPI() {
  const [username, setUsername] = useState("")
  const [result, setResult] = useState<GitHubResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await axios.get<GitHubResponse>(`${BASE_URL}/user/${username}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
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
      <h1 className="text-3xl font-bold text-primary mb-6">GitHub User Activity API Documentation</h1>

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
  'Authorization': 'Bearer YOUR_API_KEY'
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
  url: '${BASE_URL}/user/octocat',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
  <CardHeader>
    <CardTitle>{githubData.title}</CardTitle>
    <CardDescription className="font-mono">{githubData.endpoint}</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p>
        <strong>Headers:</strong>{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">{githubData.headers}</code>
      </p>
      <p>
        <strong>Query Parameters:</strong>{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">{githubData.query}</code>
      </p>
      <p>
        <strong>Example Request:</strong>{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">{githubData.exampleRequest}</code>
      </p>
      <div>
        <strong>Sample Response:</strong>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2">
          <code>{JSON.stringify(githubData.sampleResponse, null, 2)}</code>
        </pre>
      </div>
    </div>
  </CardContent>
</Card>
        </TabsContent>

        <TabsContent value="tryit">
  <Card>
    <CardHeader>
      <CardTitle>Try the API</CardTitle>
      <CardDescription>Test the GitHub User Activity API endpoint</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Loading...
            </>
          ) : (
            "Send Request"
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded border border-red-400">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Response:</h3>
          {result.data.activities.length > 0 ? (
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <details open>
                <summary className="cursor-pointer text-yellow-300">📜 View JSON Response</summary>
                <pre className="overflow-x-auto mt-2 p-2 border border-gray-700 rounded bg-black">
                  <code className="text-green-400">{JSON.stringify(result, null, 2)}</code>
                </pre>
              </details>
            </div>
          ) : (
            <div className="p-4 bg-blue-100 text-blue-700 rounded border border-blue-400">
              ⚠️ No recent activity found for this user.
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

