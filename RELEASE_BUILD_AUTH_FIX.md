# Release Build Authentication Fix

## Problem Identified
Your release build was using the debug keystore instead of a proper release keystore, causing Firebase Authentication and Google Sign-In to fail in release builds.

## What I Fixed
1. ✅ Updated `android/app/build.gradle` to use proper release signing configuration
2. ✅ Added release keystore configuration in `android/gradle.properties`
3. ✅ Set up fallback to debug keystore if release keystore is not configured

## Next Steps Required

### 1. Configure Your Release Keystore
You need to update the keystore configuration in `android/gradle.properties`:

```properties
# Replace these with your actual keystore information
MYAPP_RELEASE_STORE_FILE=keystore.jks
MYAPP_RELEASE_KEY_ALIAS=cashflow-key  # Replace with your actual alias
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password  # Replace with actual password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password  # Replace with actual password
```

### 2. Get Your Release Keystore SHA-1 Fingerprint
Run this command to get the SHA-1 fingerprint of your release keystore:

```bash
# On Windows (PowerShell)
keytool -list -v -keystore android/app/keystore.jks -alias cashflow-key

# On macOS/Linux
keytool -list -v -keystore android/app/keystore.jks -alias cashflow-key
```

### 3. Update Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `cashflow-52de6`
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Find your Android app (`com.cashflow`)
6. Click "Add fingerprint"
7. Add the SHA-1 fingerprint from step 2

### 4. Update Google Cloud Console (for Google Sign-In)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `cashflow-52de6`
3. Go to APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID for Android
5. Add the SHA-1 fingerprint from step 2

### 5. Test the Fix
After completing steps 1-4:

```bash
# Clean and rebuild
cd android
./gradlew clean

# Build release APK
./gradlew assembleRelease

# Or run release build directly
npm run android:release
```

## Alternative: Use Debug Keystore for Release (Quick Fix)
If you want to quickly test with the current setup, you can temporarily use the debug keystore for release builds by updating `android/gradle.properties`:

```properties
# Quick fix - use debug keystore for release (NOT recommended for production)
MYAPP_RELEASE_STORE_FILE=debug.keystore
MYAPP_RELEASE_KEY_ALIAS=androiddebugkey
MYAPP_RELEASE_STORE_PASSWORD=android
MYAPP_RELEASE_KEY_PASSWORD=android
```

Then add the debug keystore SHA-1 fingerprint to Firebase and Google Cloud Console.

## Security Note
For production apps, always use a proper release keystore and never commit keystore passwords to version control. Consider using environment variables or a secure keystore management system.

## Verification
After implementing the fix, your authentication should work in both debug and release builds. The key is ensuring that the SHA-1 fingerprint of the keystore used to sign your release APK matches what's registered in Firebase and Google Cloud Console.


