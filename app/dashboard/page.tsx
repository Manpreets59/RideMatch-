"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Search,
  Plus,
  Clock,
  DollarSign,
  Users,
  Star,
  Navigation,
  Calendar,
  MessageCircle,
  Bell,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface Ride {
  id: number
  driver: string
  avatar?: string
  rating: number
  from: string
  to: string
  time: string
  date: string
  price: string
  seats: number
  distance: string
  description?: string
  status: 'available' | 'requested' | 'completed'
}

interface UserStats {
  ridesTaken: number
  ridesOffered: number
  moneySaved: number
  co2Saved: number
}

interface SearchFilters {
  from: string
  to: string
  date: string
  time: string
}

interface OfferRideForm {
  from: string
  to: string
  date: string
  time: string
  seats: number
  price: number
  description: string
}

export default function DashboardPage() {
  // State management
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    from: "",
    to: "",
    date: "",
    time: ""
  })
  
  const [offerForm, setOfferForm] = useState<OfferRideForm>({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1,
    price: 0,
    description: ""
  })

  const [rides, setRides] = useState<Ride[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    ridesTaken: 12,
    ridesOffered: 8,
    moneySaved: 156,
    co2Saved: 45
  })
  
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [requestedRides, setRequestedRides] = useState<Set<number>>(new Set())

  // Initialize with mock data
  useEffect(() => {
    const mockRides: Ride[] = [
      {
        id: 1,
        driver: "Sarah Johnson",
        rating: 4.9,
        from: "Downtown Seattle",
        to: "Bellevue Tech Center",
        time: "8:00 AM",
        date: getCurrentDate(),
        price: "$8",
        seats: 3,
        distance: "12 miles",
        description: "Regular commute, non-smoking car",
        status: 'available'
      },
      {
        id: 2,
        driver: "Mike Chen",
        rating: 4.8,
        from: "Capitol Hill",
        to: "University of Washington",
        time: "9:15 AM",
        date: getTomorrowDate(),
        price: "Free",
        seats: 2,
        distance: "8 miles",
        description: "Going to campus, students welcome",
        status: 'available'
      },
      {
        id: 3,
        driver: "Emma Davis",
        rating: 5.0,
        from: "Fremont",
        to: "Amazon HQ",
        time: "7:45 AM",
        date: getCurrentDate(),
        price: "$6",
        seats: 1,
        distance: "15 miles",
        description: "Early bird special, coffee provided!",
        status: 'available'
      },
    ]
    setRides(mockRides)
  }, [])

  // Helper functions
  function getCurrentDate() {
    return new Date().toISOString().split('T')[0]
  }

  function getTomorrowDate() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('')
  }

  function showAlert(type: 'success' | 'error', message: string) {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  // Filter rides based on search criteria
  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      const matchesFrom = !searchFilters.from || 
        ride.from.toLowerCase().includes(searchFilters.from.toLowerCase())
      const matchesTo = !searchFilters.to || 
        ride.to.toLowerCase().includes(searchFilters.to.toLowerCase())
      const matchesDate = !searchFilters.date || ride.date === searchFilters.date
      
      return matchesFrom && matchesTo && matchesDate && ride.status === 'available'
    })
  }, [rides, searchFilters])

  // Handle search
  const handleSearch = async () => {
    if (!searchFilters.from && !searchFilters.to) {
      showAlert('error', 'Please enter at least a pickup or destination location')
      return
    }

    setIsSearching(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSearching(false)
    showAlert('success', `Found ${filteredRides.length} rides matching your criteria`)
  }

  // Handle ride request
  const handleRequestRide = async (rideId: number) => {
    if (requestedRides.has(rideId)) {
      showAlert('error', 'You have already requested this ride')
      return
    }

    setRequestedRides(prev => new Set([...prev, rideId]))
    
    // Update ride status
    setRides(prev => prev.map(ride => 
      ride.id === rideId 
        ? { ...ride, seats: ride.seats - 1, status: ride.seats === 1 ? 'requested' : 'available' }
        : ride
    ))

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      ridesTaken: prev.ridesTaken + 1
    }))

    showAlert('success', 'Ride request sent! The driver will be notified.')
  }

  // Handle offer ride form submission
  const handleOfferRide = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!offerForm.from || !offerForm.to || !offerForm.date || !offerForm.time) {
      showAlert('error', 'Please fill in all required fields')
      return
    }

    if (offerForm.seats < 1 || offerForm.seats > 7) {
      showAlert('error', 'Please enter a valid number of seats (1-7)')
      return
    }

    if (offerForm.price < 0) {
      showAlert('error', 'Price cannot be negative')
      return
    }

    setIsSubmittingOffer(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add new ride to list
    const newRide: Ride = {
      id: Date.now(),
      driver: "You",
      rating: 5.0,
      from: offerForm.from,
      to: offerForm.to,
      time: offerForm.time,
      date: offerForm.date,
      price: offerForm.price === 0 ? "Free" : `$${offerForm.price}`,
      seats: offerForm.seats,
      distance: "Calculating...",
      description: offerForm.description,
      status: 'available'
    }

    setRides(prev => [newRide, ...prev])

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      ridesOffered: prev.ridesOffered + 1
    }))

    // Reset form
    setOfferForm({
      from: "",
      to: "",
      date: "",
      time: "",
      seats: 1,
      price: 0,
      description: ""
    })

    setIsSubmittingOffer(false)
    showAlert('success', 'Your ride has been posted successfully!')
  }

  // Handle search filter changes
  const updateSearchFilter = (field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }))
  }

  // Handle offer form changes
  const updateOfferForm = (field: keyof OfferRideForm, value: string | number) => {
    setOfferForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RideMatch</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Alert */}
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {alert.type === 'success' ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Ride</h1>
              <p className="text-gray-600">Discover rides along your route or offer one to help others.</p>
            </div>

            <Tabs defaultValue="find" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="find" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Find Rides</span>
                </TabsTrigger>
                <TabsTrigger value="offer" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Offer Ride</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="find">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>Where are you going?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from">From</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="from"
                            placeholder="Enter pickup location"
                            className="pl-10"
                            value={searchFilters.from}
                            onChange={(e) => updateSearchFilter('from', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to">To</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="to"
                            placeholder="Enter destination"
                            className="pl-10"
                            value={searchFilters.to}
                            onChange={(e) => updateSearchFilter('to', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="date" 
                              type="date" 
                              className="pl-10"
                              value={searchFilters.date}
                              onChange={(e) => updateSearchFilter('date', e.target.value)}
                              min={getCurrentDate()}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="time" 
                              type="time" 
                              className="pl-10"
                              value={searchFilters.time}
                              onChange={(e) => updateSearchFilter('time', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      >
                        {isSearching ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4 mr-2" />
                        )}
                        {isSearching ? 'Searching...' : 'Search Rides'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Rides */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Rides ({filteredRides.length})
                  </h2>
                  
                  {filteredRides.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500">No rides found matching your criteria. Try adjusting your search.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredRides.map((ride) => (
                      <Card key={ride.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-green-100">
                                  {getInitials(ride.driver)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900">{ride.driver}</h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-gray-600">{ride.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">{ride.price}</div>
                              <div className="text-sm text-gray-500">{ride.distance}</div>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{ride.from} → {ride.to}</span>
                            </div>
                            
                            {ride.description && (
                              <p className="text-sm text-gray-600 italic">{ride.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{ride.time} • {ride.date === getCurrentDate() ? 'Today' : ride.date === getTomorrowDate() ? 'Tomorrow' : ride.date}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{ride.seats} seats left</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleRequestRide(ride.id)}
                                disabled={requestedRides.has(ride.id) || ride.seats === 0}
                                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
                              >
                                {requestedRides.has(ride.id) ? 'Requested' : 
                                 ride.seats === 0 ? 'Full' : 'Request Ride'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="offer">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Offer a Ride</span>
                    </CardTitle>
                    <CardDescription>
                      Share your journey and help others while earning some extra money.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOfferRide} className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="offer-from">From *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="offer-from" 
                            placeholder="Enter starting location" 
                            className="pl-10"
                            value={offerForm.from}
                            onChange={(e) => updateOfferForm('from', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="offer-to">To *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="offer-to" 
                            placeholder="Enter destination" 
                            className="pl-10"
                            value={offerForm.to}
                            onChange={(e) => updateOfferForm('to', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="offer-date">Date *</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="offer-date" 
                              type="date" 
                              className="pl-10"
                              value={offerForm.date}
                              onChange={(e) => updateOfferForm('date', e.target.value)}
                              min={getCurrentDate()}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offer-time">Time *</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="offer-time" 
                              type="time" 
                              className="pl-10"
                              value={offerForm.time}
                              onChange={(e) => updateOfferForm('time', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seats">Available Seats *</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="seats" 
                              type="number" 
                              min="1" 
                              max="7" 
                              className="pl-10"
                              value={offerForm.seats}
                              onChange={(e) => updateOfferForm('seats', parseInt(e.target.value) || 1)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price per Person ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="price" 
                              type="number" 
                              min="0" 
                              step="0.50" 
                              className="pl-10"
                              value={offerForm.price}
                              onChange={(e) => updateOfferForm('price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Add any additional details about your ride..."
                          value={offerForm.description}
                          onChange={(e) => updateOfferForm('description', e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        disabled={isSubmittingOffer}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      >
                        {isSubmittingOffer ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        {isSubmittingOffer ? 'Publishing...' : 'Offer Ride'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rides Taken</span>
                    <Badge variant="secondary">{userStats.ridesTaken}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rides Offered</span>
                    <Badge variant="secondary">{userStats.ridesOffered}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Money Saved</span>
                    <Badge className="bg-green-100 text-green-800">${userStats.moneySaved}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CO₂ Saved</span>
                    <Badge className="bg-blue-100 text-blue-800">{userStats.co2Saved} lbs</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ride completed</p>
                      <p className="text-xs text-gray-500">Downtown to Airport • 2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New ride request</p>
                      <p className="text-xs text-gray-500">Capitol Hill to UW • 4h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ride offered</p>
                      <p className="text-xs text-gray-500">Bellevue to Seattle • 1d ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Star className="w-4 h-4 mr-2" />
                    Rate Riders
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}