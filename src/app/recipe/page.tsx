"use client";

import type React from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyableBaseUrl } from "@/utils/copyable-base-url";
import axios from "axios";
import endpointCards from "@/data/recipeApiEndpoints.json";
import CodeBlock from "@/utils/codeblock";

const BASE_URL = "https://recipe-finder-api-3h6z.onrender.com";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface RecipeResponse {
  [key: string]: unknown;
}

export default function RecipeAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("1");
  const [recipeName, setRecipeName] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState<RecipeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      let endpoint = "";
      const params: Record<string, string> = { key: API_KEY || "" };

      switch (activeEndpoint) {
        case "1":
          endpoint = `name/${recipeName}`;
          break;
        case "2":
          endpoint = "random";
          break;
        case "3":
          endpoint = recipeId;
          break;
        case "4":
          endpoint = "categories";
          break;
        case "5":
          endpoint = `category/${category}`;
          break;
        case "6":
          endpoint = `area/${area}`;
          break;
        case "7":
          endpoint = `ingredient/${ingredients}`;
          break;
        case "8":
          endpoint = `${recipeId}/summary`;
          break;
        case "9":
          endpoint = `${recipeId}/instructions`;
          break;
      }

      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        params,
        headers: { "x-api-key": API_KEY },
      });

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
        Recipe API Documentation
      </h1>

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
                <p className="text-gray-600 mb-2">
                  All API requests require an API key to be included in the
                  request headers:
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
  url: '${BASE_URL}/name/spaghetti',
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
                  <CardDescription className="font-mono">
                    {card.endpoint}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Headers:</strong>{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {card.headers}
                      </code>
                    </p>
                    <p>
                      <strong>Example Request:</strong>{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {card.exampleRequest}
                      </code>
                    </p>
                    <div>
                      <strong>Sample Response:</strong>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2">
                        <code>
                          {JSON.stringify(card.sampleResponse, null, 2)}
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
              <CardDescription>
                Test the API endpoints with different parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  onValueChange={setActiveEndpoint}
                  defaultValue={activeEndpoint}
                >
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

                {activeEndpoint === "1" && (
                  <Input
                    type="text"
                    placeholder="Enter recipe name"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    required
                  />
                )}

                {(activeEndpoint === "3" ||
                  activeEndpoint === "8" ||
                  activeEndpoint === "9") && (
                  <Input
                    type="text"
                    placeholder="Enter recipe ID"
                    value={recipeId}
                    onChange={(e) => setRecipeId(e.target.value)}
                    required
                  />
                )}

                {activeEndpoint === "5" && (
                  <Input
                    type="text"
                    placeholder="Enter category (e.g., Beef)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                )}

                {activeEndpoint === "6" && (
                  <Input
                    type="text"
                    placeholder="Enter area (e.g., Italian)"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                  />
                )}

                {activeEndpoint === "7" && (
                  <Input
                    type="text"
                    placeholder="Enter ingredients (comma-separated)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                  />
                )}

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
  );
}
