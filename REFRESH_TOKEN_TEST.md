# Refresh Token Testing Guide

## 🔧 **Fixed Issues:**

1. **Database Query**: Fixed the refresh token lookup
2. **Token Validation**: Added proper token existence check
3. **Async Methods**: Made all User model methods async
4. **Error Handling**: Improved error messages

## 🧪 **Test the Refresh Token Functionality**

### **Step 1: Register a User**
```bash
curl -X POST https://lawyer-node-js.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...",
  "user": {
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### **Step 2: Test Token Refresh**
```bash
curl -X POST https://lawyer-node-js.vercel.app/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "NEW_REFRESH_TOKEN_HERE"
}
```

### **Step 3: Test Invalid Refresh Token**
```bash
curl -X POST https://lawyer-node-js.vercel.app/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid_token"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

## 🔧 **Flutter Integration Test**

### **Updated Flutter API Service:**
```dart
class ApiService {
  static String? _accessToken;
  static String? _refreshToken;

  // Test refresh token functionality
  static Future<bool> testRefreshToken() async {
    if (_refreshToken == null) return false;

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': _refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          await saveTokens(data['token'], data['refreshToken']);
          return true;
        }
      }
    } catch (e) {
      print('Token refresh failed: $e');
    }

    return false;
  }
}
```

## 🎯 **What Was Fixed:**

### **1. Database Query Issue**
- **Before**: Direct array manipulation
- **After**: Using proper Mongoose methods

### **2. Token Validation**
- **Before**: No token existence check
- **After**: Proper token validation before refresh

### **3. Async Methods**
- **Before**: Synchronous methods
- **After**: All methods are async for proper database operations

### **4. Error Handling**
- **Before**: Generic error messages
- **After**: Specific error messages for different scenarios

## 🚀 **Deploy the Fixes**

```bash
git add .
git commit -m "Fix refresh token functionality"
git push
```

## ✅ **Test Results Expected:**

1. **Registration**: Returns both access and refresh tokens
2. **Token Refresh**: Successfully generates new tokens
3. **Invalid Token**: Returns proper error message
4. **Token Rotation**: Old refresh token becomes invalid
5. **Multiple Devices**: Each device gets its own refresh token

Your refresh token functionality should now work perfectly! 🎯
