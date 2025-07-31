export interface User {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  photoURL?: string
  role?: 'driver' | 'passenger'
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  photoURL?: string
  createdAt: Date
  updatedAt: Date
}

export interface Ride {
  id: string
  driverId: string
  passengerId?: string
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
  pickup: {
    lat: number
    lng: number
    address: string
  }
  destination: {
    lat: number
    lng: number
    address: string
  }
  price: number
  distance: number
  duration: number
  createdAt: Date
  updatedAt: Date
}

export interface Driver {
  userId: string
  vehicle: {
    model: string
    color: string
    plateNumber: string
  }
  rating: number
  isAvailable: boolean
  currentLocation?: {
    lat: number
    lng: number
  }
}

export interface RideRequest {
  id: string
  rideId: string
  passengerId: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  message?: string
  createdAt: Date
  updatedAt: Date
}
