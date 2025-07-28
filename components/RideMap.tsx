"use client"

import { useEffect, useRef, useState } from "react"
import { useMap, useMapsLibrary } from "@googlemaps/react-wrapper"
import { MapPin, Car, Users, Clock } from "lucide-react"

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
  const map = useMap()
  const geometry = useMapsLibrary("geometry")
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [selectedRide, setSelectedRide] = useState<any>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const directionsServiceRef = useRef<google.maps.DirectionsService>()
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer>()

  // Initialize map
  useEffect(() => {
    if (!map) return

    // Set initial center (San Francisco)
    map.setCenter({ lat: 37.7749, lng: -122.4194 })
    map.setZoom(13)

    // Initialize services
    directionsServiceRef.current = new google.maps.DirectionsService()
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
    })

    // Generate sample data
    generateSampleData()
  }, [map])

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
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add driver markers
    drivers.forEach(driver => {
      const marker = new google.maps.Marker({
        position: driver.position,
        map,
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
        showDriverInfo(driver)
      })

      markersRef.current.push(marker)
    })

    // Add passenger markers
    passengers.forEach(passenger => {
      const marker = new google.maps.Marker({
        position: passenger.position,
        map,
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
        showPassengerInfo(passenger)
      })

      markersRef.current.push(marker)
    })
  }

  const showDriverInfo = (driver: Driver) => {
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

    const marker = markersRef.current.find(m => m.getTitle()?.includes(driver.name))
    if (marker) {
      infoWindow.open(map, marker)
    }
  }

  const showPassengerInfo = (passenger: Passenger) => {
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

    const marker = markersRef.current.find(m => m.getTitle()?.includes(passenger.name))
    if (marker) {
      infoWindow.open(map, marker)
    }
  }

  const calculateRoute = (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result)
        }
      }
    )
  }

  return (
    <div className="map-container">
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