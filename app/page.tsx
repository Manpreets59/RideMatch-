"use client"

import { useState, useEffect } from "react"
import { Wrapper } from "@googlemaps/react-wrapper"
import { RideMap } from "@/components/RideMap"
import { RidePanel } from "@/components/RidePanel"
import { Header } from "@/components/Header"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Welcome to RideMatch!",
        description: "Find nearby drivers and passengers for efficient ride sharing.",
      })
    }, 1000)
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold">Loading RideMatch...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <Header />
      <div className="flex h-full">
        <div className="flex-1 relative">
          <Wrapper
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            version="weekly"
            libraries={["places", "geometry"]}
          >
            <RideMap />
          </Wrapper>
        </div>
        <RidePanel />
      </div>
    </div>
  )
}