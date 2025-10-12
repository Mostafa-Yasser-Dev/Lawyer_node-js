# PowerShell script to get Android SHA256 fingerprints for deep linking
# Run this script from the project root directory

Write-Host "🔍 Getting Android SHA256 Fingerprints for Deep Linking" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "android")) {
    Write-Host "❌ Error: Please run this script from the Flutter project root directory" -ForegroundColor Red
    Write-Host "   Expected to find 'android' directory" -ForegroundColor Red
    exit 1
}

Write-Host "📱 Debug Keystore Fingerprint:" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow

# Get debug keystore fingerprint
$debugKeystorePath = "$env:USERPROFILE\.android\debug.keystore"

if (Test-Path $debugKeystorePath) {
    try {
        $debugFingerprint = keytool -list -v -keystore $debugKeystorePath -alias androiddebugkey -storepass android -keypass android 2>$null | Select-String "SHA256" | Select-Object -First 1
        
        if ($debugFingerprint) {
            $fingerprint = ($debugFingerprint.ToString() -split "SHA256: ")[1]
            Write-Host "✅ Debug SHA256: $fingerprint" -ForegroundColor Green
        } else {
            Write-Host "❌ Could not extract SHA256 from debug keystore" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error running keytool. Make sure Java is installed" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Debug keystore not found at $debugKeystorePath" -ForegroundColor Red
    Write-Host "   Run 'flutter build apk' first to generate the debug keystore" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📱 Release Keystore Fingerprint:" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow

# Check if release keystore exists
if (Test-Path "android/app/release.keystore") {
    Write-Host "Found release.keystore file" -ForegroundColor Green
    Write-Host "To get release fingerprint, run:" -ForegroundColor Yellow
    Write-Host "keytool -list -v -keystore android/app/release.keystore -alias your_key_alias" -ForegroundColor White
    Write-Host ""
    Write-Host "Replace 'your_key_alias' with your actual key alias" -ForegroundColor Yellow
} else {
    Write-Host "❌ No release keystore found at android/app/release.keystore" -ForegroundColor Red
    Write-Host "   Create a release keystore first:" -ForegroundColor Yellow
    Write-Host "   keytool -genkey -v -keystore android/app/release.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host "1. Copy the debug SHA256 above" -ForegroundColor White
Write-Host "2. If you have a release keystore, get its SHA256" -ForegroundColor White
Write-Host "3. Update public/.well-known/assetlinks.json with both fingerprints" -ForegroundColor White
Write-Host "4. Deploy to your domain" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Test your assetlinks.json file:" -ForegroundColor Cyan
Write-Host "   https://yourdomain.com/.well-known/assetlinks.json" -ForegroundColor White
