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
import axios from "axios";
import endpointCards from "@/data/quranApiEndpoints.json";

export default function QuranAPI() {
  const [activeEndpoint, setActiveEndpoint] = useState("surah");
  const [surahNumber, setSurahNumber] = useState("");
  const [ayahNumber, setAyahNumber] = useState("");
  const [paraNumber, setParaNumber] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [reciter, setReciter] = useState("Alafasy_64kbps");
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (endpoint: string) => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.get(
        `https://quran-api-ny11.onrender.com/api/v2/quran/${endpoint}?key=${process.env.NEXT_PUBLIC_QURAN_API_KEY}`
      );
      setResult(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = "";

    switch (activeEndpoint) {
      case "surah":
        endpoint = `surah/${surahNumber}`;
        break;
      case "ayah":
        endpoint = `${surahNumber}:${ayahNumber}&lang=${language}`;
        break;
      case "audio":
        endpoint = `audio/${reciter}/${surahNumber}:${ayahNumber}`;
        break;
      case "para":
        endpoint = `para/${paraNumber}:${pageNumber}`;
        break;
      case "surahPage":
        endpoint = `surah/${surahNumber}:${pageNumber}`;
        break;
    }

    fetchData(endpoint);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Quran API</h1>

      <Tabs defaultValue="tryItOut" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="tryItOut">Try It Out</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="tryItOut">
          <Card>
            <CardHeader>
              <CardTitle>Try the Quran API</CardTitle>
              <CardDescription>
                Select an endpoint and fill in the required fields to test the
                API
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
                    <SelectItem value="surah">Get Surah</SelectItem>
                    <SelectItem value="ayah">Get Ayah</SelectItem>
                    <SelectItem value="audio">Get Audio</SelectItem>
                    <SelectItem value="para">Get Para</SelectItem>
                    <SelectItem value="surahPage">Get Surah Page</SelectItem>
                  </SelectContent>
                </Select>

                {(activeEndpoint === "surah" ||
                  activeEndpoint === "ayah" ||
                  activeEndpoint === "audio" ||
                  activeEndpoint === "surahPage") && (
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

                {(activeEndpoint === "ayah" || activeEndpoint === "audio") && (
                  <Input
                    type="number"
                    placeholder="Ayah Number"
                    value={ayahNumber}
                    onChange={(e) => setAyahNumber(e.target.value)}
                    min="1"
                    required
                  />
                )}

                {activeEndpoint === "audio" && (
                  <Select onValueChange={setReciter} defaultValue={reciter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reciter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alafasy_64kbps">Alafasy</SelectItem>
                      <SelectItem value="Minshawy_Murattal_128kbps">
                        Minshawy Murattal
                      </SelectItem>
                      <SelectItem value="Abdul_Basit_Mujawwad_128kbps">
                        Abdul Basit Mujawwad
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {(activeEndpoint === "para" ||
                  activeEndpoint === "surahPage") && (
                  <Input
                    type="number"
                    placeholder="Page Number"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    min="1"
                    required
                  />
                )}

                {activeEndpoint === "para" && (
                  <Input
                    type="number"
                    placeholder="Para Number"
                    value={paraNumber}
                    onChange={(e) => setParaNumber(e.target.value)}
                    min="1"
                    required
                  />
                )}

                {activeEndpoint === "ayah" && (
                  <Select onValueChange={setLanguage} defaultValue={language}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eng">English</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
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
                      <strong>Example Request:</strong> {card.exampleRequest}
                    </p>
                    <div>
                      <strong>Sample Response:</strong>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2">
                        {typeof card.sampleResponse === "string" ? card.sampleResponse : JSON.stringify(card.sampleResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
