"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Gem, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission logic here (e.g., send to an API)
    console.log({ name, email, message })
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    })
    setName("")
    setEmail("")
    setMessage("")
  }

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
              <Link href="/about" className="text-sm hover:text-blue-700 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-blue-700 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Contact Us</h1>
            <p className="text-gray-700 leading-relaxed mb-8 text-center">
              Have questions, feedback, or suggestions? We&apos;d love to hear from you!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="mt-1"
                    required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1"
                    required
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message
                </Label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    className="mt-1"
                    rows={5}
                    required
                />
              </div>
              <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
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
