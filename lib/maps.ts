const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

/**
 * Required Google Maps APIs for RideMatch:
 * - Maps JavaScript API: For embedding interactive maps in your app.
 * - Geocoding API: To convert addresses to coordinates (used in geocodeAddress).
 * - Directions API: To get routes between two points (used in calculateRoute).
 * - Places API (optional): For address autocomplete and place details.
 *
 * Make sure these APIs are enabled in your Google Cloud Console for your project.
 * https://console.cloud.google.com/apis/library
 */

export async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`
  )
  return response.json()
}

export async function calculateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${
      origin.lng
    }&destination=${destination.lat},${
      destination.lng
    }&key=${GOOGLE_MAPS_API_KEY}`
  )
  return response.json()
}
