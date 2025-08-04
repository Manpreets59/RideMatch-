"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, AlertCircle } from "lucide-react"
import { useAuth } from "@/app/auth/contexts/AuthContext"

// Icons for OAuth providers
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function AuthPage() {
  const router = useRouter()
  const { user, signInWithGoogle, signInWithGitHub, loading } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    setError("")
    setIsSigningIn(true)
    
    try {
      await signInWithGoogle()
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google. Please try again.")
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setError("")
    setIsSigningIn(true)
    
    try {
      await signInWithGitHub()
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      setError(error.message || "Failed to sign in with GitHub. Please try again.")
    } finally {
      setIsSigningIn(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is authenticated (prevents flash)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">RideMatch</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RideMatch</h1>
          <p className="text-gray-600">Join the community of smart travelers</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Auth Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Sign In to Continue</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method to access your RideMatch account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || loading}
              variant="outline"
              className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              <GoogleIcon />
              <span className="ml-3">
                {isSigningIn ? "Signing in..." : "Continue with Google"}
              </span>
            </Button>

            {/* GitHub Sign In */}
            <Button
              onClick={handleGitHubSignIn}
              disabled={isSigningIn || loading}
              variant="outline"
              className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              <GitHubIcon />
              <span className="ml-3">
                {isSigningIn ? "Signing in..." : "Continue with GitHub"}
              </span>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Secure Authentication</span>
              </div>
            </div>

            {/* Security Note */}
            <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <p className="mb-1">🔒 Your data is secure with us</p>
              <p className="text-xs">We only access your basic profile information</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-gray-600">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </Link>
          </div>
          
          <div className="text-xs text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}