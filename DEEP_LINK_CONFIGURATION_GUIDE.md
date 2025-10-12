# 🔗 Deep Link Configuration Guide - Lawyer Services App

## 📋 Overview

This guide will help you configure deep linking for your Lawyer Services app on both Android and iOS platforms. You'll need to set up the proper SHA256 fingerprints and Team IDs.

---

## 🤖 Android Configuration

### 1. Get SHA256 Fingerprints

#### For Debug Builds
```bash
# Method 1: Using keytool (if you have Java installed)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Method 2: Using Android Studio
# 1. Open Android Studio
# 2. Go to Build > Generate Signed Bundle/APK
# 3. Select "debug" keystore
# 4. Click "View Certificates"
# 5. Copy the SHA256 fingerprint
```

#### For Release Builds
```bash
# Method 1: Using keytool with your release keystore
keytool -list -v -keystore path/to/your/release.keystore -alias your_key_alias

# Method 2: Using Android Studio
# 1. Go to Build > Generate Signed Bundle/APK
# 2. Select your release keystore
# 3. Click "View Certificates"
# 4. Copy the SHA256 fingerprint
```

#### Alternative: Using Gradle
```bash
# Navigate to your Android project directory
cd android

# Run this command to get debug fingerprint
./gradlew signingReport
```

### 2. Update assetlinks.json

Replace the placeholders in `public/.well-known/assetlinks.json`:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.lawyer_app",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5",
      "YOUR_RELEASE_SHA256_FINGERPRINT"
    ]
  }
}]
```

### 3. Update Android Manifest

Make sure your `android/app/src/main/AndroidManifest.xml` has the correct configuration:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop">
    
    <!-- App Links -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="lawyerservices.app" />
    </intent-filter>
    
    <!-- Custom URL Scheme -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="lawyerservices" />
    </intent-filter>
</activity>
```

---

## 🍎 iOS Configuration

### 1. Get Team ID

#### Method 1: Using Xcode
1. Open your iOS project in Xcode
2. Select your project in the navigator
3. Go to "Signing & Capabilities" tab
4. Look for "Team" - the Team ID is shown in parentheses
5. Example: "Your Name (ABC123DEF4)"

#### Method 2: Using Apple Developer Portal
1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Sign in with your Apple ID
3. Go to "Certificates, Identifiers & Profiles"
4. Your Team ID is displayed at the top of the page

#### Method 3: Using Terminal
```bash
# If you have Xcode command line tools installed
security find-identity -v -p codesigning
```

### 2. Update apple-app-site-association

Replace the placeholders in `public/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABC123DEF4.com.example.lawyer_app",
        "paths": [
          "*",
          "/service/*",
          "/chat/*",
          "/lawyer/*",
          "/services",
          "/home",
          "/profile"
        ]
      }
    ]
  },
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.example.lawyer_app"
    ]
  }
}
```

### 3. Update iOS Info.plist

Make sure your `ios/Runner/Info.plist` has the correct configuration:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.example.lawyer_app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>lawyerservices</string>
        </array>
    </dict>
</array>

<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:lawyerservices.app</string>
</array>
```

### 4. Update Xcode Project

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select your project in the navigator
3. Go to "Signing & Capabilities" tab
4. Click "+ Capability" and add "Associated Domains"
5. Add domain: `applinks:lawyerservices.app`

---

## 🌐 Domain Configuration

### 1. Update Domain in Files

Replace `lawyerservices.app` with your actual domain in:

#### Android Manifest
```xml
<data android:scheme="https" android:host="yourdomain.com" />
```

#### iOS Info.plist
```xml
<string>applinks:yourdomain.com</string>
```

#### assetlinks.json
```json
{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.lawyer_app",
    "sha256_cert_fingerprints": [
      "YOUR_DEBUG_SHA256_FINGERPRINT",
      "YOUR_RELEASE_SHA256_FINGERPRINT"
    ]
  }
}
```

#### apple-app-site-association
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.example.lawyer_app",
        "paths": ["*"]
      }
    ]
  }
}
```

### 2. Deploy Files to Your Domain

Make sure these files are accessible at:
- `https://yourdomain.com/.well-known/assetlinks.json`
- `https://yourdomain.com/.well-known/apple-app-site-association`

---

## 🧪 Testing Deep Links

### Android Testing

#### 1. Test App Links
```bash
# Test with ADB
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "https://yourdomain.com/service?id=123" \
  com.example.lawyer_app
```

#### 2. Test Custom URL Scheme
```bash
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "lawyerservices://service/123" \
  com.example.lawyer_app
```

#### 3. Verify assetlinks.json
Visit: `https://yourdomain.com/.well-known/assetlinks.json`

### iOS Testing

#### 1. Test Universal Links
```bash
# Using Simulator
xcrun simctl openurl booted "https://yourdomain.com/service?id=123"
```

#### 2. Test Custom URL Scheme
```bash
xcrun simctl openurl booted "lawyerservices://service/123"
```

#### 3. Verify apple-app-site-association
Visit: `https://yourdomain.com/.well-known/apple-app-site-association`

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Android App Links Not Working
- **Check**: `assetlinks.json` is accessible via HTTPS
- **Check**: SHA256 fingerprints are correct
- **Check**: Package name matches exactly
- **Test**: Use `adb` commands to verify

#### 2. iOS Universal Links Not Working
- **Check**: `apple-app-site-association` is accessible via HTTPS
- **Check**: Team ID is correct
- **Check**: Associated Domains are configured in Xcode
- **Test**: Use Safari to test the link first

#### 3. Custom URL Schemes Not Working
- **Check**: URL schemes are registered in manifest/plist
- **Check**: App is installed on device
- **Test**: Use device/simulator commands

### Debug Tips

#### Android
```bash
# Check if app links are verified
adb shell pm get-app-links com.example.lawyer_app

# Reset app link verification
adb shell pm set-app-links --package com.example.lawyer_app 0
```

#### iOS
```bash
# Check associated domains
xcrun simctl spawn booted log show --predicate 'subsystem == "com.apple.SafariServices"'
```

---

## 📱 Production Checklist

### Before Release

- [ ] **Android**
  - [ ] Release SHA256 fingerprint added to `assetlinks.json`
  - [ ] Package name matches exactly
  - [ ] `assetlinks.json` accessible via HTTPS
  - [ ] App Links verified in Android settings

- [ ] **iOS**
  - [ ] Team ID added to `apple-app-site-association`
  - [ ] Associated Domains configured in Xcode
  - [ ] `apple-app-site-association` accessible via HTTPS
  - [ ] Universal Links tested in Safari

- [ ] **Domain**
  - [ ] SSL certificate installed
  - [ ] Files accessible at correct URLs
  - [ ] Content-Type headers set correctly
  - [ ] CORS headers configured if needed

### Content-Type Headers

Make sure your server serves the files with correct content types:

```javascript
// Express.js example
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public/.well-known/assetlinks.json'));
});

app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public/.well-known/apple-app-site-association'));
});
```

---

## 🚀 Next Steps

1. **Get your SHA256 fingerprints** using the methods above
2. **Get your iOS Team ID** from Xcode or Apple Developer Portal
3. **Update the configuration files** with your actual values
4. **Deploy the files** to your domain
5. **Test the deep links** on both platforms
6. **Verify in production** before releasing

Your Lawyer Services app will then support comprehensive deep linking! 🎉
