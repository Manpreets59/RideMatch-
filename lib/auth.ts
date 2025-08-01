// lib/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from './firebase'
import type { UserProfile } from '@/types'

// Sign in function
export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential
}

// Sign up function
export async function signUp(email: string, password: string, firstName: string, lastName: string, phone: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  // Create user profile
  await createUserProfile(userCredential.user.uid, {
    firstName,
    lastName,
    email,
    phone,
    verified: false,
    createdAt: new Date().toISOString()
  })
  
  return userCredential
}

// Sign out function
export async function signOut() {
  await firebaseSignOut(auth)
}

// Create user profile in Firestore
export async function createUserProfile(uid: string, profileData: Partial<UserProfile>) {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, {
    ...profileData,
    id: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        id: uid,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
      } as UserProfile
    }
    
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}