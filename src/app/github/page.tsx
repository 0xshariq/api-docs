"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import CodeBlock from "@/utils/codeblock";
import githubData from "@/data/githubApiEndpoints.json";
import Image from "next/image";

const BASE_URL = "https://github-user-activity-api.onrender.com/api/v1/github";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
interface GitHubActor {
  id: number;
  login: string;
  display_login: string;
  avatar_url: string;
  url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  url: string;
}

interface GitHubCommit {
  sha: string;
  author: {
    email: string;
    name: string;
  };
  message: string;
  distinct: boolean;
  url: string;
}

interface GitHubPayload {
  repository_id: number;
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: GitHubCommit[];
}

interface GitHubActivity {
  id: string;
  type: string;
  actor: GitHubActor;
  repo: GitHubRepo;
  payload: GitHubPayload;
  public: boolean;
  created_at: string;
}

interface GitHubResponse {
  status: string;
  data: GitHubActivity[];
}

export default function GitHubAPI() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<GitHubResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.get<GitHubResponse>(
        `${BASE_URL}/user/${username}`,
        {
          headers: { Authorization: `Bearer ${API_KEY}` },
        }
      );
      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">
        GitHub User Activity API Documentation
      </h1>

      <Tabs defaultValue="docs" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="tryit">Try It Out</TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Base URL:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {BASE_URL}
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Authentication</h3>
              <p className="text-gray-600 mb-2">
                All API requests require an API key to be included in the
                request headers:
              </p>
              <CodeBlock
                language="javascript"
                code={`const headers = { 'Authorization': 'Bearer YOUR_API_KEY' };`}
              />

              <h3 className="text-lg font-semibold">Example Request</h3>
              <CodeBlock
                language="javascript"
                code={`const axios = require('axios');
const config = {
  method: 'get',
  url: '${BASE_URL}/user/octocat',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
};

axios(config)
  .then(response => console.log(JSON.stringify(response.data)))
  .catch(error => console.log(error));`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{githubData.title}</CardTitle>
              <CardDescription className="font-mono">
                {githubData.endpoint}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Headers:</strong>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {githubData.headers}
                  </code>
                </p>
                <p>
                  <strong>Query Parameters:</strong>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {githubData.query}
                  </code>
                </p>
                <p>
                  <strong>Example Request:</strong>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {githubData.exampleRequest}
                  </code>
                </p>
                <div>
                  <strong>Sample Response:</strong>
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2">
                    <code>
                      {JSON.stringify(githubData.sampleResponse, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Try It Out Tab */}
        <TabsContent value="tryit">
          <Card>
            <CardHeader>
              <CardTitle>Try the API</CardTitle>
              <CardDescription>
                Test the GitHub User Activity API endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter GitHub username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Send Request"}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Recent Activities</h3>

                  {result.data.length === 0 ? (
                    <div className="p-4 bg-blue-100 text-blue-700 rounded border border-blue-400">
                      ⚠️ No recent activity found for this user.
                    </div>
                  ) : (
                    result.data.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 border border-gray-200 rounded-lg shadow-md"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={activity.actor.avatar_url}
                            alt={activity.actor.display_login}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <a
                              href={activity.actor.url}
                              target="_blank"
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              {activity.actor.display_login}
                            </a>
                            <p className="text-gray-500 text-sm">
                              {activity.type} -{" "}
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
