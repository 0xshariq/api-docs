"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"

export default function QuranAPI() {
  const [surahNumber, setSurahNumber] = useState("")
  const [ayahNumber, setAyahNumber] = useState("")
  const [paraNumber, setParaNumber] = useState("")
  const [pageNumber, setPageNumber] = useState("")
  const [reciter, setReciter] = useState("Alafasy_64kbps")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchData = async (endpoint: string) => {
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await axios.get(`https://quran-api-ny11.onrender.com/api/v2/quran/${endpoint}?key=${process.env.NEXT_PUBLIC_QURAN_API_KEY}`)
      setResult(response.data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("An error occurred while fetching data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurahSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (surahNumber) fetchData(`surah/${surahNumber}`)
  }

  const handleAyahSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (surahNumber && ayahNumber) fetchData(`ayah/${surahNumber}:${ayahNumber}`)
  }

  const handleAudioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (surahNumber && ayahNumber) fetchData(`ayah/${surahNumber}:${ayahNumber}/${reciter}`)
  }

  const handleParaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (paraNumber && pageNumber) fetchData(`para/${paraNumber}:${pageNumber}`)
  }

  const handleSurahPageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (surahNumber && pageNumber) fetchData(`surah/${surahNumber}:${pageNumber}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Quran API</h1>

      <Tabs defaultValue="surah" className="mb-6">
        <TabsList>
          <TabsTrigger value="surah">Surah</TabsTrigger>
          <TabsTrigger value="ayah">Ayah</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="para">Para</TabsTrigger>
          <TabsTrigger value="surahPage">Surah Page</TabsTrigger>
        </TabsList>

        <TabsContent value="surah">
          <Card>
            <CardHeader>
              <CardTitle>Get Surah</CardTitle>
              <CardDescription>Fetch a specific Surah by its number</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSurahSubmit} className="space-y-4">
                <Input type="number" placeholder="Surah Number (1-114)" value={surahNumber} onChange={(e) => setSurahNumber(e.target.value)} min="1" max="114" required />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Get Surah"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ayah">
          <Card>
            <CardHeader>
              <CardTitle>Get Ayah</CardTitle>
              <CardDescription>Fetch a specific Ayah by Surah and Ayah number</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAyahSubmit} className="space-y-4">
                <Input type="number" placeholder="Surah Number (1-114)" value={surahNumber} onChange={(e) => setSurahNumber(e.target.value)} min="1" max="114" required />
                <Input type="number" placeholder="Ayah Number" value={ayahNumber} onChange={(e) => setAyahNumber(e.target.value)} min="1" required />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Get Ayah"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Get Audio</CardTitle>
              <CardDescription>Fetch audio recitation for a specific Ayah</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAudioSubmit} className="space-y-4">
                <Input type="number" placeholder="Surah Number (1-114)" value={surahNumber} onChange={(e) => setSurahNumber(e.target.value)} min="1" max="114" required />
                <Input type="number" placeholder="Ayah Number" value={ayahNumber} onChange={(e) => setAyahNumber(e.target.value)} min="1" required />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Get Audio"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="para">
          <Card>
            <CardHeader>
              <CardTitle>Get Para</CardTitle>
              <CardDescription>Fetch a specific Para page</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleParaSubmit} className="space-y-4">
                <Input type="number" placeholder="Para Number" value={paraNumber} onChange={(e) => setParaNumber(e.target.value)} min="1" required />
                <Input type="number" placeholder="Page Number" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} min="1" required />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Get Para"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surahPage">
          <Card>
            <CardHeader>
              <CardTitle>Get Surah Page</CardTitle>
              <CardDescription>Fetch a specific Surah page</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSurahPageSubmit} className="space-y-4">
                <Input type="number" placeholder="Surah Number (1-114)" value={surahNumber} onChange={(e) => setSurahNumber(e.target.value)} min="1" max="114" required />
                <Input type="number" placeholder="Page Number" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} min="1" required />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Get Surah Page"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
const endpointCards = [
  {
    title: '1. Get All Surahs',
    endpoint: 'GET /surah',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /surah',
    sampleResponse: `[
  {
    "number": 1,
    "name": "الفاتحة",
    "englishName": "Al-Fatiha",
    "englishNameTranslation": "The Opening",
    "numberOfAyahs": 7,
    "revelationType": "Meccan"
  },
  {
    "number": 2,
    "name": "البقرة",
    "englishName": "Al-Baqarah",
    "englishNameTranslation": "The Cow",
    "numberOfAyahs": 286,
    "revelationType": "Medinan"
  },
  ...
]`,
  },
  {
    title: '2. Get Surah by Number',
    endpoint: 'GET /surah/:surahNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /surah/1',
    sampleResponse: `{
  "number": 1,
  "name": "الفاتحة",
  "englishName": "Al-Fatiha",
  "englishNameTranslation": "The Opening",
  "numberOfAyahs": 7,
  "revelationType": "Meccan"
}`,
  },
  {
    title: '3. Get Ayah by Surah Number and Verse Number',
    endpoint: 'GET /surahNumber:verseNumber&lang=eng',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /1:1',
    sampleResponse: `
    for english language (eng) :
    {
  "number": 1,
  "text": "In the name of Allah, the Most Gracious, the Most Merciful."
},
  for arabic language (arabic) :{
    "number": 1,
  "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
}
  for urdu language (urdu) :{
   "number": 1,
  "text": "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے"
  }`,
  },
  {
    title: '4. Get Audio',
    endpoint: 'GET /audio/:reciter/surahNumber:verseNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /audio/Alafasy_64kbps/1:1',
    sampleResponse: `Audio file (MP3 format)`,
  },
  {
    title: '5. Get Reciters',
    endpoint: 'GET /reciters',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /reciters',
    sampleResponse: `[
  {
    "name": "Alafasy",
    "subfolder": "Alafasy_64kbps"
  },
  {
    "name": "Minshawy Murattal",
    "subfolder": "Minshawy_Murattal_128kbps"
  },
  ...
]`,
  },
  {
    title: '6. Get Para Images',
    endpoint: 'GET /para/paraNumber:pageNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /para/1:5',
    sampleResponse: `Image file (PNG format)`,
  },
  {
    title: '7. Get Surah Images',
    endpoint: 'GET /surah/surahNumber:pageNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /surah/2:30',
    sampleResponse: `Image file (PNG format)`,
  },
  {
    title: '8. Get All Verses in JSON Format',
    endpoint: 'GET /',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /',
    sampleResponse: `Complete Quran JSON structure with all verses`,
  },
];