import { config } from './config';

export function validateEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required Firebase variables
  const requiredFirebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  requiredFirebaseVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName] === 'your_api_key_here') {
      errors.push(`Missing or invalid ${varName}`);
    }
  });

  // Check Google Maps API key
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
    errors.push('Missing or invalid NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
  }

  // Check optional variables
  if (!process.env.NEXT_PUBLIC_APP_NAME) {
    warnings.push('NEXT_PUBLIC_APP_NAME not set, using default: RideMatch');
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    warnings.push('NEXT_PUBLIC_APP_URL not set, using default: http://localhost:3000');
  }

  // Display results
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease check your .env.local file and ensure all required variables are set.');
    return false;
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log('✅ Environment validation passed!');
  return true;
}

// Export current config for debugging
export function getCurrentConfig() {
  return {
    app: config.app,
    firebase: {
      ...config.firebase,
      apiKey: config.firebase.apiKey ? '***' : 'NOT_SET',
    },
    maps: {
      apiKey: config.maps.apiKey ? '***' : 'NOT_SET',
    },
    features: config.features,
    env: config.env,
  };
}