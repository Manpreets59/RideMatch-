"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { config } from "@/lib/config"

export default function DashboardPage() {
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")

  const mockRides = [
    {
      id: 1,
      driver: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      from: "Downtown Seattle",
      to: "Bellevue Tech Center",
      time: "8:00 AM",
      date: "Today",
      price: "$8",
      seats: 3,
      distance: "12 miles",
    },
    {
      id: 2,
      driver: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      from: "Capitol Hill",
      to: "University of Washington",
      time: "9:15 AM",
      date: "Tomorrow",
      price: "Free",
      seats: 2,
      distance: "8 miles",
    },
    {
      id: 3,
      driver: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      from: "Fremont",
      to: "Amazon HQ",
      time: "7:45 AM",
      date: "Today",
      price: "$6",
      seats: 1,
      distance: "15 miles",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">{config.app.name}</span>
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
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                            value={searchFrom}
                            onChange={(e) => setSearchFrom(e.target.value)}
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
                            value={searchTo}
                            onChange={(e) => setSearchTo(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="date" type="date" className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="time" type="time" className="pl-10" />
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                        <Search className="w-4 h-4 mr-2" />
                        Search Rides
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Rides */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Available Rides</h2>
                  {mockRides.map((ride) => (
                    <Card key={ride.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={ride.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {ride.driver
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
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
                            <span>
                              {ride.from} → {ride.to}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {ride.time} • {ride.date}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{ride.seats} seats left</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                            >
                              Request Ride
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="offer-from">From</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="offer-from" placeholder="Enter starting location" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offer-to">To</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="offer-to" placeholder="Enter destination" className="pl-10" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="offer-date">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="offer-date" type="date" className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offer-time">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="offer-time" type="time" className="pl-10" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seats">Available Seats</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="seats" type="number" min="1" max="7" placeholder="1" className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price per Person</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="price" type="number" min="0" step="0.50" placeholder="0.00" className="pl-10" />
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Offer Ride
                      </Button>
                    </div>
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
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rides Offered</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Money Saved</span>
                    <Badge className="bg-green-100 text-green-800">$156</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CO₂ Saved</span>
                    <Badge className="bg-blue-100 text-blue-800">45 lbs</Badge>
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
