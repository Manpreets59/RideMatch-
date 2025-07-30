import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import type { User } from '@/types'

export async function signUp(email: string, password: string, userData: Partial<User>) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    ...userData,
    email: user.email,
    uid: user.uid,
    createdAt: new Date()
  })

  return user
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  return firebaseSignOut(auth)
}
