export default function Footer() {
  return (
    <footer className="bg-green-600 py-4 text-white">
      <div className="container mx-auto px-4 text-center md:px-6">
        <p>&copy; {new Date().getFullYear()} API Documentation. All rights reserved.</p>
      </div>
    </footer>
  )
}

