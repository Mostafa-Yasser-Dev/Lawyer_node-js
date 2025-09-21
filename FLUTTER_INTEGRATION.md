# Flutter Integration Guide

This guide will help you integrate the Lawyer Services Backend API with your Flutter mobile application.

## API Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-app-name.vercel.app`

## Flutter Dependencies

Add these dependencies to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  shared_preferences: ^2.2.2
  provider: ^6.1.1
  dio: ^5.3.2
  flutter_secure_storage: ^9.0.0
```

## API Service Class

Create `lib/services/api_service.dart`:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://your-app-name.vercel.app/api';
  static String? _token;

  // Initialize token from storage
  static Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
  }

  // Save token to storage
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    _token = token;
  }

  // Clear token
  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    _token = null;
  }

  // Get headers with auth token
  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  // Authentication endpoints
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _headers,
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        if (phone != null) 'phone': phone,
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> logout() async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/logout'),
      headers: _headers,
    );
    await clearToken();
    return jsonDecode(response.body);
  }

  // Services endpoints
  static Future<Map<String, dynamic>> getServices({
    String? category,
    int page = 1,
    int limit = 10,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      if (category != null) 'category': category,
    };
    
    final uri = Uri.parse('$baseUrl/services').replace(
      queryParameters: queryParams,
    );
    
    final response = await http.get(uri, headers: _headers);
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getService(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/services/$id'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getCategories() async {
    final response = await http.get(
      Uri.parse('$baseUrl/services/categories'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  // Messages endpoints
  static Future<Map<String, dynamic>> getConversations() async {
    final response = await http.get(
      Uri.parse('$baseUrl/messages'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getMessages(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/messages/$userId'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> sendMessage({
    required String receiverId,
    required String content,
    String messageType = 'text',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/messages'),
      headers: _headers,
      body: jsonEncode({
        'receiverId': receiverId,
        'content': content,
        'messageType': messageType,
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> sendServiceRequest({
    required String serviceId,
    required String caseDetails,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/messages/service-request'),
      headers: _headers,
      body: jsonEncode({
        'serviceId': serviceId,
        'caseDetails': caseDetails,
      }),
    );
    return jsonDecode(response.body);
  }

  // User endpoints
  static Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? phone,
    String? avatar,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/users/profile'),
      headers: _headers,
      body: jsonEncode({
        if (name != null) 'name': name,
        if (phone != null) 'phone': phone,
        if (avatar != null) 'avatar': avatar,
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getServiceRequests() async {
    final response = await http.get(
      Uri.parse('$baseUrl/users/service-requests'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  // Lawyer endpoints
  static Future<Map<String, dynamic>> getLawyerDashboard() async {
    final response = await http.get(
      Uri.parse('$baseUrl/lawyers/dashboard'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getLawyerServiceRequests({
    String? status,
  }) async {
    final queryParams = <String, String>{};
    if (status != null) queryParams['status'] = status;
    
    final uri = Uri.parse('$baseUrl/lawyers/service-requests').replace(
      queryParameters: queryParams,
    );
    
    final response = await http.get(uri, headers: _headers);
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> updateServiceRequestStatus({
    required String requestId,
    required String status,
    String? notes,
    double? estimatedCost,
    DateTime? scheduledDate,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/lawyers/service-requests/$requestId/status'),
      headers: _headers,
      body: jsonEncode({
        'status': status,
        if (notes != null) 'notes': notes,
        if (estimatedCost != null) 'estimatedCost': estimatedCost,
        if (scheduledDate != null) 'scheduledDate': scheduledDate.toIso8601String(),
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getLawyerClients() async {
    final response = await http.get(
      Uri.parse('$baseUrl/lawyers/clients'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }
}
```

## Data Models

Create `lib/models/user.dart`:

```dart
class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? phone;
  final String? avatar;
  final bool isActive;
  final DateTime? lastLogin;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
    this.avatar,
    required this.isActive,
    this.lastLogin,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      name: json['name'],
      email: json['email'],
      role: json['role'],
      phone: json['phone'],
      avatar: json['avatar'],
      isActive: json['isActive'],
      lastLogin: json['lastLogin'] != null 
          ? DateTime.parse(json['lastLogin']) 
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}
```

Create `lib/models/service.dart`:

```dart
class Service {
  final String id;
  final String title;
  final String description;
  final String category;
  final String lawyerId;
  final User? lawyer;
  final String? image;
  final bool isActive;
  final List<String> tags;
  final double? price;
  final double? consultationFee;
  final DateTime createdAt;
  final DateTime updatedAt;

  Service({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.lawyerId,
    this.lawyer,
    this.image,
    required this.isActive,
    required this.tags,
    this.price,
    this.consultationFee,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['_id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      lawyerId: json['lawyer'],
      lawyer: json['lawyer'] is Map 
          ? User.fromJson(json['lawyer']) 
          : null,
      image: json['image'],
      isActive: json['isActive'],
      tags: List<String>.from(json['tags'] ?? []),
      price: json['price']?.toDouble(),
      consultationFee: json['consultationFee']?.toDouble(),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}
```

Create `lib/models/message.dart`:

```dart
class Message {
  final String id;
  final String senderId;
  final String receiverId;
  final User? sender;
  final User? receiver;
  final String content;
  final String messageType;
  final bool isRead;
  final DateTime? readAt;
  final Map<String, dynamic>? serviceRequest;
  final DateTime createdAt;
  final DateTime updatedAt;

  Message({
    required this.id,
    required this.senderId,
    required this.receiverId,
    this.sender,
    this.receiver,
    required this.content,
    required this.messageType,
    required this.isRead,
    this.readAt,
    this.serviceRequest,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['_id'],
      senderId: json['sender'],
      receiverId: json['receiver'],
      sender: json['sender'] is Map 
          ? User.fromJson(json['sender']) 
          : null,
      receiver: json['receiver'] is Map 
          ? User.fromJson(json['receiver']) 
          : null,
      content: json['content'],
      messageType: json['messageType'],
      isRead: json['isRead'],
      readAt: json['readAt'] != null 
          ? DateTime.parse(json['readAt']) 
          : null,
      serviceRequest: json['serviceRequest'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}
```

## Authentication Provider

Create `lib/providers/auth_provider.dart`:

```dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/user.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<void> initialize() async {
    await ApiService.initialize();
    await _loadUser();
  }

  Future<void> _loadUser() async {
    try {
      final response = await ApiService.getProfile();
      if (response['success']) {
        _user = User.fromJson(response['user']);
        notifyListeners();
      }
    } catch (e) {
      // User not authenticated
      _user = null;
    }
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.login(
        email: email,
        password: password,
      );

      if (response['success']) {
        await ApiService.saveToken(response['token']);
        _user = User.fromJson(response['user']);
        notifyListeners();
        return true;
      } else {
        _setError(response['message']);
        return false;
      }
    } catch (e) {
      _setError('Login failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
      );

      if (response['success']) {
        await ApiService.saveToken(response['token']);
        _user = User.fromJson(response['user']);
        notifyListeners();
        return true;
      } else {
        _setError(response['message']);
        return false;
      }
    } catch (e) {
      _setError('Registration failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    try {
      await ApiService.logout();
    } catch (e) {
      // Ignore logout errors
    } finally {
      _user = null;
      notifyListeners();
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }
}
```

## Usage Examples

### Login Screen

```dart
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          if (authProvider.isLoading) {
            return Center(child: CircularProgressIndicator());
          }

          return Padding(
            padding: EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(labelText: 'Email'),
                    validator: (value) {
                      if (value?.isEmpty ?? true) return 'Email is required';
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(labelText: 'Password'),
                    obscureText: true,
                    validator: (value) {
                      if (value?.isEmpty ?? true) return 'Password is required';
                      return null;
                    },
                  ),
                  SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        final success = await authProvider.login(
                          _emailController.text,
                          _passwordController.text,
                        );
                        
                        if (success) {
                          Navigator.pushReplacementNamed(context, '/home');
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(authProvider.error ?? 'Login failed')),
                          );
                        }
                      }
                    },
                    child: Text('Login'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
```

### Services List

```dart
class ServicesScreen extends StatefulWidget {
  @override
  _ServicesScreenState createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  List<Service> _services = [];
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  Future<void> _loadServices() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await ApiService.getServices();
      if (response['success']) {
        setState(() {
          _services = (response['data'] as List)
              .map((json) => Service.fromJson(json))
              .toList();
        });
      } else {
        setState(() {
          _error = response['message'];
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load services: ${e.toString()}';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Legal Services')),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : ListView.builder(
                  itemCount: _services.length,
                  itemBuilder: (context, index) {
                    final service = _services[index];
                    return Card(
                      child: ListTile(
                        title: Text(service.title),
                        subtitle: Text(service.description),
                        trailing: ElevatedButton(
                          onPressed: () {
                            // Navigate to service details or request service
                          },
                          child: Text('Request Service'),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
```

## Main App Setup

Update your `main.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiService.initialize();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => AuthProvider()..initialize(),
      child: MaterialApp(
        title: 'Lawyer Services',
        home: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            if (authProvider.isAuthenticated) {
              return HomeScreen();
            } else {
              return LoginScreen();
            }
          },
        ),
        routes: {
          '/login': (context) => LoginScreen(),
          '/home': (context) => HomeScreen(),
          '/services': (context) => ServicesScreen(),
          '/messages': (context) => MessagesScreen(),
          '/profile': (context) => ProfileScreen(),
        },
      ),
    );
  }
}
```

## Error Handling

Create `lib/utils/error_handler.dart`:

```dart
class ErrorHandler {
  static String getErrorMessage(dynamic error) {
    if (error is Map<String, dynamic>) {
      return error['message'] ?? 'An error occurred';
    }
    return error.toString();
  }

  static void showError(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  static void showSuccess(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }
}
```

## Testing the Integration

1. **Test Authentication**:
   - Register a new user
   - Login with credentials
   - Check if user data is loaded

2. **Test Services**:
   - Load services list
   - View service details
   - Test service requests

3. **Test Messages**:
   - Send messages
   - Receive messages
   - Test service requests

4. **Test Role-based Access**:
   - Test user permissions
   - Test lawyer admin features

## Production Considerations

1. **Security**:
   - Store JWT tokens securely
   - Implement token refresh
   - Add certificate pinning

2. **Performance**:
   - Implement caching
   - Add offline support
   - Optimize API calls

3. **User Experience**:
   - Add loading states
   - Implement error handling
   - Add pull-to-refresh

Your Flutter app is now ready to integrate with the Lawyer Services Backend! 🚀
