import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { User, UserProfile } from '@/types'

export async function signUp(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  phone: string
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    })

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      phone,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)

    return {
      ...userProfile,
      role: undefined
    }
  } catch (error: any) {
    console.error('Error in signUp:', error)
    throw new Error(error.message || 'Failed to create account')
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    console.error('Error in signIn:', error)
    throw new Error(error.message || 'Failed to sign in')
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    console.error('Error in signOut:', error)
    throw new Error(error.message || 'Failed to sign out')
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    throw new Error(error.message || 'Failed to fetch user profile')
  }
}
