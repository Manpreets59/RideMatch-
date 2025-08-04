// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage'
import { getAnalytics, Analytics } from 'firebase/analytics'

// Firebase configuration interface for better type safety
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Environment variables with fallbacks and validation
const getEnvVar = (key: string, required: boolean = true): string | undefined => {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// Build Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY')!,
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')!,
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID')!,
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')!,
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')!,
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID')!,
  measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', false)
}

// Validate configuration
const validateConfig = (config: FirebaseConfig): void => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey', 
    'authDomain', 
    'projectId', 
    'storageBucket', 
    'messagingSenderId', 
    'appId'
  ]

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Firebase configuration missing: ${field}`)
    }
  }

  // Validate format of some fields
  if (!config.apiKey.startsWith('AIza')) {
    console.warn('Firebase API key format appears invalid')
  }

  if (!config.authDomain.includes('.firebaseapp.com')) {
    console.warn('Firebase auth domain format appears invalid')
  }
}

// Validate the configuration
validateConfig(firebaseConfig)

// Initialize Firebase app
let app: FirebaseApp
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
} catch (error) {
  console.error('Failed to initialize Firebase:', error)
  throw new Error('Firebase initialization failed')
}

// Initialize Firebase services
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null

try {
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} catch (error) {
  console.error('Failed to initialize Firebase services:', error)
  throw new Error('Firebase services initialization failed')
}

// Initialize Analytics (only in browser and production)
const initializeAnalytics = (): Analytics | null => {
  if (typeof window === 'undefined') {
    return null // Server-side
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics disabled in development mode')
    return null
  }

  if (!firebaseConfig.measurementId) {
    console.warn('Analytics measurement ID not provided')
    return null
  }

  try {
    return getAnalytics(app)
  } catch (error) {
    console.error('Failed to initialize Analytics:', error)
    return null
  }
}

analytics = initializeAnalytics()

// Emulator configuration for development
interface EmulatorConfig {
  auth: {
    host: string
    port: number
    options?: { disableWarnings: boolean }
  }
  firestore: {
    host: string
    port: number
  }
  storage: {
    host: string
    port: number
  }
}

const emulatorConfig: EmulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9099,
    options: { disableWarnings: true }
  },
  firestore: {
    host: 'localhost',
    port: 8080
  },
  storage: {
    host: 'localhost',
    port: 9199
  }
}

// Connect to emulators in development
const connectToEmulators = (): void => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  if (typeof window === 'undefined') {
    return // Don't connect on server-side
  }

  // Only connect if explicitly enabled
  const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  if (!useEmulators) {
    console.log('Firebase emulators disabled. Set NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true to enable.')
    return
  }

  console.log('Connecting to Firebase emulators...')

  // Connect Auth emulator
  try {
    // Check if already connected
    if (!(auth as any)._config?.emulator) {
      connectAuthEmulator(
        auth, 
        `http://${emulatorConfig.auth.host}:${emulatorConfig.auth.port}`,
        emulatorConfig.auth.options
      )
      console.log('✅ Connected to Auth emulator')
    }
  } catch (error) {
    console.warn('Failed to connect to Auth emulator:', error)
  }

  // Connect Firestore emulator
  try {
    // Check if already connected
    if (!(db as any)._delegate._databaseId?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, emulatorConfig.firestore.host, emulatorConfig.firestore.port)
      console.log('✅ Connected to Firestore emulator')
    }
  } catch (error) {
    console.warn('Failed to connect to Firestore emulator:', error)
  }

  // Connect Storage emulator
  try {
    // Check if already connected
    if (!(storage as any)._location?.host?.includes('localhost')) {
      connectStorageEmulator(storage, emulatorConfig.storage.host, emulatorConfig.storage.port)
      console.log('✅ Connected to Storage emulator')
    }
  } catch (error) {
    console.warn('Failed to connect to Storage emulator:', error)
  }
}

// Connect to emulators
connectToEmulators()

// Connection status utilities
export const getConnectionStatus = () => {
  const isEmulator = process.env.NODE_ENV === 'development' && 
                    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  
  return {
    environment: process.env.NODE_ENV,
    usingEmulators: isEmulator,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    analyticsEnabled: analytics !== null
  }
}

// Health check function
export const checkFirebaseHealth = async (): Promise<{
  auth: boolean
  firestore: boolean
  storage: boolean
  analytics: boolean
}> => {
  const health = {
    auth: false,
    firestore: false,
    storage: false,
    analytics: false
  }

  try {
    // Test auth
    health.auth = !!auth.currentUser !== undefined
  } catch (error) {
    console.error('Auth health check failed:', error)
  }

  try {
    // Test firestore (this is a lightweight operation)
    health.firestore = !!db.app
  } catch (error) {
    console.error('Firestore health check failed:', error)
  }

  try {
    // Test storage
    health.storage = !!storage.app
  } catch (error) {
    console.error('Storage health check failed:', error)
  }

  try {
    // Test analytics
    health.analytics = analytics !== null
  } catch (error) {
    console.error('Analytics health check failed:', error)
  }

  return health
}

// Log initialization status
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase initialized:', getConnectionStatus())
}

// Export services and utilities
export { 
  app,
  auth, 
  db, 
  storage, 
  analytics,
  firebaseConfig,
  getConnectionStatus,
  checkFirebaseHealth
}

export default app