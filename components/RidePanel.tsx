"use client"

import { useState } from "react"
import { Car, MapPin, Star, Clock, Users, Settings, Bell } from "lucide-react"

interface Ride {
  id: string
  driver: {
    name: string
    rating: number
    vehicle: string
    eta: string
  }
  passenger: {
    name: string
    pickup: string
    destination: string
  }
  status: "searching" | "matched" | "in-progress" | "completed"
  price: number
}

export function RidePanel() {
  const [activeTab, setActiveTab] = useState<"search" | "rides" | "profile">("search")
  const [isSearching, setIsSearching] = useState(false)
  const [currentRide, setCurrentRide] = useState<Ride | null>(null)
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [error, setError] = useState("")
  const [profile, setProfile] = useState({ name: "John Smith", email: "john.smith@email.com" })
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileDraft, setProfileDraft] = useState(profile)

  const sampleRides: Ride[] = [
    {
      id: "1",
      driver: {
        name: "John Doe",
        rating: 4.8,
        vehicle: "Toyota Camry",
        eta: "3 min",
      },
      passenger: {
        name: "Alice Brown",
        pickup: "123 Main St, San Francisco",
        destination: "456 Market St, San Francisco",
      },
      status: "matched",
      price: 12.50,
    },
    {
      id: "2",
      driver: {
        name: "Sarah Smith",
        rating: 4.9,
        vehicle: "Honda Civic",
        eta: "5 min",
      },
      passenger: {
        name: "Bob Wilson",
        pickup: "789 Mission St, San Francisco",
        destination: "321 Castro St, San Francisco",
      },
      status: "searching",
      price: 15.75,
    },
  ]

  const handleSearchRide = () => {
    setError("")
    if (!pickup.trim() || !destination.trim()) {
      setError("Please enter both pickup and destination.")
      return
    }
    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      setIsSearching(false)
      setCurrentRide(sampleRides[0])
    }, 2000)
  }

  const handleAcceptRide = () => {
    setCurrentRide(null)
    setPickup("")
    setDestination("")
  }

  const handleProfileSave = () => {
    setProfile(profileDraft)
    setEditingProfile(false)
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">RideMatch</h1>
        <p className="text-sm text-gray-600 mt-1">Smart ride sharing with Google Maps</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "search"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Car className="w-4 h-4 inline mr-2" />
          Find Ride
        </button>
        <button
          onClick={() => setActiveTab("rides")}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "rides"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          My Rides
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "profile"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Profile
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "search" && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="pickup">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="pickup"
                    type="text"
                    placeholder="Enter pickup address"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Pickup Location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="destination">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="destination"
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Destination"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button
                onClick={handleSearchRide}
                disabled={isSearching}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-busy={isSearching}
              >
                {isSearching && (
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                )}
                {isSearching ? "Searching..." : "Find Available Drivers"}
              </button>
            </div>

            {/* Current Ride Status */}
            {currentRide && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Matched Driver</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Driver:</span>
                    <span className="text-sm font-medium">{currentRide.driver.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Vehicle:</span>
                    <span className="text-sm">{currentRide.driver.vehicle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">ETA:</span>
                    <span className="text-sm font-medium">{currentRide.driver.eta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Price:</span>
                    <span className="text-sm font-medium">${currentRide.price}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{currentRide.driver.rating}</span>
                  </div>
                </div>
                <button
                  className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  onClick={handleAcceptRide}
                  aria-label="Accept Ride"
                >
                  Accept Ride
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "rides" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Rides</h3>
            <div className="space-y-4">
              {sampleRides.map((ride) => (
                <div key={ride.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{ride.driver.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ride.status === "matched" ? "bg-green-100 text-green-800" :
                      ride.status === "searching" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {ride.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>From: {ride.passenger.pickup}</div>
                    <div>To: {ride.passenger.destination}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span>${ride.price}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{ride.driver.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  {editingProfile ? (
                    <>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded px-2 py-1 mb-1"
                        value={profileDraft.name}
                        onChange={e => setProfileDraft({ ...profileDraft, name: e.target.value })}
                        aria-label="Edit Name"
                      />
                      <input
                        type="email"
                        className="block w-full border border-gray-300 rounded px-2 py-1"
                        value={profileDraft.email}
                        onChange={e => setProfileDraft({ ...profileDraft, email: e.target.value })}
                        aria-label="Edit Email"
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium">{profile.name}</h4>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span>Notifications</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span>My Ratings</span>
                </button>
                {editingProfile ? (
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      onClick={handleProfileSave}
                    >
                      Save
                    </button>
                    <button
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                      onClick={() => { setEditingProfile(false); setProfileDraft(profile); }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100"
                    onClick={() => setEditingProfile(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}