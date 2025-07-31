"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
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
  LogOut,
  Filter,
  Zap,
  Leaf,
  TrendingUp,
  Car,
  Route,
  ArrowRight,
  X
} from "lucide-react"

// Enhanced interfaces with better typing
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
  duration: string
  description?: string
  status: 'available' | 'requested' | 'completed' | 'cancelled'
  vehicleType: 'sedan' | 'suv' | 'hatchback' | 'coupe'
  amenities: string[]
  instantBook: boolean
}

interface UserStats {
  ridesTaken: number
  ridesOffered: number
  moneySaved: number
  co2Saved: number
  rating: number
  totalDistance: number
}

interface SearchFilters {
  from: string
  to: string
  date: string
  time: string
  maxPrice: string
  instantBookOnly: boolean
  sortBy: 'price' | 'time' | 'rating' | 'distance'
}

interface OfferRideForm {
  from: string
  to: string
  date: string
  time: string
  seats: number
  price: number
  description: string
  vehicleType: 'sedan' | 'suv' | 'hatchback' | 'coupe'
  amenities: string[]
  instantBook: boolean
}

interface Notification {
  id: number
  type: 'request' | 'message' | 'rating' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

// Mock user profile for demo
const mockUserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  avatar: "",
  verified: true
}

export default function DashboardPage() {
  // Enhanced state management with better initial values
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    from: "",
    to: "",
    date: "",
    time: "",
    maxPrice: "",
    instantBookOnly: false,
    sortBy: 'time'
  })
  
  const [offerForm, setOfferForm] = useState<OfferRideForm>({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 2,
    price: 0,
    description: "",
    vehicleType: 'sedan',
    amenities: [],
    instantBook: false
  })

  const [rides, setRides] = useState<Ride[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    ridesTaken: 24,
    ridesOffered: 18,
    moneySaved: 312,
    co2Saved: 89,
    rating: 4.8,
    totalDistance: 1247
  })
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [requestedRides, setRequestedRides] = useState<Set<number>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("find")

  // Enhanced mock data with more realistic information
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
        price: "$12",
        seats: 3,
        distance: "12.4 miles",
        duration: "25 min",
        description: "Regular commute, non-smoking car, WiFi available",
        status: 'available',
        vehicleType: 'sedan',
        amenities: ['WiFi', 'AC', 'Music'],
        instantBook: true
      },
      {
        id: 2,
        driver: "Mike Chen",
        rating: 4.8,
        from: "Capitol Hill",
        to: "University of Washington",
        time: "9:15 AM",
        date: getTomorrowDate(),
        price: "$6",
        seats: 2,
        distance: "8.2 miles",
        duration: "18 min",
        description: "Going to campus, students welcome, eco-friendly hybrid",
        status: 'available',
        vehicleType: 'hatchback',
        amenities: ['Eco-Friendly', 'Music'],
        instantBook: false
      },
      {
        id: 3,
        driver: "Emma Davis",
        rating: 5.0,
        from: "Fremont",
        to: "Amazon HQ",
        time: "7:45 AM",
        date: getCurrentDate(),
        price: "$8",
        seats: 1,
        distance: "15.1 miles",
        duration: "32 min",
        description: "Early bird special, coffee and light snacks provided!",
        status: 'available',
        vehicleType: 'suv',
        amenities: ['Coffee', 'Snacks', 'AC', 'WiFi'],
        instantBook: true
      },
      {
        id: 4,
        driver: "Alex Rodriguez",
        rating: 4.7,
        from: "Ballard",
        to: "South Lake Union",
        time: "8:30 AM",
        date: getCurrentDate(),
        price: "$10",
        seats: 2,
        distance: "9.8 miles",
        duration: "22 min",
        description: "Luxury ride with premium sound system",
        status: 'available',
        vehicleType: 'coupe',
        amenities: ['Premium Audio', 'AC', 'Luxury'],
        instantBook: false
      }
    ]
    setRides(mockRides)

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'request',
        title: 'New ride request',
        message: 'Mike wants to join your ride to Downtown',
        time: '5 min ago',
        read: false
      },
      {
        id: 2,
        type: 'message',
        title: 'Message from Sarah',
        message: 'Thanks for the smooth ride yesterday!',
        time: '2 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'rating',
        title: 'New rating received',
        message: 'You received a 5-star rating from Emma',
        time: '1 day ago',
        read: true
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  // Helper functions
  const getCurrentDate = useCallback(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const getTomorrowDate = useCallback(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [])

  const getInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }, [])

  const formatDate = useCallback((dateString: string) => {
    const today = getCurrentDate()
    const tomorrow = getTomorrowDate()
    
    if (dateString === today) return 'Today'
    if (dateString === tomorrow) return 'Tomorrow'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }, [getCurrentDate, getTomorrowDate])

  const getPriceValue = useCallback((priceString: string) => {
    if (priceString === 'Free') return 0
    return parseFloat(priceString.replace('$', ''))
  }, [])

  // Enhanced filtering and sorting logic
  const filteredAndSortedRides = useMemo(() => {
    let filtered = rides.filter(ride => {
      const matchesFrom = !searchFilters.from || 
        ride.from.toLowerCase().includes(searchFilters.from.toLowerCase())
      const matchesTo = !searchFilters.to || 
        ride.to.toLowerCase().includes(searchFilters.to.toLowerCase())
      const matchesDate = !searchFilters.date || ride.date === searchFilters.date
      const matchesPrice = !searchFilters.maxPrice || 
        getPriceValue(ride.price) <= parseFloat(searchFilters.maxPrice)
      const matchesInstantBook = !searchFilters.instantBookOnly || ride.instantBook
      
      return matchesFrom && matchesTo && matchesDate && matchesPrice && 
             matchesInstantBook && ride.status === 'available'
    })

    // Sort rides based on selected criteria
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'price':
          return getPriceValue(a.price) - getPriceValue(b.price)
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'time':
        default:
          return a.time.localeCompare(b.time)
      }
    })

    return filtered
  }, [rides, searchFilters, getPriceValue])

  // Enhanced search with validation
  const handleSearch = useCallback(async () => {
    if (!searchFilters.from && !searchFilters.to) {
      alert('Please enter at least a pickup or destination location')
      return
    }

    setIsSearching(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    setIsSearching(false)
  }, [searchFilters])

  // Enhanced ride request with optimistic updates
  const handleRequestRide = useCallback(async (rideId: number) => {
    if (requestedRides.has(rideId)) {
      alert('You have already requested this ride')
      return
    }

    // Optimistic update
    setRequestedRides(prev => new Set([...prev, rideId]))
    setRides(prev => prev.map(ride => 
      ride.id === rideId 
        ? { ...ride, seats: ride.seats - 1 }
        : ride
    ))
    setUserStats(prev => ({ ...prev, ridesTaken: prev.ridesTaken + 1 }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      console.log('Ride requested successfully')
    } catch (error) {
      // Rollback optimistic update on error
      setRequestedRides(prev => {
        const newSet = new Set(prev)
        newSet.delete(rideId)
        return newSet
      })
      setRides(prev => prev.map(ride => 
        ride.id === rideId 
          ? { ...ride, seats: ride.seats + 1 }
          : ride
      ))
      setUserStats(prev => ({ ...prev, ridesTaken: prev.ridesTaken - 1 }))
      alert('Failed to request ride. Please try again.')
    }
  }, [requestedRides])

  // Enhanced form submission with better validation
  const handleOfferRide = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Enhanced validation
    const requiredFields = ['from', 'to', 'date', 'time']
    const missingFields = requiredFields.filter(field => !offerForm[field as keyof OfferRideForm])
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`)
      return
    }

    if (offerForm.seats < 1 || offerForm.seats > 7) {
      alert('Please enter a valid number of seats (1-7)')
      return
    }

    if (offerForm.price < 0) {
      alert('Price cannot be negative')
      return
    }

    // Check if date is not in the past
    if (offerForm.date < getCurrentDate()) {
      alert('Please select a future date')
      return
    }

    setIsSubmittingOffer(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800))

      const newRide: Ride = {
        id: Date.now(),
        driver: `${mockUserProfile.firstName} ${mockUserProfile.lastName}`,
        rating: userStats.rating,
        from: offerForm.from,
        to: offerForm.to,
        time: offerForm.time,
        date: offerForm.date,
        price: offerForm.price === 0 ? "Free" : `$${offerForm.price}`,
        seats: offerForm.seats,
        distance: "Calculating...",
        duration: "Calculating...",
        description: offerForm.description,
        status: 'available',
        vehicleType: offerForm.vehicleType,
        amenities: offerForm.amenities,
        instantBook: offerForm.instantBook
      }

      setRides(prev => [newRide, ...prev])
      setUserStats(prev => ({ ...prev, ridesOffered: prev.ridesOffered + 1 }))

      // Reset form
      setOfferForm({
        from: "",
        to: "",
        date: "",
        time: "",
        seats: 2,
        price: 0,
        description: "",
        vehicleType: 'sedan',
        amenities: [],
        instantBook: false
      })

      console.log('Ride posted successfully!')
    } catch (error) {
      alert('Failed to post ride. Please try again.')
    } finally {
      setIsSubmittingOffer(false)
    }
  }, [offerForm, getCurrentDate, userStats.rating])

  // Handle filter updates
  const updateSearchFilter = useCallback((field: keyof SearchFilters, value: string | boolean) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateOfferForm = useCallback((field: keyof OfferRideForm, value: string | number | boolean | string[]) => {
    setOfferForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchFilters({
      from: "",
      to: "",
      date: "",
      time: "",
      maxPrice: "",
      instantBookOnly: false,
      sortBy: 'time'
    })
  }, [])

  const getVehicleIcon = (type: string) => {
    return <Car className="w-4 h-4" />
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return '📶'
      case 'ac': return '❄️'
      case 'music': return '🎵'
      case 'coffee': return '☕'
      case 'snacks': return '🍪'
      case 'eco-friendly': return '🌱'
      case 'luxury': return '✨'
      case 'premium audio': return '🔊'
      default: return '•'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Route className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RideMatch</h1>
              <p className="text-xs text-gray-500">Smart Carpooling</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
            </div>
            
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 font-semibold">
                  {getInitials(`${mockUserProfile.firstName} ${mockUserProfile.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{mockUserProfile.firstName}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{userStats.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                Welcome back, {mockUserProfile.firstName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Ready to discover your next journey or help someone reach their destination?</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 p-1">
                <TabsTrigger value="find" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Search className="w-4 h-4" />
                  <span>Find Rides</span>
                </TabsTrigger>
                <TabsTrigger value="offer" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Plus className="w-4 h-4" />
                  <span>Offer Ride</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="find">
                {/* Enhanced Search Card */}
                <Card className="mb-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-5 h-5 text-blue-600" />
                        <span>Plan Your Journey</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-1"
                      >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main search fields */}
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from" className="text-sm font-medium">From</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            id="from"
                            placeholder="Enter pickup location"
                            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            value={searchFilters.from}
                            onChange={(e) => updateSearchFilter('from', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="to" className="text-sm font-medium">To</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                          <Input
                            id="to"
                            placeholder="Enter destination"
                            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            value={searchFilters.to}
                            onChange={(e) => updateSearchFilter('to', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="date" 
                              type="date" 
                              className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              value={searchFilters.date}
                              onChange={(e) => updateSearchFilter('date', e.target.value)}
                              min={getCurrentDate()}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              id="time" 
                              type="time" 
                              className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              value={searchFilters.time}
                              onChange={(e) => updateSearchFilter('time', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                      <div className="pt-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="maxPrice" className="text-sm font-medium">Max Price ($)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                id="maxPrice" 
                                type="number" 
                                placeholder="Any price"
                                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                value={searchFilters.maxPrice}
                                onChange={(e) => updateSearchFilter('maxPrice', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sortBy" className="text-sm font-medium">Sort by</Label>
                            <Select value={searchFilters.sortBy} onValueChange={(value: any) => updateSearchFilter('sortBy', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="time">Departure Time</SelectItem>
                                <SelectItem value="price">Price (Low to High)</SelectItem>
                                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                                <SelectItem value="distance">Distance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={searchFilters.instantBookOnly}
                              onChange={(e) => updateSearchFilter('instantBookOnly', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Instant book only</span>
                            <Zap className="w-4 h-4 text-yellow-500" />
                          </label>
                          
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-1" />
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      {isSearching ? 'Searching...' : 'Find Rides'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Enhanced Available Rides */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Available Rides ({filteredAndSortedRides.length})
                    </h2>
                    {filteredAndSortedRides.length > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {filteredAndSortedRides.filter(r => r.instantBook).length} instant book
                      </Badge>
                    )}
                  </div>
                  
                  {isSearching ? (
                    // Loading skeletons
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <div className="flex justify-between">
                              <Skeleton className="h-8 w-24" />
                              <Skeleton className="h-8 w-32" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : filteredAndSortedRides.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-50/50">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No rides found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    filteredAndSortedRides.map((ride) => (
                      <Card key={ride.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 font-semibold">
                                  {getInitials(ride.driver)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{ride.driver}</h3>
                                  {ride.instantBook && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Instant
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-gray-600 font-medium">{ride.rating}</span>
                                  </div>
                                  <span className="text-gray-300">•</span>
                                  <div className="flex items-center space-x-1">
                                    {getVehicleIcon(ride.vehicleType)}
                                    <span className="text-sm text-gray-600 capitalize">{ride.vehicleType}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                {ride.price}
                              </div>
                              <div className="text-sm text-gray-500">{ride.distance} • {ride.duration}</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                              <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">{ride.from}</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="font-medium">{ride.to}</span>
                              </div>
                            </div>
                            
                            {ride.description && (
                              <p className="text-sm text-gray-600 italic bg-blue-50/50 p-3 rounded-lg border-l-4 border-blue-200">
                                "{ride.description}"
                              </p>
                            )}
                            
                            {ride.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {ride.amenities.map((amenity, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                    <span className="mr-1">{getAmenityIcon(amenity)}</span>
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{ride.time} • {formatDate(ride.date)}</span>
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
                                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                {requestedRides.has(ride.id) ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Requested
                                  </>
                                ) : ride.seats === 0 ? (
                                  'Full'
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-1" />
                                    {ride.instantBook ? 'Book Now' : 'Request'}
                                  </>
                                )}
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
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      <span>Share Your Journey</span>
                    </CardTitle>
                    <CardDescription>
                      Post your ride and help others while earning extra money and reducing carbon footprint.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOfferRide} className="space-y-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="offer-from" className="text-sm font-medium">From *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                            <Input 
                              id="offer-from" 
                              placeholder="Enter starting location" 
                              className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              value={offerForm.from}
                              onChange={(e) => updateOfferForm('from', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="offer-to" className="text-sm font-medium">To *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                            <Input 
                              id="offer-to" 
                              placeholder="Enter destination" 
                              className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              value={offerForm.to}
                              onChange={(e) => updateOfferForm('to', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="offer-date" className="text-sm font-medium">Date *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                id="offer-date" 
                                type="date" 
                                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                value={offerForm.date}
                                onChange={(e) => updateOfferForm('date', e.target.value)}
                                min={getCurrentDate()}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="offer-time" className="text-sm font-medium">Time *</Label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                id="offer-time" 
                                type="time" 
                                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                value={offerForm.time}
                                onChange={(e) => updateOfferForm('time', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="seats" className="text-sm font-medium">Available Seats *</Label>
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                id="seats" 
                                type="number" 
                                min="1" 
                                max="7" 
                                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                value={offerForm.seats}
                                onChange={(e) => updateOfferForm('seats', parseInt(e.target.value) || 1)}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium">Price per Person ($)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                id="price" 
                                type="number" 
                                min="0" 
                                step="0.50" 
                                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                value={offerForm.price}
                                onChange={(e) => updateOfferForm('price', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vehicle-type" className="text-sm font-medium">Vehicle Type</Label>
                            <Select value={offerForm.vehicleType} onValueChange={(value: any) => updateOfferForm('vehicleType', value)}>
                              <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sedan">Sedan</SelectItem>
                                <SelectItem value="suv">SUV</SelectItem>
                                <SelectItem value="hatchback">Hatchback</SelectItem>
                                <SelectItem value="coupe">Coupe</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            placeholder="Share details about your ride, route preferences, or any special amenities..."
                            value={offerForm.description}
                            onChange={(e) => updateOfferForm('description', e.target.value)}
                            rows={3}
                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-lg">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={offerForm.instantBook}
                              onChange={(e) => updateOfferForm('instantBook', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Enable instant booking</span>
                            <Zap className="w-4 h-4 text-yellow-500" />
                          </label>
                          <div className="text-xs text-gray-500">
                            Allow riders to book immediately without approval
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        disabled={isSubmittingOffer}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSubmittingOffer ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-5 h-5 mr-2" />
                        )}
                        {isSubmittingOffer ? 'Publishing Your Ride...' : 'Share Your Ride'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Stats Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Your Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.ridesTaken}</div>
                    <div className="text-xs text-gray-600">Rides Taken</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userStats.ridesOffered}</div>
                    <div className="text-xs text-gray-600">Rides Offered</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${userStats.moneySaved}</div>
                    <div className="text-xs text-gray-600">Money Saved</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.co2Saved}</div>
                    <div className="text-xs text-gray-600">lbs CO₂ Saved</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Distance</span>
                    <Badge className="bg-purple-100 text-purple-800">{userStats.totalDistance} miles</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Activity */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg border-l-4 border-green-400">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ride completed</p>
                      <p className="text-xs text-gray-500">Downtown to Airport • 2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-400">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New ride request</p>
                      <p className="text-xs text-gray-500">Capitol Hill to UW • 4h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-400">
                    <Plus className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ride offered</p>
                      <p className="text-xs text-gray-500">Bellevue to Seattle • 1d ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
                    Messages
                    {notifications.filter(n => n.type === 'message' && !n.read).length > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs">
                        {notifications.filter(n => n.type === 'message' && !n.read).length}
                      </Badge>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-50 transition-colors">
                    <Star className="w-4 h-4 mr-2 text-yellow-600" />
                    Rate Riders
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 mr-2 text-gray-600" />
                    Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 transition-colors">
                    <Leaf className="w-4 h-4 mr-2 text-green-600" />
                    Carbon Impact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span>Eco Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Month</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      12 lbs CO₂
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 text-center p-2 bg-white/50 rounded">
                    🌱 Equivalent to planting 0.3 trees this month!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}