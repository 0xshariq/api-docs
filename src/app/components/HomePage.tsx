"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this runs only on client-side
    if (typeof window !== "undefined") {
      const storedApiKey = localStorage.getItem("api-key");
      setApiKey(storedApiKey);
    }
  }, []);

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      alert("API Key copied to clipboard!");
    }
  };

  const features = [
    { title: "Accessibility", description: "Free access to our collection of APIs." },
    { title: "Diverse Collection", description: "Comprehensive APIs for different needs." },
    { title: "Simplified Integration", description: "Clear documentation & code samples." },
    { title: "Community-Driven", description: "A vibrant developer community." },
  ];

  return (
    <main className="container mx-auto px-4 py-12 md:px-6">
      {/* Header Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-green-700">API Documentation</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Access a collection of free, powerful APIs for your projects.
        </p>
      </section>

      {/* API Key Section */}
      {apiKey ? (
        <section className="mt-12 bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-green-700">Your API Key</h2>
          <div className="bg-gray-100 mt-4 p-3 rounded-md text-gray-700 font-mono break-all text-lg">
            {apiKey}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCopy}>
              Copy API Key
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                localStorage.removeItem("api-key");
                setApiKey(null);
              }}
            >
              Logout & Remove API Key
            </Button>
          </div>
        </section>
      ) : (
        <section className="mt-12 text-center">
          <p className="text-lg text-gray-600">Register or login to get your API key.</p>
          <div className="mt-4 space-x-4">
            <Link href="/login" className="text-green-700 hover:underline font-medium">
              Login
            </Link>
            <Link href="/register" className="text-green-700 hover:underline font-medium">
              Register
            </Link>
          </div>
        </section>
      )}

      {/* API Cards Section */}
      <div className="grid gap-6 mt-16 md:grid-cols-2 lg:grid-cols-2">
        {[
          { title: "Quran API", desc: "Quranic verses, translations, and audio.", link: "/quran" },
          { title: "Weather API", desc: "Get real-time weather data and forecasts.", link: "/weather" },
        ].map((api, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow border border-gray-200">
            <CardHeader>
              <CardTitle>{api.title}</CardTitle>
              <CardDescription>{api.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={api.link} className="text-green-700 hover:underline font-medium">
                View Documentation →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Features Section */}
      <section className="mt-16">
        <h2 className="mb-8 text-3xl font-extrabold text-center text-green-700">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
