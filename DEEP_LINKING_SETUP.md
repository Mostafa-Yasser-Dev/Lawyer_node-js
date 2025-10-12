# 🔗 Deep Linking Setup - Lawyer Services App

## 📋 Table of Contents
1. [Overview](#overview)
2. [Flutter Dependencies](#flutter-dependencies)
3. [Android Configuration](#android-configuration)
4. [iOS Configuration](#ios-configuration)
5. [Deep Link Implementation](#deep-link-implementation)
6. [URL Schemes](#url-schemes)
7. [Testing Deep Links](#testing-deep-links)
8. [Production Setup](#production-setup)

---

## 🎯 Overview

Deep linking allows users to:
- **Open specific screens** directly from links
- **Share content** with others
- **Navigate to specific features** from external sources
- **Improve user experience** with seamless navigation

### Supported Deep Link Types
- **App Links** (Android) / **Universal Links** (iOS)
- **Custom URL Schemes**
- **Dynamic Links** (Firebase)
- **Web-to-App** navigation

---

## 📱 Flutter Dependencies

### Add to `pubspec.yaml`
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Deep linking
  go_router: ^12.1.3
  url_launcher: ^6.2.1
  uni_links: ^0.5.1
  app_links: ^3.4.2
  
  # For Firebase Dynamic Links (optional)
  firebase_dynamic_links: ^4.3.3
  
  # For sharing
  share_plus: ^7.2.1
  
  # For notifications with deep links
  flutter_local_notifications: ^16.3.2
```

### Install Dependencies
```bash
flutter pub get
```

---

## 🤖 Android Configuration

### 1. Update `android/app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="Lawyer Services"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        
        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <!-- Deep Link Intent Filters -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <!-- App Links -->
                <data android:scheme="https"
                      android:host="lawyerservices.app" />
            </intent-filter>
            
            <!-- Custom URL Scheme -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="lawyerservices" />
            </intent-filter>
            
            <!-- Default Intent Filter -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <!-- Firebase Dynamic Links (if using) -->
        <activity
            android:name="com.google.firebase.dynamiclinks.FirebaseDynamicLinksActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:host="lawyerservices.page.link" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 2. Create `android/app/src/main/res/xml/asset_links.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.lawyerservices.app",
    "sha256_cert_fingerprints": ["YOUR_APP_SHA256_FINGERPRINT"]
  }
}]
```

### 3. Update `android/app/build.gradle`

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.lawyerservices.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    // Add for deep linking
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

---

## 🍎 iOS Configuration

### 1. Update `ios/Runner/Info.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- App Configuration -->
    <key>CFBundleDisplayName</key>
    <string>Lawyer Services</string>
    
    <!-- URL Schemes -->
    <key>CFBundleURLTypes</key>
    <array>
        <!-- Custom URL Scheme -->
        <dict>
            <key>CFBundleURLName</key>
            <string>com.lawyerservices.app</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>lawyerservices</string>
            </array>
        </dict>
        
        <!-- Universal Links -->
        <dict>
            <key>CFBundleURLName</key>
            <string>com.lawyerservices.app.universal</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>https</string>
            </array>
        </dict>
    </array>
    
    <!-- Associated Domains -->
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:lawyerservices.app</string>
        <string>applinks:lawyerservices.page.link</string>
    </array>
    
    <!-- Other configurations -->
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
```

### 2. Create `ios/Runner/Runner.entitlements`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:lawyerservices.app</string>
        <string>applinks:lawyerservices.page.link</string>
    </array>
</dict>
</plist>
```

### 3. Update `ios/Runner.xcodeproj/project.pbxproj`

Add the entitlements file to your Xcode project:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Select Runner target
3. Go to Signing & Capabilities
4. Add "Associated Domains" capability
5. Add domains: `applinks:lawyerservices.app`

---

## 🔗 Deep Link Implementation

### 1. Create `lib/services/deep_link_service.dart`

```dart
import 'dart:async';
import 'package:app_links/app_links.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

class DeepLinkService {
  static final DeepLinkService _instance = DeepLinkService._internal();
  factory DeepLinkService() => _instance;
  DeepLinkService._internal();

  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _linkSubscription;
  GoRouter? _router;

  void initialize(GoRouter router) {
    _router = router;
    _listenToLinks();
  }

  void _listenToLinks() {
    _linkSubscription = _appLinks.uriLinkStream.listen(
      (Uri uri) {
        _handleDeepLink(uri);
      },
      onError: (err) {
        print('Deep link error: $err');
      },
    );
  }

  void _handleDeepLink(Uri uri) {
    print('🔗 Deep link received: $uri');
    
    final path = uri.path;
    final queryParams = uri.queryParameters;
    
    switch (path) {
      case '/':
        _router?.go('/');
        break;
        
      case '/login':
        _router?.go('/login');
        break;
        
      case '/register':
        _router?.go('/register');
        break;
        
      case '/home':
        _router?.go('/home');
        break;
        
      case '/services':
        _router?.go('/services');
        break;
        
      case '/service':
        final serviceId = queryParams['id'];
        if (serviceId != null) {
          _router?.go('/service/$serviceId');
        }
        break;
        
      case '/chat':
        final userId = queryParams['user'];
        if (userId != null) {
          _router?.go('/chat/$userId');
        }
        break;
        
      case '/profile':
        _router?.go('/profile');
        break;
        
      case '/lawyer':
        final lawyerId = queryParams['id'];
        if (lawyerId != null) {
          _router?.go('/lawyer/$lawyerId');
        }
        break;
        
      default:
        print('Unknown deep link: $path');
        _router?.go('/');
    }
  }

  // Generate deep links
  String generateServiceLink(String serviceId) {
    return 'https://lawyerservices.app/service?id=$serviceId';
  }

  String generateChatLink(String userId) {
    return 'https://lawyerservices.app/chat?user=$userId';
  }

  String generateLawyerLink(String lawyerId) {
    return 'https://lawyerservices.app/lawyer?id=$lawyerId';
  }

  String generateShareLink(String type, String id) {
    switch (type) {
      case 'service':
        return generateServiceLink(id);
      case 'chat':
        return generateChatLink(id);
      case 'lawyer':
        return generateLawyerLink(id);
      default:
        return 'https://lawyerservices.app/';
    }
  }

  // Share content
  Future<void> shareContent(String type, String id, String title, String description) async {
    final link = generateShareLink(type, id);
    final shareText = '$title\n\n$description\n\n$link';
    
    // Use share_plus package
    await Share.share(shareText);
  }

  // Launch external URLs
  Future<void> launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      print('Could not launch $url');
    }
  }

  void dispose() {
    _linkSubscription?.cancel();
  }
}
```

### 2. Update `lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'services/deep_link_service.dart';
import 'providers/auth_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/services/services_screen.dart';
import 'screens/chat/chat_screen.dart';
import 'screens/profile/profile_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp.router(
        title: 'Lawyer Services',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        routerConfig: _router,
      ),
    );
  }

  final GoRouter _router = GoRouter(
    initialLocation: '/',
    routes: [
      // Public routes
      GoRoute(
        path: '/',
        builder: (context, state) => HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => RegisterScreen(),
      ),
      
      // Protected routes
      GoRoute(
        path: '/home',
        builder: (context, state) => HomeScreen(),
      ),
      GoRoute(
        path: '/services',
        builder: (context, state) => ServicesScreen(),
      ),
      GoRoute(
        path: '/service/:id',
        builder: (context, state) => ServiceDetailScreen(
          serviceId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/chat/:userId',
        builder: (context, state) => ChatScreen(
          userId: state.pathParameters['userId']!,
        ),
      ),
      GoRoute(
        path: '/lawyer/:id',
        builder: (context, state) => LawyerProfileScreen(
          lawyerId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => ProfileScreen(),
      ),
    ],
  );
}

class AppInitializer extends StatefulWidget {
  final Widget child;
  
  const AppInitializer({Key? key, required this.child}) : super(key: key);

  @override
  _AppInitializerState createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  @override
  void initState() {
    super.initState();
    _initializeDeepLinks();
  }

  void _initializeDeepLinks() {
    // Initialize deep link service
    final deepLinkService = DeepLinkService();
    deepLinkService.initialize(_router);
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
```

### 3. Create `lib/screens/deep_link_handler.dart`

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/deep_link_service.dart';

class DeepLinkHandler extends StatefulWidget {
  final Widget child;
  
  const DeepLinkHandler({Key? key, required this.child}) : super(key: key);

  @override
  _DeepLinkHandlerState createState() => _DeepLinkHandlerState();
}

class _DeepLinkHandlerState extends State<DeepLinkHandler> {
  final DeepLinkService _deepLinkService = DeepLinkService();

  @override
  void initState() {
    super.initState();
    _initializeDeepLinks();
  }

  void _initializeDeepLinks() {
    // Handle app launch from deep link
    _handleInitialLink();
  }

  Future<void> _handleInitialLink() async {
    // Check if app was launched from deep link
    final initialLink = await _deepLinkService.getInitialLink();
    if (initialLink != null) {
      _deepLinkService.handleDeepLink(initialLink);
    }
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
```

---

## 🔗 URL Schemes

### Supported Deep Link URLs

#### 1. **App Navigation**
```
https://lawyerservices.app/
https://lawyerservices.app/login
https://lawyerservices.app/register
https://lawyerservices.app/home
https://lawyerservices.app/profile
```

#### 2. **Services**
```
https://lawyerservices.app/services
https://lawyerservices.app/service?id=SERVICE_ID
```

#### 3. **Chat/Messaging**
```
https://lawyerservices.app/chat?user=USER_ID
```

#### 4. **Lawyer Profiles**
```
https://lawyerservices.app/lawyer?id=LAWYER_ID
```

#### 5. **Custom URL Schemes**
```
lawyerservices://service/SERVICE_ID
lawyerservices://chat/USER_ID
lawyerservices://lawyer/LAWYER_ID
```

---

## 🧪 Testing Deep Links

### 1. **Android Testing**

#### Using ADB
```bash
# Test custom URL scheme
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "lawyerservices://service/123" \
  com.lawyerservices.app

# Test app links
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "https://lawyerservices.app/service?id=123" \
  com.lawyerservices.app
```

#### Using Browser
1. Open browser on device
2. Navigate to: `https://lawyerservices.app/service?id=123`
3. Should open app directly

### 2. **iOS Testing**

#### Using Simulator
```bash
# Test custom URL scheme
xcrun simctl openurl booted "lawyerservices://service/123"

# Test universal links
xcrun simctl openurl booted "https://lawyerservices.app/service?id=123"
```

#### Using Safari
1. Open Safari on device
2. Navigate to: `https://lawyerservices.app/service?id=123`
3. Should open app directly

### 3. **Flutter Testing**

```dart
// Test deep link handling
void testDeepLinks() {
  final deepLinkService = DeepLinkService();
  
  // Test service link
  final serviceLink = deepLinkService.generateServiceLink('123');
  print('Service link: $serviceLink');
  
  // Test chat link
  final chatLink = deepLinkService.generateChatLink('user123');
  print('Chat link: $chatLink');
}
```

---

## 🚀 Production Setup

### 1. **Domain Configuration**

#### Create `public/.well-known/assetlinks.json`
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.lawyerservices.app",
    "sha256_cert_fingerprints": ["YOUR_PRODUCTION_SHA256_FINGERPRINT"]
  }
}]
```

#### Create `public/.well-known/apple-app-site-association`
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.lawyerservices.app",
        "paths": ["*"]
      }
    ]
  }
}
```

### 2. **Firebase Dynamic Links (Optional)**

#### Setup Firebase Project
1. Create Firebase project
2. Enable Dynamic Links
3. Configure domain: `lawyerservices.page.link`

#### Add to Flutter
```dart
// Initialize Firebase Dynamic Links
FirebaseDynamicLinks.instance.onLink.listen((dynamicLink) {
  final Uri deepLink = dynamicLink.link;
  if (deepLink != null) {
    // Handle dynamic link
    _handleDynamicLink(deepLink);
  }
});
```

### 3. **Backend Integration**

#### Add Deep Link Endpoints to Backend
```javascript
// Add to your backend API
app.get('/service/:id', (req, res) => {
  const serviceId = req.params.id;
  // Return service data or redirect to app
  res.json({
    success: true,
    serviceId: serviceId,
    appLink: `lawyerservices://service/${serviceId}`,
    webLink: `https://lawyerservices.app/service?id=${serviceId}`
  });
});
```

---

## 📱 Usage Examples

### 1. **Share Service**
```dart
// Share a service
await deepLinkService.shareContent(
  'service',
  'service123',
  'Family Law Consultation',
  'Expert family law services with 10+ years experience'
);
```

### 2. **Open Chat**
```dart
// Open chat with specific user
final chatLink = deepLinkService.generateChatLink('user123');
await deepLinkService.launchUrl(chatLink);
```

### 3. **Handle Notifications**
```dart
// Handle push notification with deep link
void handleNotificationTap(String payload) {
  final uri = Uri.parse(payload);
  deepLinkService.handleDeepLink(uri);
}
```

---

## 🔧 Troubleshooting

### Common Issues

1. **Deep links not working on Android**
   - Check `AndroidManifest.xml` configuration
   - Verify `asset_links.json` is accessible
   - Test with `adb` commands

2. **Universal links not working on iOS**
   - Check Associated Domains configuration
   - Verify `apple-app-site-association` file
   - Test in Safari first

3. **Custom URL schemes not working**
   - Check URL scheme registration
   - Test with device/simulator
   - Verify app is installed

### Debug Tips

```dart
// Add debug logging
void _handleDeepLink(Uri uri) {
  print('🔗 Deep link received: $uri');
  print('Path: ${uri.path}');
  print('Query: ${uri.queryParameters}');
  
  // Handle the link
  // ...
}
```

---

## 📚 Resources

- [Flutter Deep Linking Guide](https://docs.flutter.dev/development/ui/navigation/deep-linking)
- [Android App Links](https://developer.android.com/training/app-links)
- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
- [Firebase Dynamic Links](https://firebase.google.com/docs/dynamic-links)

---

**Your Lawyer Services app now supports comprehensive deep linking! 🎉**

Users can share services, open specific chats, and navigate directly to features using URLs.

