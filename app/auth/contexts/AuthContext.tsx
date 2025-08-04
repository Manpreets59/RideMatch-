'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  AuthError
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserProfile, createUserProfile } from '@/lib/auth'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  logout: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (uid: string) => {
    try {
      const profile = await getUserProfile(uid)
      setUserProfile(profile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid)
    }
  }

  const createProfileFromOAuth = async (user: User) => {
    try {
      // Check if profile already exists
      const existingProfile = await getUserProfile(user.uid)
      if (existingProfile) {
        return
      }
    } catch (error) {
      // Profile doesn't exist, create one
    }

    // Extract name from display name or email
    const displayName = user.displayName || user.email?.split('@')[0] || 'User'
    const nameParts = displayName.split(' ')
    const firstName = nameParts[0] || 'User'
    const lastName = nameParts.slice(1).join(' ') || ''

    await createUserProfile(user.uid, {
      firstName,
      lastName,
      email: user.email || '',
      phone: user.phoneNumber || '',
      createdAt: new Date().toISOString(),
      verified: user.emailVerified,
      photoURL: user.photoURL || undefined,
      provider: user.providerData[0]?.providerId || 'unknown'
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user)
          // Create profile if it doesn't exist (for OAuth users)
          await createProfileFromOAuth(user)
          await fetchUserProfile(user.uid)
        } else {
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      // User will be set by onAuthStateChanged
    } catch (error: any) {
      console.error('Google sign in error:', error)
      throw new Error(getOAuthErrorMessage(error) || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const signInWithGitHub = async () => {
    try {
      setLoading(true)
      const provider = new GithubAuthProvider()
      provider.addScope('user:email')
      
      const result = await signInWithPopup(auth, provider)
      // User will be set by onAuthStateChanged
    } catch (error: any) {
      console.error('GitHub sign in error:', error)
      throw new Error(getOAuthErrorMessage(error) || 'Failed to sign in with GitHub')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      // User state will be cleared by onAuthStateChanged
    } catch (error: any) {
      console.error('Sign out error:', error)
      throw new Error('Failed to sign out')
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper function to convert OAuth error codes to user-friendly messages
function getOAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.'
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups and try again.'
    case 'auth/cancelled-popup-request':
      return 'Another sign-in popup is already open.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials.'
    case 'auth/auth-domain-config-required':
      return 'Authentication configuration error. Please contact support.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.'
    case 'auth/operation-not-supported-in-this-environment':
      return 'This operation is not supported in your current environment.'
    case 'auth/timeout':
      return 'The operation has timed out. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again.'
    case 'auth/invalid-api-key':
      return 'Invalid API key. Please contact support.'
    case 'auth/app-not-authorized':
      return 'This app is not authorized to use Firebase Authentication.'
    default:
      return 'An error occurred during sign-in. Please try again.'
  }
}