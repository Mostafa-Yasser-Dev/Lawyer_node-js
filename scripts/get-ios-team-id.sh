#!/bin/bash

# Script to get iOS Team ID for deep linking
# Run this script from the project root directory

echo "🍎 Getting iOS Team ID for Deep Linking"
echo "======================================="

# Check if we're in the right directory
if [ ! -d "ios" ]; then
    echo "❌ Error: Please run this script from the Flutter project root directory"
    echo "   Expected to find 'ios' directory"
    exit 1
fi

echo "📱 iOS Team ID Methods:"
echo "======================="

echo ""
echo "Method 1: Using Xcode (Recommended)"
echo "-----------------------------------"
echo "1. Open ios/Runner.xcworkspace in Xcode"
echo "2. Select your project in the navigator"
echo "3. Go to 'Signing & Capabilities' tab"
echo "4. Look for 'Team' - the Team ID is shown in parentheses"
echo "5. Example: 'Your Name (ABC123DEF4)'"
echo ""

echo "Method 2: Using Apple Developer Portal"
echo "--------------------------------------"
echo "1. Go to https://developer.apple.com/account/"
echo "2. Sign in with your Apple ID"
echo "3. Go to 'Certificates, Identifiers & Profiles'"
echo "4. Your Team ID is displayed at the top of the page"
echo ""

echo "Method 3: Using Terminal (if Xcode is installed)"
echo "------------------------------------------------"
echo "Run this command:"
echo "security find-identity -v -p codesigning"
echo ""

# Try to get Team ID from project.pbxproj if it exists
if [ -f "ios/Runner.xcodeproj/project.pbxproj" ]; then
    echo "🔍 Checking project.pbxproj for Team ID..."
    TEAM_ID=$(grep -o 'DEVELOPMENT_TEAM = [A-Z0-9]*' ios/Runner.xcodeproj/project.pbxproj | head -1 | cut -d' ' -f3)
    
    if [ -n "$TEAM_ID" ]; then
        echo "✅ Found Team ID in project: $TEAM_ID"
    else
        echo "❌ No Team ID found in project.pbxproj"
    fi
else
    echo "❌ Could not find ios/Runner.xcodeproj/project.pbxproj"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Get your Team ID using one of the methods above"
echo "2. Update public/.well-known/apple-app-site-association with your Team ID"
echo "3. Update ios/Runner/Info.plist with your bundle identifier"
echo "4. Deploy to your domain"
echo ""
echo "🔗 Test your apple-app-site-association file:"
echo "   https://yourdomain.com/.well-known/apple-app-site-association"
echo ""
echo "📱 Bundle Identifier:"
echo "   Check ios/Runner/Info.plist for CFBundleIdentifier"
echo "   Example: com.example.lawyer_app"
