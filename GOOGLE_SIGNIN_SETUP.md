# Google Sign-In Setup Guide

## 🚨 Current Issue
Your app is getting the error: **"Failed to get ID token from Google Sign-In"**

This is caused by an incorrect web client ID in your Firebase configuration.

## 🔧 How to Fix

### Step 1: Get Your Web Client ID

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `cashflow-52de6`
3. **Go to Project Settings** (gear icon)
4. **Click on "General" tab**
5. **Scroll down to "Your apps" section**
6. **Look for your Android app** (should be `com.cashflow`)
7. **Click on the Android app**
8. **Look for "Web client ID"** - it should look like:
   ```
   138813716042-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   ```

### Step 2: Update the Configuration

1. **Open**: `src/config/firebase.js`
2. **Find this line** (around line 30):
   ```javascript
   webClientId: '138813716042-google-signin-web-client-id.apps.googleusercontent.com'
   ```
3. **Replace it** with your actual web client ID:
   ```javascript
   webClientId: '138813716042-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com'
   ```

### Step 3: Verify Google Sign-In is Enabled

1. **In Firebase Console**, go to **Authentication**
2. **Click on "Sign-in method"**
3. **Make sure "Google" is enabled**
4. **Check that your Android app's SHA-1 fingerprint is added**

### Step 4: Check Android Configuration

1. **Verify** `google-services.json` is in `android/app/`
2. **Make sure** Google Play Services are available on your device/emulator
3. **Check** that you're testing on a real device or emulator with Google Play Services

## 🔍 Debugging Steps

### Check Console Logs
The app now logs detailed information. Look for:
- "Google Sign-In configured successfully"
- "Google Sign-In result: [object]"
- Any error messages

### Test Configuration
The app now includes configuration checks that will show:
- Whether Google Sign-In is properly configured
- Current sign-in status
- Any configuration errors

## 📱 Testing

1. **Clean build**: `cd android && ./gradlew clean`
2. **Restart Metro**: `npx react-native start --reset-cache`
3. **Run app**: `npx react-native run-android`
4. **Try Google Sign-In** and check console logs

## 🆘 If Still Not Working

### Common Issues:
1. **Wrong web client ID** - Double-check the ID from Firebase Console
2. **SHA-1 fingerprint mismatch** - Verify your app's SHA-1 in Firebase
3. **Google Play Services** - Ensure they're available on test device
4. **Network issues** - Check internet connection
5. **Firebase project** - Ensure you're using the correct project

### Get Help:
- Check Firebase Console logs
- Look at Android Studio logs
- Verify all configuration steps above

## ✅ Success Indicators

When working correctly, you should see:
- ✅ "Google Sign-In configured successfully"
- ✅ "Google Sign-In result: [user object]"
- ✅ Successful authentication with Firebase
- ✅ User data stored in Firebase Realtime Database

---

**Remember**: The web client ID is different from your app ID or project ID. It's specifically for Google Sign-In authentication.
