#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up RideMatch environment...\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please backup and remove it to run this setup.');
  process.exit(1);
}

// Read the example file
const examplePath = path.join(process.cwd(), '.env.local.example');
if (!fs.existsSync(examplePath)) {
  console.log('❌ .env.local.example not found. Please ensure it exists.');
  process.exit(1);
}

// Copy the example file
fs.copyFileSync(examplePath, envPath);

console.log('✅ Environment file created successfully!');
console.log('\n📝 Next steps:');
console.log('1. Edit .env.local with your actual configuration values');
console.log('2. Get your Firebase configuration from the Firebase Console');
console.log('3. Get your Google Maps API key from Google Cloud Console');
console.log('4. Customize the app name and other settings as needed');
console.log('\n🔧 Required environment variables:');
console.log('- NEXT_PUBLIC_FIREBASE_API_KEY');
console.log('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID');
console.log('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
console.log('- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
console.log('- NEXT_PUBLIC_FIREBASE_APP_ID');
console.log('- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
console.log('\n🎉 Setup complete! Run "npm run dev" to start the development server.');