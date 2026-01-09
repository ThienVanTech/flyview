# FlyView Installation and Setup Guide

## Introduction
FlyView is a Flight Information Display System built with Next.js, React, TypeScript, and Firebase.

## System Requirements

Before installation, ensure your system has:

- **Node.js**: version 16.x or higher (recommended 18.x or 20.x)
- **npm**: version 8.x or higher (comes with Node.js)
- **Git**: for cloning the repository
- **Firebase Account**: for database and authentication setup

Check your current versions:
```bash
node --version
npm --version
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/ThienVanTech/flyview.git
cd flyview
```

## Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

This will install the main dependencies including:
- Next.js (framework)
- React (UI library)
- Firebase (database and authentication)
- Chakra UI (component library)
- TypeScript (type safety)

## Step 3: Firebase Configuration

### 3.1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. In Project Settings, find "Your apps" section and add a web app
4. Copy the Firebase configuration details

### 3.2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the following environment variables to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note**: 
- Replace `your_*` values with your actual Firebase configuration
- The `.env.local` file is not committed to Git (already in `.gitignore`)
- Refer to `.env.example` for the correct structure

**⚠️ SECURITY WARNING**: 
These Firebase configuration values are client-side keys that will be exposed in the browser. While this is normal for Firebase web apps, you MUST:
- Configure proper Firestore Security Rules (see section 3.3)
- Enable Firebase Authentication (see section 3.4)
- Never expose sensitive project settings or admin credentials
- Regularly review your Firebase security rules and access logs

### 3.3. Setup Firebase Database (Firestore)

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose mode:
   - **Test mode**: for development (public data, temporary only)
   - **Production mode**: for production (requires security rules)

4. Select the closest location to your users

#### Database Structure

FlyView uses Firestore with the following collections structure:

```
firestore/
├── airlines/
│   └── {airlineCode}/
│       ├── name: string
│       ├── logo: string
│       ├── headerColor: string
│       └── textColor: string
└── flights/
    └── {flightId}/
        ├── airlineCode: string
        ├── flightNumber: string
        ├── destination: string
        ├── departureTime: timestamp
        ├── gate: string
        ├── status: string
        └── date: string
```

#### Firestore Security Rules (Recommended)

Go to **Firestore Database > Rules** and update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for flights and airlines
    match /flights/{flight} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /airlines/{airline} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Composite Indexes (REQUIRED)

**Important**: The application requires composite indexes to load flight lists. When you first access the Edit or Viewer pages, Firebase will show an error in the browser console with a link to create the required index.

**How to Create Composite Indexes:**

**Option 1: Automatic (Recommended)**
1. Open browser console (F12) while running the app
2. Navigate to the Edit or Viewer page
3. Look for an error like: "The query requires an index..."
4. Click the link in the error - Firebase will auto-create the index for you
5. Wait a few minutes for the index to build
6. Refresh the page

**Option 2: Manual Creation**
1. Go to Firebase Console > **Firestore Database > Indexes**
2. Click "Create Index"
3. Create an index with the following configuration:

**Index 1 (Required for viewing flights):**
- Collection ID: `flights`
- Fields to index:
  - `airlineCode` - Ascending
  - `actualDepartureTime` - Ascending
  - `scheduledDepartureTime` - Ascending

**Note**: After creating the index, it may take 5-10 minutes for Firebase to complete building it. During this time, the Edit and Viewer pages will not display data yet.

### 3.4. Setup Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable sign-in methods:
   - **Email/Password**: for basic authentication
   - Or other providers if needed (Google, Facebook, etc.)

## Step 4: Run the Application

### Development Mode

To run the application in development mode with hot reload:

```bash
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

### Production Build

To build the application for production:

```bash
npm run build
```

After building, start the production server:

```bash
npm start
```

### Linting

To check code style and errors:

```bash
npm run lint
```

## Project Structure

```
flyview/
├── components/          # Reusable React components
├── contexts/           # React Context providers
├── hoc/               # Higher Order Components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages (routing)
│   ├── _app.tsx       # App wrapper
│   ├── _document.tsx  # Document wrapper
│   ├── index.tsx      # Home page (dashboard)
│   ├── login.tsx      # Login page
│   ├── add.tsx        # Add flight page
│   ├── edit.tsx       # Edit flights page
│   └── viewer.tsx     # FID display page
├── public/            # Static files (images, fonts)
├── styles/            # CSS/styling files
├── theme/             # Chakra UI theme configuration
├── firebaseConfig.js  # Firebase initialization
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## API Connections

FlyView uses Firebase as the backend without a separate REST API. All database interactions are done through the Firebase SDK:

### Important Files for API/Database:

1. **firebaseConfig.js**: Initializes Firebase app and exports services
   - `auth`: Firebase Authentication instance
   - `db`: Firestore Database instance

2. **Usage in components**:
   ```javascript
   import { db, auth } from '../firebaseConfig';
   import { collection, addDoc, getDocs } from 'firebase/firestore';
   
   // Add a flight
   await addDoc(collection(db, 'flights'), flightData);
   
   // Get flights list
   const snapshot = await getDocs(collection(db, 'flights'));
   ```

## Troubleshooting

### Edit/Viewer Pages Don't Load Data (Blank Screen)
**Cause**: Missing Composite Index in Firestore

**Solution**:
1. Open Browser Console (F12)
2. Look for an error like: `The query requires an index. You can create it here: https://console.firebase.google.com/...`
3. Click the link in the error message
4. Firebase will auto-fill the index creation form - click "Create Index"
5. Wait 5-10 minutes for the index to build
6. Refresh the page

**Details**: See the "Composite Indexes (REQUIRED)" section in 3.3 above.

### "Firebase: Error (auth/...)" Error
- Double-check environment variables in `.env.local`
- Ensure Authentication is enabled in Firebase Console

### "Module not found" Error
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### TypeScript Errors
- Run `npm run lint` to check for errors
- Verify `tsconfig.json` has correct configuration

### Port 3000 Already in Use
- Change port by running: `PORT=3001 npm run dev`
- Or kill the process using port 3000

## Deployment

The application can be deployed to:

- **Vercel** (recommended for Next.js): [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **Firebase Hosting**: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)

**Note**: When deploying, configure environment variables on the respective platform.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Chakra UI Documentation](https://chakra-ui.com/docs)

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Search existing issues on the GitHub repository
3. Create a new issue with detailed problem description
