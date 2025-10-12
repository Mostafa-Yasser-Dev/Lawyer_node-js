#!/bin/bash

# Script to get Android SHA256 fingerprints for deep linking
# Run this script from the project root directory

echo "🔍 Getting Android SHA256 Fingerprints for Deep Linking"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "android" ]; then
    echo "❌ Error: Please run this script from the Flutter project root directory"
    echo "   Expected to find 'android' directory"
    exit 1
fi

echo "📱 Debug Keystore Fingerprint:"
echo "------------------------------"

# Get debug keystore fingerprint
DEBUG_FINGERPRINT=$(keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep "SHA256" | head -1 | cut -d' ' -f3)

if [ -n "$DEBUG_FINGERPRINT" ]; then
    echo "✅ Debug SHA256: $DEBUG_FINGERPRINT"
else
    echo "❌ Could not get debug fingerprint"
    echo "   Make sure Java is installed and debug keystore exists"
fi

echo ""
echo "📱 Release Keystore Fingerprint:"
echo "--------------------------------"

# Check if release keystore exists
if [ -f "android/app/release.keystore" ]; then
    echo "Found release.keystore file"
    echo "To get release fingerprint, run:"
    echo "keytool -list -v -keystore android/app/release.keystore -alias your_key_alias"
    echo ""
    echo "Replace 'your_key_alias' with your actual key alias"
else
    echo "❌ No release keystore found at android/app/release.keystore"
    echo "   Create a release keystore first:"
    echo "   keytool -genkey -v -keystore android/app/release.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Copy the debug SHA256 above"
echo "2. If you have a release keystore, get its SHA256"
echo "3. Update public/.well-known/assetlinks.json with both fingerprints"
echo "4. Deploy to your domain"
echo ""
echo "🔗 Test your assetlinks.json file:"
echo "   https://yourdomain.com/.well-known/assetlinks.json"
