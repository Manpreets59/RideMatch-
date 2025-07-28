import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RideMatch - Smart Ride Sharing with Google Maps",
  description: "Connect with nearby drivers and passengers for efficient ride sharing using Google Maps Platform",
  keywords: "ride sharing, carpooling, Google Maps, transportation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}