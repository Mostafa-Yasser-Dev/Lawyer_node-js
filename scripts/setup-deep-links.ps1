# PowerShell script to setup deep linking for Lawyer Services app
# Run this script from the project root directory

Write-Host "🔗 Setting up Deep Linking for Lawyer Services App" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "public/.well-known")) {
    Write-Host "❌ Error: .well-known directory not found" -ForegroundColor Red
    Write-Host "   Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Configuration Checklist:" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

# Check if files exist
$assetLinksExists = Test-Path "public/.well-known/assetlinks.json"
$appleAppSiteExists = Test-Path "public/.well-known/apple-app-site-association"

if ($assetLinksExists) {
    Write-Host "✅ assetlinks.json exists" -ForegroundColor Green
} else {
    Write-Host "❌ assetlinks.json not found" -ForegroundColor Red
}

if ($appleAppSiteExists) {
    Write-Host "✅ apple-app-site-association exists" -ForegroundColor Green
} else {
    Write-Host "❌ apple-app-site-association not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Configuration Steps:" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. 🤖 Android Configuration:" -ForegroundColor Yellow
Write-Host "   - Get SHA256 fingerprints using: .\scripts\get-android-fingerprints.ps1" -ForegroundColor White
Write-Host "   - Update public/.well-known/assetlinks.json" -ForegroundColor White
Write-Host "   - Update android/app/src/main/AndroidManifest.xml" -ForegroundColor White

Write-Host ""
Write-Host "2. 🍎 iOS Configuration:" -ForegroundColor Yellow
Write-Host "   - Get Team ID using: .\scripts\get-ios-team-id.ps1" -ForegroundColor White
Write-Host "   - Update public/.well-known/apple-app-site-association" -ForegroundColor White
Write-Host "   - Update ios/Runner/Info.plist" -ForegroundColor White
Write-Host "   - Configure Associated Domains in Xcode" -ForegroundColor White

Write-Host ""
Write-Host "3. 🌐 Domain Configuration:" -ForegroundColor Yellow
Write-Host "   - Update domain in all configuration files" -ForegroundColor White
Write-Host "   - Deploy files to your domain" -ForegroundColor White
Write-Host "   - Test accessibility of .well-known files" -ForegroundColor White

Write-Host ""
Write-Host "🧪 Testing Commands:" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Android Testing:" -ForegroundColor Yellow
Write-Host "adb shell am start -W -a android.intent.action.VIEW -d `"https://yourdomain.com/service?id=123`" com.example.lawyer_app" -ForegroundColor White
Write-Host "adb shell am start -W -a android.intent.action.VIEW -d `"lawyerservices://service/123`" com.example.lawyer_app" -ForegroundColor White

Write-Host ""
Write-Host "iOS Testing:" -ForegroundColor Yellow
Write-Host "xcrun simctl openurl booted `"https://yourdomain.com/service?id=123`"" -ForegroundColor White
Write-Host "xcrun simctl openurl booted `"lawyerservices://service/123`"" -ForegroundColor White

Write-Host ""
Write-Host "🔗 Test URLs:" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host "https://yourdomain.com/.well-known/assetlinks.json" -ForegroundColor White
Write-Host "https://yourdomain.com/.well-known/apple-app-site-association" -ForegroundColor White

Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "📖 DEEP_LINK_CONFIGURATION_GUIDE.md - Complete setup guide" -ForegroundColor White
Write-Host "📖 DEEP_LINKING_SETUP.md - Detailed implementation guide" -ForegroundColor White
Write-Host "📖 FLUTTER_INTEGRATION_GUIDE.md - Flutter integration" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Ready to configure deep linking!" -ForegroundColor Green
Write-Host "   Run the individual scripts to get your fingerprints and Team ID" -ForegroundColor White
