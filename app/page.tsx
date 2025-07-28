"use client"

import { useState, useEffect } from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { RideMap } from "@/components/RideMap"
import { RidePanel } from "@/components/RidePanel"
import { Header } from "@/components/Header"
import { useToast } from "@/hooks/use-toast"

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold">Loading Google Maps...</h2>
          </div>
        </div>
      )
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Failed to load Google Maps</h2>
            <p className="text-gray-600 mt-2">Please check your API key and internet connection</p>
          </div>
        </div>
      )
    default:
      return <RideMap />
  }
}

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
            render={render}
          />
        </div>
        <RidePanel />
      </div>
    </div>
  )
}