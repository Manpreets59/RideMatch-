"use client"

import { useEffect, useRef, useState } from "react"
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

// Define the Google Maps types to avoid TypeScript errors
declare global {
  interface Window {
    google: {
      maps: {
        Point: any
        Map: any
        Marker: any
        InfoWindow: any
        DirectionsService: any
        DirectionsRenderer: any
        Size: any
        TravelMode: any
        event: any
      }
    }
  }
}

const RideMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)
  const directionsServiceRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return
    
    if (!window.google?.maps) {
      setLoading(true)
      const interval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(interval)
          initializeMap()
        }
      }, 200)
      return () => clearInterval(interval)
    } else {
      initializeMap()
    }
  }, [mapRef, map])

  const initializeMap = () => {
    if (!mapRef.current) return
    
    setLoading(false)
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 13,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    setMap(googleMap)
    
    directionsServiceRef.current = new window.google.maps.DirectionsService()
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: googleMap,
      suppressMarkers: true,
    })
    
    generateSampleData(googleMap)
    
    // Responsive map
    const handleResize = () => window.google.maps.event.trigger(googleMap, "resize")
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }

  // Regenerate markers when data changes
  useEffect(() => {
    if (map) addMarkersToMap(drivers, passengers, map)
  }, [drivers, passengers, map])

  const generateSampleData = (googleMap?: any) => {
    const sampleDrivers: Driver[] = [
      {
        id: "driver-1",
        name: "John Doe",
        position: { lat: 37.7849, lng: -122.4094 },
        rating: 4.8,
        vehicle: "Toyota Camry",
        available: true,
      },
      {
        id: "driver-2",
        name: "Sarah Smith",
        position: { lat: 37.7649, lng: -122.4294 },
        rating: 4.9,
        vehicle: "Honda Civic",
        available: true,
      },
      {
        id: "driver-3",
        name: "Mike Johnson",
        position: { lat: 37.7749, lng: -122.4394 },
        rating: 4.7,
        vehicle: "Tesla Model 3",
        available: false,
      },
    ]

    const samplePassengers: Passenger[] = [
      {
        id: "passenger-1",
        name: "Alice Brown",
        position: { lat: 37.7749, lng: -122.4194 },
        destination: { lat: 37.7849, lng: -122.4094 },
        status: "waiting",
      },
      {
        id: "passenger-2",
        name: "Bob Wilson",
        position: { lat: 37.7649, lng: -122.4294 },
        destination: { lat: 37.7549, lng: -122.4394 },
        status: "matched",
      },
    ]

    setDrivers(sampleDrivers)
    setPassengers(samplePassengers)
    addMarkersToMap(sampleDrivers, samplePassengers, googleMap || map)
  }

  const addMarkersToMap = (drivers: Driver[], passengers: Passenger[], mapInstance: any) => {
    if (!mapInstance || !window.google?.maps) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add driver markers
    drivers.forEach(driver => {
      const marker = new window.google.maps.Marker({
        position: driver.position,
        map: mapInstance,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${selectedId === driver.id ? "#1d4ed8" : (driver.available ? "#3b82f6" : "#6b7280")}" stroke="white" stroke-width="3"/>
              <path d="M12 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16),
        },
        title: `${driver.name} - ${driver.vehicle}`,
        zIndex: selectedId === driver.id ? 100 : (driver.available ? 50 : 10),
      })

      marker.addListener("click", () => {
        setSelectedId(driver.id)
        showDriverInfo(driver, marker)
      })

      markersRef.current.push(marker)
    })

    // Add passenger markers
    passengers.forEach(passenger => {
      const marker = new window.google.maps.Marker({
        position: passenger.position,
        map: mapInstance,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${selectedId === passenger.id ? "#047857" : "#10b981"}" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="12" r="4" fill="white"/>
              <path d="M10 24c0-4 2.5-6 6-6s6 2 6 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16),
        },
        title: `${passenger.name} - ${passenger.status}`,
        zIndex: selectedId === passenger.id ? 100 : 25,
      })

      marker.addListener("click", () => {
        setSelectedId(passenger.id)
        showPassengerInfo(passenger, marker)
      })

      markersRef.current.push(marker)
    })
  }

  const showDriverInfo = (driver: Driver, marker: any) => {
    // Close previous info window
    if (infoWindowRef.current) infoWindowRef.current.close()
    
    const statusColor = driver.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    const statusText = driver.available ? 'Available' : 'Busy'
    
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-4 max-w-sm">
          <h3 class="font-semibold text-lg text-gray-900">${driver.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${driver.vehicle}</p>
          <div class="flex items-center mb-3">
            <span class="text-yellow-500 mr-1">★</span>
            <span class="text-sm font-medium">${driver.rating}</span>
            <span class="ml-2 px-2 py-1 text-xs rounded-full ${statusColor}">
              ${statusText}
            </span>
          </div>
          ${driver.available ? `
            <button class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Request Ride
            </button>
          ` : ''}
        </div>
      `,
    })
    
    infoWindowRef.current = infoWindow
    if (marker && map) {
      infoWindow.open(map, marker)
    }
  }

  const showPassengerInfo = (passenger: Passenger, marker: any) => {
    // Close previous info window
    if (infoWindowRef.current) infoWindowRef.current.close()
    
    const statusColor = passenger.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
                       passenger.status === 'matched' ? 'bg-blue-100 text-blue-800' : 
                       'bg-green-100 text-green-800'
    
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-4 max-w-sm">
          <h3 class="font-semibold text-lg text-gray-900">${passenger.name}</h3>
          <div class="mb-3">
            <span class="px-2 py-1 text-xs rounded-full ${statusColor}">
              ${passenger.status}
            </span>
          </div>
          <button class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Match Ride
          </button>
        </div>
      `,
    })
    
    infoWindowRef.current = infoWindow
    if (marker && map) {
      infoWindow.open(map, marker)
    }
  }

  const calculateRoute = (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current || !window.google?.maps) return

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result)
        } else {
          console.error('Directions request failed due to ' + status)
        }
      }
    )
  }

  const showAllDrivers = () => {
    setSelectedId(null)
    if (infoWindowRef.current) infoWindowRef.current.close()
  }

  const showAllPassengers = () => {
    setSelectedId(null)
    if (infoWindowRef.current) infoWindowRef.current.close()
  }

  const showNearbyRides = () => {
    // Example: Calculate route between first passenger and destination
    if (passengers.length > 0) {
      const passenger = passengers[0]
      calculateRoute(passenger.position, passenger.destination)
    }
  }

  return (
    <div className="map-container" style={{ width: "100%", height: "100%", position: "relative", minHeight: 400 }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 text-sm">Loading map...</span>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg overflow-hidden shadow-lg"
      />
      
      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <button
          onClick={showNearbyRides}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors group"
          title="Show nearby rides"
        >
          <Car className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
        </button>
        <button
          onClick={showAllDrivers}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors group"
          title="Show all drivers"
        >
          <Users className="w-5 h-5 text-green-600 group-hover:text-green-700" />
        </button>
        <button
          onClick={showAllPassengers}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors group"
          title="Show real-time updates"
        >
          <Clock className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
        </button>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">{drivers.filter(d => d.available).length} Available Drivers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">{passengers.length} Passengers Waiting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="font-medium">{drivers.filter(d => !d.available).length} Busy Drivers</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <div className="text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <span>Available Drivers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            <span>Passengers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
            <span>Busy Drivers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RideMap