# PowerShell script to get iOS Team ID for deep linking
# Run this script from the project root directory

Write-Host "🍎 Getting iOS Team ID for Deep Linking" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "ios")) {
    Write-Host "❌ Error: Please run this script from the Flutter project root directory" -ForegroundColor Red
    Write-Host "   Expected to find 'ios' directory" -ForegroundColor Red
    exit 1
}

Write-Host "📱 iOS Team ID Methods:" -ForegroundColor Yellow
Write-Host "=======================" -ForegroundColor Yellow

Write-Host ""
Write-Host "Method 1: Using Xcode (Recommended)" -ForegroundColor Green
Write-Host "-----------------------------------" -ForegroundColor Green
Write-Host "1. Open ios/Runner.xcworkspace in Xcode" -ForegroundColor White
Write-Host "2. Select your project in the navigator" -ForegroundColor White
Write-Host "3. Go to 'Signing & Capabilities' tab" -ForegroundColor White
Write-Host "4. Look for 'Team' - the Team ID is shown in parentheses" -ForegroundColor White
Write-Host "5. Example: 'Your Name (ABC123DEF4)'" -ForegroundColor White
Write-Host ""

Write-Host "Method 2: Using Apple Developer Portal" -ForegroundColor Green
Write-Host "--------------------------------------" -ForegroundColor Green
Write-Host "1. Go to https://developer.apple.com/account/" -ForegroundColor White
Write-Host "2. Sign in with your Apple ID" -ForegroundColor White
Write-Host "3. Go to 'Certificates, Identifiers & Profiles'" -ForegroundColor White
Write-Host "4. Your Team ID is displayed at the top of the page" -ForegroundColor White
Write-Host ""

Write-Host "Method 3: Using Terminal (if Xcode is installed)" -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host "Run this command:" -ForegroundColor White
Write-Host "security find-identity -v -p codesigning" -ForegroundColor White
Write-Host ""

# Try to get Team ID from project.pbxproj if it exists
if (Test-Path "ios/Runner.xcodeproj/project.pbxproj") {
    Write-Host "🔍 Checking project.pbxproj for Team ID..." -ForegroundColor Yellow
    
    $content = Get-Content "ios/Runner.xcodeproj/project.pbxproj" -Raw
    $teamIdMatch = [regex]::Match($content, 'DEVELOPMENT_TEAM = ([A-Z0-9]+)')
    
    if ($teamIdMatch.Success) {
        $teamId = $teamIdMatch.Groups[1].Value
        Write-Host "✅ Found Team ID in project: $teamId" -ForegroundColor Green
    } else {
        Write-Host "❌ No Team ID found in project.pbxproj" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Could not find ios/Runner.xcodeproj/project.pbxproj" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host "1. Get your Team ID using one of the methods above" -ForegroundColor White
Write-Host "2. Update public/.well-known/apple-app-site-association with your Team ID" -ForegroundColor White
Write-Host "3. Update ios/Runner/Info.plist with your bundle identifier" -ForegroundColor White
Write-Host "4. Deploy to your domain" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Test your apple-app-site-association file:" -ForegroundColor Cyan
Write-Host "   https://yourdomain.com/.well-known/apple-app-site-association" -ForegroundColor White
Write-Host ""
Write-Host "📱 Bundle Identifier:" -ForegroundColor Cyan
Write-Host "   Check ios/Runner/Info.plist for CFBundleIdentifier" -ForegroundColor White
Write-Host "   Example: com.example.lawyer_app" -ForegroundColor White
