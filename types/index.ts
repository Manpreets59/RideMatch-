export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  phoneNumber?: string
  role: 'driver' | 'passenger'
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
