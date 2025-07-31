# RideMatch - Smart Ride Sharing Platform

A modern, full-stack ride-sharing application built with Next.js, Firebase, and Google Maps API. Connect with travelers heading your way for smart, affordable, and eco-friendly transportation.

## 🚀 Features

- **User Authentication** - Secure signup/login with Firebase Auth
- **Real-time Ride Matching** - Find and offer rides in real-time
- **Interactive Maps** - Google Maps integration for location services
- **Responsive Design** - Beautiful UI that works on all devices
- **Real-time Notifications** - Stay updated with ride requests and messages
- **Eco-friendly Tracking** - Monitor your carbon footprint reduction
- **Rating System** - Build trust with driver/passenger ratings

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: Google Maps JavaScript API
- **State Management**: React Context API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ridematch.git
   cd ridematch
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your project configuration

5. **Configure Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable these APIs:
     - Maps JavaScript API
     - Geocoding API
     - Directions API
     - Places API (optional)
   - Create an API key

6. **Update environment variables**
   Edit `.env.local` and add your configuration:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Google Maps API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

## 🚀 Running the Application

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
RideMatch/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix)
│   ├── Header.tsx        # Navigation header
│   ├── RideMap.tsx       # Interactive map component
│   └── ProtectedRoute.tsx # Auth protection wrapper
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── auth.ts           # Authentication functions
│   ├── rides.ts          # Ride management functions
│   ├── maps.ts           # Google Maps utilities
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
├── contexts/             # React contexts
└── public/               # Static assets
```

## 🔐 Firebase Setup

### Authentication
1. In Firebase Console, go to Authentication
2. Enable Email/Password sign-in method
3. Set up password reset (optional)

### Firestore Database
1. Create a Firestore database
2. Set up security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Rides can be read by all authenticated users, written by owners
       match /rides/{rideId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == resource.data.driverId;
       }
       
       // Ride requests
       match /rideRequests/{requestId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Storage (Optional)
1. Enable Firebase Storage
2. Set up storage rules for profile pictures

## 🗺️ Google Maps Setup

1. **Enable APIs** in Google Cloud Console:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Places API (for autocomplete)

2. **Set up billing** (required for API usage)

3. **Restrict API key** to your domain for security

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when implemented)
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/ridematch/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🔮 Roadmap

- [ ] Real-time messaging
- [ ] Push notifications
- [ ] Payment integration
- [ ] Driver verification
- [ ] Ride history
- [ ] Mobile app
- [ ] Advanced filtering
- [ ] Route optimization

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Google Maps](https://developers.google.com/maps) for mapping services

---

Made with ❤️ for the community