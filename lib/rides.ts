import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  updateDoc,
  doc, 
  query, 
  where, 
  getDocs,
  getDoc,
  deleteDoc,
  orderBy,
  limit,
  GeoPoint,
  Timestamp
} from 'firebase/firestore'
import type { Ride, RideRequest } from '@/types'

export async function createRide(rideData: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const ridesRef = collection(db, 'rides')
    const docRef = await addDoc(ridesRef, {
      ...rideData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending'
    })
    return docRef.id
  } catch (error: any) {
    console.error('Error creating ride:', error)
    throw new Error(error.message || 'Failed to create ride')
  }
}

export async function updateRideStatus(rideId: string, status: Ride['status']) {
  try {
    const rideRef = doc(db, 'rides', rideId)
    await updateDoc(rideRef, {
      status,
      updatedAt: Timestamp.now()
    })
  } catch (error: any) {
    console.error('Error updating ride status:', error)
    throw new Error(error.message || 'Failed to update ride status')
  }
}

export async function getRide(rideId: string): Promise<Ride | null> {
  try {
    const rideRef = doc(db, 'rides', rideId)
    const rideDoc = await getDoc(rideRef)
    
    if (rideDoc.exists()) {
      const data = rideDoc.data()
      return {
        id: rideDoc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Ride
    }
    return null
  } catch (error: any) {
    console.error('Error fetching ride:', error)
    throw new Error(error.message || 'Failed to fetch ride')
  }
}

export async function getAvailableRides(limitCount: number = 20): Promise<Ride[]> {
  try {
    const ridesRef = collection(db, 'rides')
    const q = query(
      ridesRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const rides: Ride[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      rides.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Ride)
    })
    
    return rides
  } catch (error: any) {
    console.error('Error fetching available rides:', error)
    throw new Error(error.message || 'Failed to fetch available rides')
  }
}

export async function getUserRides(userId: string, role: 'driver' | 'passenger'): Promise<Ride[]> {
  try {
    const ridesRef = collection(db, 'rides')
    const field = role === 'driver' ? 'driverId' : 'passengerId'
    const q = query(
      ridesRef,
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const rides: Ride[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      rides.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Ride)
    })
    
    return rides
  } catch (error: any) {
    console.error('Error fetching user rides:', error)
    throw new Error(error.message || 'Failed to fetch user rides')
  }
}

export async function createRideRequest(requestData: Omit<RideRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const requestsRef = collection(db, 'rideRequests')
    const docRef = await addDoc(requestsRef, {
      ...requestData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error: any) {
    console.error('Error creating ride request:', error)
    throw new Error(error.message || 'Failed to create ride request')
  }
}

export async function updateRideRequestStatus(requestId: string, status: RideRequest['status']) {
  try {
    const requestRef = doc(db, 'rideRequests', requestId)
    await updateDoc(requestRef, {
      status,
      updatedAt: Timestamp.now()
    })
  } catch (error: any) {
    console.error('Error updating ride request status:', error)
    throw new Error(error.message || 'Failed to update ride request status')
  }
}

export async function getRideRequests(rideId: string): Promise<RideRequest[]> {
  try {
    const requestsRef = collection(db, 'rideRequests')
    const q = query(
      requestsRef,
      where('rideId', '==', rideId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const requests: RideRequest[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      requests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as RideRequest)
    })
    
    return requests
  } catch (error: any) {
    console.error('Error fetching ride requests:', error)
    throw new Error(error.message || 'Failed to fetch ride requests')
  }
}

export async function deleteRide(rideId: string) {
  try {
    const rideRef = doc(db, 'rides', rideId)
    await deleteDoc(rideRef)
  } catch (error: any) {
    console.error('Error deleting ride:', error)
    throw new Error(error.message || 'Failed to delete ride')
  }
}

// Note: For geo queries, you'll need to set up Firestore with geohash or use a different approach
// This is a placeholder for when you implement location-based queries
export async function findNearbyDrivers(lat: number, lng: number, radiusInKm: number) {
  // Implementation will depend on your Firestore geo queries setup
  // You might want to use a geohash library or implement a different approach
  console.warn('findNearbyDrivers not implemented - requires geo query setup')
  return []
}
