import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold">
            Home
          </Link>
          <Link href="/login" passHref>
            <Button variant="secondary">Login</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-primary mb-6">Quran API Documentation</h1>
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">📚 Endpoints</h2>
          <p className="mb-4">Login to get your API key. The API key will be sent to your email.</p>

          <div className="bg-card text-card-foreground border rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-xl font-semibold text-primary mb-3">1. Get All Surahs</h3>
            <p className="mb-2">
              <strong>Endpoint:</strong> <code className="bg-muted px-2 py-1 rounded">GET /surah</code>
            </p>
            <p className="mb-2">
              <strong>Headers:</strong>
            </p>
            <pre className="bg-muted p-3 rounded overflow-x-auto mb-2">
              <code>x-api-key : YOUR_API_KEY</code>
            </pre>
            <p className="mb-2">
              <strong>Example Request:</strong>
            </p>
            <pre className="bg-muted p-3 rounded overflow-x-auto mb-2">
              <code>GET /surah</code>
            </pre>
            <p className="mb-2">
              <strong>Sample Response:</strong>
            </p>
            <pre className="bg-muted p-3 rounded overflow-x-auto">
              <code>{`[
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
]`}</code>
            </pre>
          </div>

          {/* Add more endpoint documentation here */}
          {/* For brevity, I'm not including all endpoints, but in a real implementation, you would include them all */}
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground text-center py-4 mt-8">
        <p>&copy; 2023 Quran API. All rights reserved.</p>
      </footer>
    </div>
  )
}

