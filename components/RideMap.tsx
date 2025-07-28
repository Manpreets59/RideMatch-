"use client"

import { useEffect, useRef, useState } from "react"
import { Car, Users, Clock } from "lucide-react"

interface Driver {
  id: string
  name: string
  position: { lat: number; lng: number }
  rating: number
  vehicle: string
  available: boolean
}

interface Passenger {
  id: string
  name: string
  position: { lat: number; lng: number }
  destination: { lat: number; lng: number }
  status: "waiting" | "matched" | "in-ride"
}

export function RideMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [selectedRide, setSelectedRide] = useState<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Check if Google Maps API is available
    if (typeof google === 'undefined' || !google.maps) {
      setMapError("Google Maps API not loaded. Please check your API key.")
      return
    }

    try {
      // Initialize the map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      mapInstanceRef.current = map

      // Initialize services
      directionsServiceRef.current = new google.maps.DirectionsService()
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
      })

      // Generate sample data
      generateSampleData()
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Failed to initialize map. Please check your API key and internet connection.")
    }
  }, [])

  const generateSampleData = () => {
    const sampleDrivers: Driver[] = [
      {
        id: "1",
        name: "John Doe",
        position: { lat: 37.7849, lng: -122.4094 },
        rating: 4.8,
        vehicle: "Toyota Camry",
        available: true,
      },
      {
        id: "2",
        name: "Sarah Smith",
        position: { lat: 37.7649, lng: -122.4294 },
        rating: 4.9,
        vehicle: "Honda Civic",
        available: true,
      },
      {
        id: "3",
        name: "Mike Johnson",
        position: { lat: 37.7749, lng: -122.4394 },
        rating: 4.7,
        vehicle: "Tesla Model 3",
        available: false,
      },
    ]

    const samplePassengers: Passenger[] = [
      {
        id: "1",
        name: "Alice Brown",
        position: { lat: 37.7749, lng: -122.4194 },
        destination: { lat: 37.7849, lng: -122.4094 },
        status: "waiting",
      },
      {
        id: "2",
        name: "Bob Wilson",
        position: { lat: 37.7649, lng: -122.4294 },
        destination: { lat: 37.7549, lng: -122.4394 },
        status: "matched",
      },
    ]

    setDrivers(sampleDrivers)
    setPassengers(samplePassengers)
    addMarkersToMap(sampleDrivers, samplePassengers)
  }

  const addMarkersToMap = (drivers: Driver[], passengers: Passenger[]) => {
    if (!mapInstanceRef.current) return

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // Add driver markers
      drivers.forEach(driver => {
        const marker = new google.maps.Marker({
          position: driver.position,
          map: mapInstanceRef.current,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
                <path d="M8 12l2 2 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
          },
          title: `${driver.name} - ${driver.vehicle}`,
        })

        marker.addListener("click", () => {
          showDriverInfo(driver, marker)
        })

        markersRef.current.push(marker)
      })

      // Add passenger markers
      passengers.forEach(passenger => {
        const marker = new google.maps.Marker({
          position: passenger.position,
          map: mapInstanceRef.current,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
                <path d="M12 8v8M8 12h8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
          },
          title: `${passenger.name} - ${passenger.status}`,
        })

        marker.addListener("click", () => {
          showPassengerInfo(passenger, marker)
        })

        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error("Error adding markers:", error)
    }
  }

  const showDriverInfo = (driver: Driver, marker: google.maps.Marker) => {
    try {
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <h3 class="font-semibold text-lg">${driver.name}</h3>
            <p class="text-sm text-gray-600">${driver.vehicle}</p>
            <div class="flex items-center mt-2">
              <span class="text-yellow-500">★</span>
              <span class="ml-1 text-sm">${driver.rating}</span>
              <span class="ml-2 px-2 py-1 text-xs rounded-full ${driver.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${driver.available ? 'Available' : 'Busy'}
              </span>
            </div>
          </div>
        `,
      })

      infoWindow.open(mapInstanceRef.current, marker)
    } catch (error) {
      console.error("Error showing driver info:", error)
    }
  }

  const showPassengerInfo = (passenger: Passenger, marker: google.maps.Marker) => {
    try {
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <h3 class="font-semibold text-lg">${passenger.name}</h3>
            <p class="text-sm text-gray-600">Status: ${passenger.status}</p>
            <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Match Ride
            </button>
          </div>
        `,
      })

      infoWindow.open(mapInstanceRef.current, marker)
    } catch (error) {
      console.error("Error showing passenger info:", error)
    }
  }

  const calculateRoute = (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return

    try {
      directionsServiceRef.current.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
          if (status === "OK" && result) {
            directionsRendererRef.current?.setDirections(result)
          } else {
            console.error("Directions request failed:", status)
          }
        }
      )
    } catch (error) {
      console.error("Error calculating route:", error)
    }
  }

  // Show error state if map failed to load
  if (mapError) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Map Loading Error</h2>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <div className="text-sm text-gray-500">
            <p>To fix this issue:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Check your Google Maps API key in .env.local</li>
              <li>Ensure the API key has the necessary permissions</li>
              <li>Verify your internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="map-container">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <button
          onClick={() => calculateRoute(
            { lat: 37.7749, lng: -122.4194 },
            { lat: 37.7849, lng: -122.4094 }
          )}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
        >
          <Car className="w-5 h-5 text-blue-600" />
        </button>
        <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50">
          <Users className="w-5 h-5 text-green-600" />
        </button>
        <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50">
          <Clock className="w-5 h-5 text-orange-600" />
        </button>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <div className="text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{drivers.filter(d => d.available).length} Drivers Available</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{passengers.length} Passengers</span>
          </div>
        </div>
      </div>
    </div>
  )
}