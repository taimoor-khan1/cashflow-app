# Firebase Setup Guide for CashFlow App

This guide will help you set up Firebase authentication and real-time database for your CashFlow React Native app.

## Prerequisites

- React Native project with Android/iOS setup
- Firebase project created
- Google Cloud Console access

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `cashflow-52de6` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Google" provider
3. Add your app's SHA-1 fingerprint for Android
4. Save the configuration

### 1.3 Enable Realtime Database
1. Go to "Realtime Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Note the database URL (e.g., `https://cashflow-52de6-default-rtdb.firebaseio.com`)

### 1.4 Set Database Rules
Update your database rules to allow authenticated users to read/write their own data:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "persons": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "transactions": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "categories": {
      ".read": "auth != null"
    }
  }
}
```

## Step 2: Android Configuration

### 2.1 Update google-services.json
1. Download the updated `google-services.json` from Firebase Console
2. Replace the existing file in `android/app/google-services.json`
3. Make sure the package name matches your app's package name

### 2.2 Update build.gradle
In `android/app/build.gradle`, ensure you have:

```gradle
dependencies {
    // ... other dependencies
    implementation 'com.google.firebase:firebase-auth:22.3.0'
    implementation 'com.google.firebase:firebase-database:20.3.0'
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}

apply plugin: 'com.google.gms.google-services'
```

### 2.3 Update project-level build.gradle
In `android/build.gradle`, ensure you have:

```gradle
buildscript {
    dependencies {
        // ... other dependencies
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

## Step 3: iOS Configuration

### 3.1 Update GoogleService-Info.plist
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to your iOS project in Xcode
3. Make sure it's included in your app bundle

### 3.2 Update Podfile
In your `ios/Podfile`, add:

```ruby
pod 'Firebase/Auth'
pod 'Firebase/Database'
pod 'GoogleSignIn'
```

Then run:
```bash
cd ios && pod install
```

## Step 4: Environment Configuration

### 4.1 Update Firebase Config
In `src/config/firebase.js`, update the configuration:

```javascript
// Update these values from your Firebase project
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'YOUR_DATABASE_URL', // Important for Realtime Database
};
```

### 4.2 Update Google Sign-In Web Client ID
1. In Firebase Console, go to "Authentication" → "Sign-in method" → "Google"
2. Copy the Web client ID
3. Update it in `src/config/firebase.js`:

```javascript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

## Step 5: Testing

### 5.1 Test Authentication
1. Run your app
2. Try to sign in with Google
3. Check Firebase Console → Authentication → Users to see if user is created

### 5.2 Test Database
1. After signing in, try to add a person or transaction
2. Check Firebase Console → Realtime Database to see if data is stored
3. Verify the data structure matches your app's requirements

## Step 6: Security Considerations

### 6.1 Production Rules
Before going to production, update your database rules to be more restrictive:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['uid', 'email', 'createdAt'])"
      }
    },
    "persons": {
      "$uid": {
        "$personId": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid",
          ".validate": "newData.hasChildren(['name', 'userId', 'createdAt'])"
        }
      }
    },
    "transactions": {
      "$uid": {
        "$transactionId": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid",
          ".validate": "newData.hasChildren(['type', 'amount', 'personId', 'userId', 'createdAt'])"
        }
      }
    }
  }
}
```

### 6.2 API Key Security
- Never commit API keys to public repositories
- Use environment variables for production
- Restrict API key usage in Google Cloud Console

## Troubleshooting

### Common Issues

1. **Google Sign-In not working**
   - Check SHA-1 fingerprint in Firebase Console
   - Verify Google Play Services is installed
   - Check internet connectivity

2. **Database connection failed**
   - Verify database URL is correct
   - Check database rules
   - Ensure user is authenticated

3. **Build errors**
   - Clean and rebuild project
   - Check dependency versions
   - Verify Google Services plugin is applied

### Debug Tips

1. Enable Firebase debug logging:
```javascript
import { firebase } from '@react-native-firebase/app';
firebase.app().options.debug = true;
```

2. Check Firebase Console logs for errors
3. Use React Native debugger to inspect network requests
4. Verify authentication state in your app

## Support

If you encounter issues:
1. Check Firebase documentation
2. Review React Native Firebase documentation
3. Check GitHub issues for known problems
4. Ensure all dependencies are up to date

## Next Steps

After successful setup:
1. Implement error handling and retry logic
2. Add offline support with Firebase persistence
3. Implement data validation and sanitization
4. Add analytics and crash reporting
5. Set up automated testing for Firebase operations

