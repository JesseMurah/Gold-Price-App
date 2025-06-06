import Link from "next/link"
import { Gem } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col text-gray-800">
      <header className="py-4 px-6 md:px-10 shadow-sm bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-blue-700">
            <Gem className="w-7 h-7" />
            <span>Gold Price Calculator</span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="text-sm hover:text-blue-700 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-semibold text-blue-700 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm hover:text-blue-700 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">About Gold Price Calculator</h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            This Gold Price Calculator is designed to help users estimate the potential price and profit/loss for gold
            transactions based on various market factors.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">Our tool takes into account:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 pl-4">
            <li>World Market Spot Price</li>
            <li>Discounts applicable in specific markets (e.g. Dubai)</li>
            <li>Transportation costs</li>
            <li>Losses due to melting and karat variations</li>
            <li>Local market prices (e.g., Ghana)</li>
            <li>Currency exchange rates</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Please note that this calculator provides estimates based on the data you input. Actual prices and profits
            may vary due to market volatility and other unforeseen factors. Always consult with a financial advisor for
            professional advice.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We strive to provide a useful tool for individuals and businesses involved in gold trading. If you have any
            feedback or suggestions, please feel free to{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
      <footer className="py-6 text-center bg-white/50">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Gold Price Calculator. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
