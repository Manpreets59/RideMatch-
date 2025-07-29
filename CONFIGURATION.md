# Configuration Guide

This guide explains how to configure RideMatch dynamically using environment variables.

## Quick Setup

1. Run the setup script:
   ```bash
   npm run setup
   ```

2. Edit `.env.local` with your configuration values

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Required Variables

#### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID

#### Google Maps
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

### Optional Variables

#### App Configuration
- `NEXT_PUBLIC_APP_NAME` - App name (default: "RideMatch")
- `NEXT_PUBLIC_APP_DESCRIPTION` - App description
- `NEXT_PUBLIC_APP_URL` - App URL (default: "http://localhost:3000")
- `NEXT_PUBLIC_APP_VERSION` - App version (default: "0.1.0")

#### Feature Flags
- `NEXT_PUBLIC_ENABLE_REAL_TIME_TRACKING` - Enable real-time tracking (default: true)
- `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` - Enable notifications (default: true)
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics (default: true)

#### API Configuration
- `NEXT_PUBLIC_API_BASE_URL` - API base URL (default: "/api")
- `NEXT_PUBLIC_API_TIMEOUT` - API timeout in milliseconds (default: 5000)

## Getting Your API Keys

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click on the web app or create a new one
6. Copy the configuration values

### Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Maps JavaScript API
4. Go to Credentials
5. Create an API key
6. Restrict the API key to your domain for security

## Customization Examples

### Change App Name
```bash
NEXT_PUBLIC_APP_NAME=MyRideApp
```

### Disable Features
```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false
```

### Custom API Endpoint
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.myapp.com
```

## Validation

The app automatically validates your configuration on startup. If any required variables are missing, you'll see helpful error messages.

You can also manually validate your configuration by importing the validation function:

```typescript
import { validateEnvironment } from '@/lib/validate-env';

// This will log validation results
validateEnvironment();
```

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Ensure all required variables are set in `.env.local`
   - Check that the file is in the project root
   - Restart your development server after changes

2. **Firebase connection errors**
   - Verify your Firebase project is active
   - Check that Firestore is enabled in your Firebase project
   - Ensure your API key has the necessary permissions

3. **Google Maps not loading**
   - Verify your API key is correct
   - Check that the Maps JavaScript API is enabled
   - Ensure billing is set up for your Google Cloud project

### Debug Configuration

You can debug your current configuration by importing:

```typescript
import { getCurrentConfig } from '@/lib/validate-env';

console.log(getCurrentConfig());
```

This will show your current configuration with sensitive values masked.