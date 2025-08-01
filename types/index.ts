// types/index.ts
export interface UserProfile {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  verified: boolean
  createdAt: string
  updatedAt?: string
  rating?: number
  totalRides?: number
  bio?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  smokingAllowed: boolean
  petsAllowed: boolean
  musicPreference: 'any' | 'none' | 'classical' | 'pop' | 'rock'
  talkingPreference: 'chatty' | 'quiet' | 'no-preference'
  instantBooking: boolean
}

export interface Ride {
  id: string
  driverId: string
  from: string
  to: string
  fromCoordinates?: {
    lat: number
    lng: number
  }
  toCoordinates?: {
    lat: number
    lng: number
  }
  date: string
  time: string
  seats: number
  price: number
  description?: string
  status: 'available' | 'full' | 'completed' | 'cancelled'
  vehicleType: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'van'
  amenities: string[]
  instantBook: boolean
  createdAt: string
  updatedAt?: string
  requests?: RideRequest[]
}

export interface RideRequest {
  id: string
  rideId: string
  passengerId: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  seatsRequested: number
  message?: string
  createdAt: string
  updatedAt?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  rideId?: string
  content: string
  type: 'text' | 'system'
  read: boolean
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'ride_request' | 'ride_accepted' | 'ride_cancelled' | 'message' | 'rating' | 'system'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
}

export interface Rating {
  id: string
  rideId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment?: string
  createdAt: string
}