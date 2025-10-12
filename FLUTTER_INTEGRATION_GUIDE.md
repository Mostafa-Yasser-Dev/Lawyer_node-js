# 🚀 Flutter Integration Guide - Lawyer Services Backend

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [API Base Configuration](#api-base-configuration)
3. [Authentication System](#authentication-system)
4. [API Endpoints Documentation](#api-endpoints-documentation)
5. [Flutter Implementation Guide](#flutter-implementation-guide)
6. [Error Handling](#error-handling)
7. [Testing & Debugging](#testing--debugging)
8. [Deployment Notes](#deployment-notes)

---

## 🎯 Project Overview

**Backend URL:** `https://lawyer-node-js.vercel.app`  
**API Documentation:** `https://lawyer-node-js.vercel.app/api-docs`  
**Health Check:** `https://lawyer-node-js.vercel.app/health`

### Key Features
- **Role-based Authentication** (Guest, User, Lawyer/Admin)
- **JWT Token System** with Refresh Tokens
- **Real-time Messaging** between Users and Lawyers
- **Service Management** for Lawyers
- **Service Requests** for Users
- **Secure API** with rate limiting and validation

---

## 🔧 API Base Configuration

### Base URL
```dart
const String BASE_URL = 'https://lawyer-node-js.vercel.app';
const String API_BASE = '$BASE_URL/api';
```

### Headers
```dart
Map<String, String> getHeaders({String? token}) {
  return {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };
}
```

---

## 🔐 Authentication System

### Token Management
- **Access Token:** 15 minutes expiration
- **Refresh Token:** 30 days expiration
- **Auto-refresh:** Implement automatic token refresh
- **Secure Storage:** Use `flutter_secure_storage` for tokens

### Authentication Flow
1. **Register** → Get tokens
2. **Login** → Get tokens
3. **Auto-refresh** → When access token expires
4. **Logout** → Clear all tokens

---

## 📚 API Endpoints Documentation

### 🔍 Health & Status Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

#### Database Test
```http
GET /test-db
```
**Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1234567890"
  }
}
```

#### Login User
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer TOKEN`
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1234567890"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```
**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

#### Logout
```http
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer TOKEN`
**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout All Devices
```http
POST /api/auth/logout-all
```
**Headers:** `Authorization: Bearer TOKEN`

### 👥 User Management Endpoints

#### Get All Users (Admin Only)
```http
GET /api/users
```
**Headers:** `Authorization: Bearer ADMIN_TOKEN`

#### Get User by ID (Admin Only)
```http
GET /api/users/{userId}
```
**Headers:** `Authorization: Bearer ADMIN_TOKEN`

#### Update User Profile
```http
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer TOKEN`
**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210"
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users/{userId}
```
**Headers:** `Authorization: Bearer ADMIN_TOKEN`

### 💼 Service Management Endpoints

#### Get All Services
```http
GET /api/services
```
**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": "service_id",
      "title": "Family Law Consultation",
      "description": "Expert family law services",
      "category": "Family Law",
      "price": 150,
      "duration": "1 hour",
      "lawyer": {
        "id": "lawyer_id",
        "name": "Lawyer Name"
      }
    }
  ]
}
```

#### Get Service by ID
```http
GET /api/services/{serviceId}
```

#### Create Service (Lawyer Only)
```http
POST /api/services
```
**Headers:** `Authorization: Bearer LAWYER_TOKEN`
**Request Body:**
```json
{
  "title": "Family Law Consultation",
  "description": "Expert family law services",
  "category": "Family Law",
  "price": 150,
  "duration": "1 hour"
}
```

#### Update Service (Lawyer Only)
```http
PUT /api/services/{serviceId}
```
**Headers:** `Authorization: Bearer LAWYER_TOKEN`

#### Delete Service (Lawyer Only)
```http
DELETE /api/services/{serviceId}
```
**Headers:** `Authorization: Bearer LAWYER_TOKEN`

### 💬 Messaging Endpoints

#### Get User Messages
```http
GET /api/messages
```
**Headers:** `Authorization: Bearer TOKEN`

#### Get Messages with Specific User
```http
GET /api/messages/{userId}
```
**Headers:** `Authorization: Bearer TOKEN`

#### Send Message
```http
POST /api/messages
```
**Headers:** `Authorization: Bearer TOKEN`
**Request Body:**
```json
{
  "recipientId": "recipient_user_id",
  "content": "Hello, I need legal advice about my case."
}
```

#### Mark Message as Read
```http
PUT /api/messages/{messageId}/read
```
**Headers:** `Authorization: Bearer TOKEN`

### 📊 Service Requests Endpoints

#### Get Service Requests
```http
GET /api/service-requests
```
**Headers:** `Authorization: Bearer TOKEN`

#### Create Service Request (User Only)
```http
POST /api/service-requests
```
**Headers:** `Authorization: Bearer TOKEN`
**Request Body:**
```json
{
  "serviceId": "service_id",
  "message": "I need help with my legal case",
  "urgency": "high"
}
```

#### Update Service Request Status (Lawyer Only)
```http
PUT /api/service-requests/{requestId}
```
**Headers:** `Authorization: Bearer LAWYER_TOKEN`
**Request Body:**
```json
{
  "status": "accepted"
}
```

---

## 🚀 Flutter Implementation Guide

### 1. Project Setup

#### Dependencies (pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.2
  provider: ^6.1.1
  dio: ^5.4.0
  json_annotation: ^4.8.1
  freezed: ^2.4.6
  go_router: ^12.1.3
  flutter_dotenv: ^5.1.0
  socket_io_client: ^2.0.3+1
  flutter_local_notifications: ^16.3.2
  
  # Deep linking
  url_launcher: ^6.2.1
  uni_links: ^0.5.1
  app_links: ^3.4.2
  share_plus: ^7.2.1
  
  # Firebase Dynamic Links (optional)
  firebase_dynamic_links: ^4.3.3

dev_dependencies:
  flutter_test:
    sdk: flutter
  json_serializable: ^6.7.1
  build_runner: ^2.4.7
```

### 2. Environment Configuration

#### Create `.env` file
```env
API_BASE_URL=https://lawyer-node-js.vercel.app
API_BASE=https://lawyer-node-js.vercel.app/api
```

#### Load environment in main.dart
```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  runApp(MyApp());
}
```

### 3. Real-time Messaging with Socket.IO

#### Create `lib/services/socket_service.dart`
```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:async';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? _socket;
  String? _token;
  bool _isConnected = false;
  final StreamController<Map<String, dynamic>> _messageController = StreamController.broadcast();
  final StreamController<Map<String, dynamic>> _notificationController = StreamController.broadcast();
  final StreamController<Map<String, dynamic>> _typingController = StreamController.broadcast();
  final StreamController<Map<String, dynamic>> _statusController = StreamController.broadcast();

  // Getters
  bool get isConnected => _isConnected;
  Stream<Map<String, dynamic>> get messageStream => _messageController.stream;
  Stream<Map<String, dynamic>> get notificationStream => _notificationController.stream;
  Stream<Map<String, dynamic>> get typingStream => _typingController.stream;
  Stream<Map<String, dynamic>> get statusStream => _statusController.stream;

  void initialize(String token) {
    _token = token;
    _connect();
  }

  void _connect() {
    if (_socket != null) {
      _socket!.disconnect();
    }

    _socket = IO.io(
      dotenv.env['API_BASE_URL'] ?? 'https://lawyer-node-js.vercel.app',
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .enableAutoConnect()
        .setAuth({'token': _token})
        .build(),
    );

    _setupEventListeners();
  }

  void _setupEventListeners() {
    _socket!.onConnect((_) {
      print('🔌 Connected to Socket.IO server');
      _isConnected = true;
      _socket!.emit('user_online');
    });

    _socket!.onDisconnect((_) {
      print('🔌 Disconnected from Socket.IO server');
      _isConnected = false;
    });

    _socket!.onConnectError((error) {
      print('❌ Socket connection error: $error');
      _isConnected = false;
    });

    // Message events
    _socket!.on('new_message', (data) {
      print('📨 New message received: $data');
      _messageController.add(data);
    });

    _socket!.on('message_notification', (data) {
      print('🔔 Message notification: $data');
      _notificationController.add(data);
    });

    _socket!.on('message_read', (data) {
      print('✅ Message read: $data');
      _messageController.add({
        'type': 'message_read',
        'data': data
      });
    });

    // Typing events
    _socket!.on('user_typing', (data) {
      print('⌨️ User typing: $data');
      _typingController.add(data);
    });

    // Status events
    _socket!.on('user_status', (data) {
      print('👤 User status: $data');
      _statusController.add(data);
    });

    // Error events
    _socket!.on('error', (data) {
      print('❌ Socket error: $data');
    });
  }

  // Join conversation room
  void joinConversation(String otherUserId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('join_conversation', {'otherUserId': otherUserId});
    }
  }

  // Leave conversation room
  void leaveConversation(String otherUserId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('leave_conversation', {'otherUserId': otherUserId});
    }
  }

  // Send message
  void sendMessage({
    required String recipientId,
    required String content,
    required String messageId,
  }) {
    if (_socket != null && _isConnected) {
      _socket!.emit('send_message', {
        'recipientId': recipientId,
        'content': content,
        'messageId': messageId,
      });
    }
  }

  // Mark message as read
  void markMessageRead(String messageId, String senderId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('mark_message_read', {
        'messageId': messageId,
        'senderId': senderId,
      });
    }
  }

  // Typing indicators
  void startTyping(String recipientId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('typing_start', {'recipientId': recipientId});
    }
  }

  void stopTyping(String recipientId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('typing_stop', {'recipientId': recipientId});
    }
  }

  // Disconnect
  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
      _isConnected = false;
    }
  }

  // Cleanup
  void dispose() {
    disconnect();
    _messageController.close();
    _notificationController.close();
    _typingController.close();
    _statusController.close();
  }
}
```

### 4. API Service Layer

#### Create `lib/services/api_service.dart`
```dart
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late Dio _dio;
  String? _accessToken;
  String? _refreshToken;

  void initialize() {
    _dio = Dio(BaseOptions(
      baseUrl: dotenv.env['API_BASE'] ?? 'https://lawyer-node-js.vercel.app/api',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_accessToken != null) {
          options.headers['Authorization'] = 'Bearer $_accessToken';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expired, try to refresh
          if (await _refreshAccessToken()) {
            // Retry the original request
            final response = await _dio.fetch(error.requestOptions);
            handler.resolve(response);
            return;
          }
        }
        handler.next(error);
      },
    ));
  }

  Future<bool> _refreshAccessToken() async {
    if (_refreshToken == null) return false;
    
    try {
      final response = await _dio.post('/auth/refresh', data: {
        'refreshToken': _refreshToken,
      });
      
      if (response.data['success'] == true) {
        _accessToken = response.data['token'];
        _refreshToken = response.data['refreshToken'];
        return true;
      }
    } catch (e) {
      print('Token refresh failed: $e');
    }
    return false;
  }

  // Authentication methods
  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await _dio.post('/auth/register', data: data);
    if (response.data['success'] == true) {
      _accessToken = response.data['token'];
      _refreshToken = response.data['refreshToken'];
    }
    return response.data;
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> data) async {
    final response = await _dio.post('/auth/login', data: data);
    if (response.data['success'] == true) {
      _accessToken = response.data['token'];
      _refreshToken = response.data['refreshToken'];
    }
    return response.data;
  }

  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await _dio.get('/auth/me');
    return response.data;
  }

  Future<Map<String, dynamic>> logout() async {
    final response = await _dio.post('/auth/logout', data: {
      'refreshToken': _refreshToken,
    });
    _accessToken = null;
    _refreshToken = null;
    return response.data;
  }

  // Service methods
  Future<Map<String, dynamic>> getServices() async {
    final response = await _dio.get('/services');
    return response.data;
  }

  Future<Map<String, dynamic>> createService(Map<String, dynamic> data) async {
    final response = await _dio.post('/services', data: data);
    return response.data;
  }

  // Message methods
  Future<Map<String, dynamic>> getMessages() async {
    final response = await _dio.get('/messages');
    return response.data;
  }

  Future<Map<String, dynamic>> sendMessage(Map<String, dynamic> data) async {
    final response = await _dio.post('/messages', data: data);
    return response.data;
  }

  // Service request methods
  Future<Map<String, dynamic>> getServiceRequests() async {
    final response = await _dio.get('/service-requests');
    return response.data;
  }

  Future<Map<String, dynamic>> createServiceRequest(Map<String, dynamic> data) async {
    final response = await _dio.post('/service-requests', data: data);
    return response.data;
  }
}
```

### 4. Data Models

#### Create `lib/models/user.dart`
```dart
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? phone;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

#### Create `lib/models/service.dart`
```dart
import 'package:json_annotation/json_annotation.dart';

part 'service.g.dart';

@JsonSerializable()
class Service {
  final String id;
  final String title;
  final String description;
  final String category;
  final double price;
  final String duration;
  final User? lawyer;

  Service({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.price,
    required this.duration,
    this.lawyer,
  });

  factory Service.fromJson(Map<String, dynamic> json) => _$ServiceFromJson(json);
  Map<String, dynamic> toJson() => _$ServiceToJson(this);
}
```

#### Create `lib/models/message.dart`
```dart
import 'package:json_annotation/json_annotation.dart';

@JsonSerializable()
class Message {
  final String id;
  final String senderId;
  final String recipientId;
  final String content;
  final DateTime timestamp;
  final bool isRead;
  final User? sender;
  final User? recipient;

  Message({
    required this.id,
    required this.senderId,
    required this.recipientId,
    required this.content,
    required this.timestamp,
    required this.isRead,
    this.sender,
    this.recipient,
  });

  factory Message.fromJson(Map<String, dynamic> json) => _$MessageFromJson(json);
  Map<String, dynamic> toJson() => _$MessageToJson(this);
}
```

### 5. State Management with Provider

#### Create `lib/providers/auth_provider.dart`
```dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<void> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.register({
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
      });

      if (response['success'] == true) {
        _user = User.fromJson(response['user']);
        await _saveTokens(response['token'], response['refreshToken']);
        notifyListeners();
      } else {
        _setError(response['message'] ?? 'Registration failed');
      }
    } catch (e) {
      _setError('Registration failed: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.login({
        'email': email,
        'password': password,
      });

      if (response['success'] == true) {
        _user = User.fromJson(response['user']);
        await _saveTokens(response['token'], response['refreshToken']);
        notifyListeners();
      } else {
        _setError(response['message'] ?? 'Login failed');
      }
    } catch (e) {
      _setError('Login failed: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.logout();
    } catch (e) {
      print('Logout error: $e');
    } finally {
      _user = null;
      await _clearTokens();
      notifyListeners();
    }
  }

  Future<void> loadUser() async {
    _setLoading(true);
    try {
      final response = await _apiService.getCurrentUser();
      if (response['success'] == true) {
        _user = User.fromJson(response['user']);
        notifyListeners();
      }
    } catch (e) {
      print('Load user error: $e');
    } finally {
      _setLoading(false);
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

  Future<void> _saveTokens(String token, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
    await prefs.setString('refresh_token', refreshToken);
    
    // Initialize Socket.IO connection
    final socketService = SocketService();
    socketService.initialize(token);
  }

  Future<void> _clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    
    // Disconnect Socket.IO
    final socketService = SocketService();
    socketService.disconnect();
  }
}
```

### 6. Real-time Chat Implementation

#### Create `lib/screens/chat/chat_screen.dart`
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../../services/socket_service.dart';
import '../../services/api_service.dart';
import '../../models/message.dart';
import '../../models/user.dart';

class ChatScreen extends StatefulWidget {
  final User otherUser;
  
  const ChatScreen({Key? key, required this.otherUser}) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final SocketService _socketService = SocketService();
  final ApiService _apiService = ApiService();
  
  List<Message> _messages = [];
  bool _isTyping = false;
  bool _otherUserTyping = false;
  StreamSubscription? _messageSubscription;
  StreamSubscription? _typingSubscription;

  @override
  void initState() {
    super.initState();
    _setupSocketListeners();
    _loadMessages();
    _joinConversation();
  }

  @override
  void dispose() {
    _messageSubscription?.cancel();
    _typingSubscription?.cancel();
    _socketService.leaveConversation(widget.otherUser.id);
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _setupSocketListeners() {
    // Listen for new messages
    _messageSubscription = _socketService.messageStream.listen((data) {
      if (data['type'] == 'message_read') {
        _handleMessageRead(data['data']);
      } else {
        _handleNewMessage(data);
      }
    });

    // Listen for typing indicators
    _typingSubscription = _socketService.typingStream.listen((data) {
      if (data['userId'] == widget.otherUser.id) {
        setState(() {
          _otherUserTyping = data['isTyping'];
        });
      }
    });
  }

  void _handleNewMessage(Map<String, dynamic> data) {
    final message = Message.fromJson(data);
    setState(() {
      _messages.add(message);
    });
    _scrollToBottom();
  }

  void _handleMessageRead(Map<String, dynamic> data) {
    setState(() {
      final messageIndex = _messages.indexWhere(
        (msg) => msg.id == data['messageId']
      );
      if (messageIndex != -1) {
        _messages[messageIndex] = _messages[messageIndex].copyWith(isRead: true);
      }
    });
  }

  void _joinConversation() {
    _socketService.joinConversation(widget.otherUser.id);
  }

  Future<void> _loadMessages() async {
    try {
      final response = await _apiService.getMessages(widget.otherUser.id);
      if (response['success'] == true) {
        setState(() {
          _messages = (response['data'] as List)
              .map((json) => Message.fromJson(json))
              .toList();
        });
        _scrollToBottom();
      }
    } catch (e) {
      print('Error loading messages: $e');
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage() async {
    final content = _messageController.text.trim();
    if (content.isEmpty) return;

    final messageId = DateTime.now().millisecondsSinceEpoch.toString();
    final tempMessage = Message(
      id: messageId,
      senderId: 'current_user', // Replace with actual user ID
      recipientId: widget.otherUser.id,
      content: content,
      timestamp: DateTime.now(),
      isRead: false,
    );

    // Add message to UI immediately
    setState(() {
      _messages.add(tempMessage);
    });
    _messageController.clear();
    _scrollToBottom();

    // Send via Socket.IO
    _socketService.sendMessage(
      recipientId: widget.otherUser.id,
      content: content,
      messageId: messageId,
    );

    // Send via API
    try {
      final response = await _apiService.sendMessage({
        'receiverId': widget.otherUser.id,
        'content': content,
      });

      if (response['success'] == true) {
        // Update message with server response
        final serverMessage = Message.fromJson(response['data']);
        setState(() {
          final index = _messages.indexWhere((msg) => msg.id == messageId);
          if (index != -1) {
            _messages[index] = serverMessage;
          }
        });
      }
    } catch (e) {
      print('Error sending message: $e');
      // Remove temp message on error
      setState(() {
        _messages.removeWhere((msg) => msg.id == messageId);
      });
    }
  }

  void _onTypingChanged(String text) {
    if (text.isNotEmpty && !_isTyping) {
      _isTyping = true;
      _socketService.startTyping(widget.otherUser.id);
    } else if (text.isEmpty && _isTyping) {
      _isTyping = false;
      _socketService.stopTyping(widget.otherUser.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundImage: widget.otherUser.avatar != null
                  ? NetworkImage(widget.otherUser.avatar!)
                  : null,
              child: widget.otherUser.avatar == null
                  ? Text(widget.otherUser.name[0].toUpperCase())
                  : null,
            ),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.otherUser.name),
                if (_otherUserTyping)
                  Text(
                    'Typing...',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.more_vert),
            onPressed: () {
              // Show chat options
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                final isMe = message.senderId == 'current_user'; // Replace with actual user ID
                
                return _buildMessageBubble(message, isMe);
              },
            ),
          ),
          // Message input
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: Offset(0, -1),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    onChanged: _onTypingChanged,
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                    ),
                    maxLines: null,
                    textCapitalization: TextCapitalization.sentences,
                  ),
                ),
                SizedBox(width: 8),
                FloatingActionButton(
                  mini: true,
                  onPressed: _sendMessage,
                  child: Icon(Icons.send),
                  backgroundColor: Theme.of(context).primaryColor,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.only(bottom: 8),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? Theme.of(context).primaryColor : Colors.grey[200],
          borderRadius: BorderRadius.circular(20),
        ),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              message.content,
              style: TextStyle(
                color: isMe ? Colors.white : Colors.black87,
                fontSize: 16,
              ),
            ),
            SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _formatTime(message.timestamp),
                  style: TextStyle(
                    color: isMe ? Colors.white70 : Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
                if (isMe) ...[
                  SizedBox(width: 4),
                  Icon(
                    message.isRead ? Icons.done_all : Icons.done,
                    size: 16,
                    color: message.isRead ? Colors.blue[300] : Colors.white70,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inDays > 0) {
      return '${timestamp.day}/${timestamp.month}';
    } else if (difference.inHours > 0) {
      return '${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}';
    } else {
      return '${timestamp.minute.toString().padLeft(2, '0')}:${timestamp.second.toString().padLeft(2, '0')}';
    }
  }
}
```

### 7. UI Implementation

#### Create `lib/screens/auth/login_screen.dart`
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

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
                      if (!value!.contains('@')) return 'Invalid email';
                      return null;
                    },
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(labelText: 'Password'),
                    obscureText: true,
                    validator: (value) {
                      if (value?.isEmpty ?? true) return 'Password is required';
                      return null;
                    },
                  ),
                  SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        await authProvider.login(
                          email: _emailController.text,
                          password: _passwordController.text,
                        );
                        
                        if (authProvider.isAuthenticated) {
                          Navigator.pushReplacementNamed(context, '/home');
                        } else if (authProvider.error != null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(authProvider.error!)),
                          );
                        }
                      }
                    },
                    child: Text('Login'),
                  ),
                  if (authProvider.error != null)
                    Padding(
                      padding: EdgeInsets.only(top: 16),
                      child: Text(
                        authProvider.error!,
                        style: TextStyle(color: Colors.red),
                      ),
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

### 7. Navigation Setup

#### Create `lib/main.dart`
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'providers/auth_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';

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
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => LoginScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => HomeScreen(),
      ),
    ],
  );
}
```

---

## 🔗 Deep Linking Setup

### Android Configuration

#### Update `android/app/src/main/AndroidManifest.xml`
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

### iOS Configuration

#### Update `ios/Runner/Info.plist`
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.lawyerservices.app</string>
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

### Deep Link Service

#### Create `lib/services/deep_link_service.dart`
```dart
import 'package:app_links/app_links.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';

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
    _linkSubscription = _appLinks.uriLinkStream.listen((Uri uri) {
      _handleDeepLink(uri);
    });
  }

  void _handleDeepLink(Uri uri) {
    final path = uri.path;
    final queryParams = uri.queryParameters;
    
    switch (path) {
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
      case '/lawyer':
        final lawyerId = queryParams['id'];
        if (lawyerId != null) {
          _router?.go('/lawyer/$lawyerId');
        }
        break;
      default:
        _router?.go('/');
    }
  }

  // Generate shareable links
  String generateServiceLink(String serviceId) {
    return 'https://lawyerservices.app/service?id=$serviceId';
  }

  String generateChatLink(String userId) {
    return 'https://lawyerservices.app/chat?user=$userId';
  }

  // Share content
  Future<void> shareService(String serviceId, String title, String description) async {
    final link = generateServiceLink(serviceId);
    final shareText = '$title\n\n$description\n\n$link';
    await Share.share(shareText);
  }
}
```

### Supported Deep Link URLs

```
# App Navigation
https://lawyerservices.app/
https://lawyerservices.app/login
https://lawyerservices.app/home

# Services
https://lawyerservices.app/services
https://lawyerservices.app/service?id=SERVICE_ID

# Chat/Messaging
https://lawyerservices.app/chat?user=USER_ID

# Lawyer Profiles
https://lawyerservices.app/lawyer?id=LAWYER_ID

# Custom URL Schemes
lawyerservices://service/SERVICE_ID
lawyerservices://chat/USER_ID
lawyerservices://lawyer/LAWYER_ID
```

---

## 🔌 Real-time Messaging Features

### Socket.IO Events

#### Server Events (Backend → Flutter)
```dart
// New message received
socket.on('new_message', (data) {
  // Handle incoming message
});

// Message notification (when recipient is not in chat)
socket.on('message_notification', (data) {
  // Show push notification
});

// Message read status
socket.on('message_read', (data) {
  // Update message read status
});

// Typing indicators
socket.on('user_typing', (data) {
  // Show/hide typing indicator
});

// User online/offline status
socket.on('user_status', (data) {
  // Update user status
});
```

#### Client Events (Flutter → Backend)
```dart
// Join conversation room
socket.emit('join_conversation', {'otherUserId': userId});

// Leave conversation room
socket.emit('leave_conversation', {'otherUserId': userId});

// Send message
socket.emit('send_message', {
  'recipientId': recipientId,
  'content': content,
  'messageId': messageId
});

// Mark message as read
socket.emit('mark_message_read', {
  'messageId': messageId,
  'senderId': senderId
});

// Typing indicators
socket.emit('typing_start', {'recipientId': recipientId});
socket.emit('typing_stop', {'recipientId': recipientId});

// User online status
socket.emit('user_online');
```

### Real-time Features

#### 1. **Instant Message Delivery**
- Messages appear immediately in the chat
- No need to refresh or pull to update
- Works across multiple devices

#### 2. **Typing Indicators**
- See when someone is typing
- Real-time typing status updates
- Auto-hide after 3 seconds of inactivity

#### 3. **Message Read Status**
- Single checkmark: Message sent
- Double checkmark: Message delivered
- Blue checkmark: Message read
- Real-time read status updates

#### 4. **Online/Offline Status**
- See when users are online
- Last seen timestamps
- Real-time status updates

#### 5. **Push Notifications**
- Receive notifications for new messages
- Custom notification sounds
- Badge counts on app icon

#### 6. **Message Synchronization**
- Messages sync across all devices
- Offline message queuing
- Automatic reconnection

### Implementation Tips

#### 1. **Connection Management**
```dart
// Initialize on login
final socketService = SocketService();
socketService.initialize(userToken);

// Disconnect on logout
socketService.disconnect();
```

#### 2. **Message Handling**
```dart
// Listen for new messages
socketService.messageStream.listen((message) {
  // Update UI with new message
  setState(() {
    messages.add(message);
  });
});
```

#### 3. **Typing Indicators**
```dart
// Start typing
socketService.startTyping(recipientId);

// Stop typing
socketService.stopTyping(recipientId);
```

#### 4. **Error Handling**
```dart
// Handle connection errors
socketService.statusStream.listen((status) {
  if (status['connected'] == false) {
    // Show reconnection UI
  }
});
```

---

## 🚨 Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **500:** Internal Server Error

### Error Handling in Flutter
```dart
try {
  final response = await _apiService.getServices();
  if (response['success'] == true) {
    // Handle success
  } else {
    // Handle API error
    throw Exception(response['message'] ?? 'Unknown error');
  }
} catch (e) {
  // Handle network/parsing errors
  print('Error: $e');
}
```

---

## 🧪 Testing & Debugging

### Test Endpoints
```bash
# Health check
curl https://lawyer-node-js.vercel.app/health

# Database test
curl https://lawyer-node-js.vercel.app/test-db

# User model test
curl https://lawyer-node-js.vercel.app/test-register
```

### Debug Tips
1. **Enable logging** in Dio interceptor
2. **Check network connectivity**
3. **Verify API responses** in browser
4. **Test with Postman/Insomnia**
5. **Monitor Vercel logs** for backend issues

---

## 🚀 Deployment Notes

### Backend Deployment
- **Platform:** Vercel
- **Database:** MongoDB Atlas
- **Environment Variables:** Set in Vercel dashboard
- **Auto-deployment:** On GitHub push

### Flutter App Deployment
- **Android:** Google Play Store
- **iOS:** Apple App Store
- **Web:** Vercel/Netlify
- **Desktop:** Windows/Mac/Linux

---

## 📞 Support & Resources

### API Documentation
- **Swagger UI:** `https://lawyer-node-js.vercel.app/api-docs`
- **Health Check:** `https://lawyer-node-js.vercel.app/health`

### Flutter Resources
- **Official Docs:** https://flutter.dev/docs
- **Provider Package:** https://pub.dev/packages/provider
- **HTTP Package:** https://pub.dev/packages/http
- **Dio Package:** https://pub.dev/packages/dio

### Backend Resources
- **Node.js:** https://nodejs.org/
- **Express.js:** https://expressjs.com/
- **MongoDB:** https://www.mongodb.com/
- **Vercel:** https://vercel.com/

---

## 🎯 Next Steps

1. **Set up Flutter project** with dependencies
2. **Implement authentication** flow
3. **Create API service** layer
4. **Build UI screens** for each role
5. **Test integration** with backend
6. **Deploy Flutter app**

---

**Happy Coding! 🚀**

This guide provides everything needed to integrate the Lawyer Services backend with a Flutter application. Follow the step-by-step instructions and refer to the API documentation for detailed endpoint information.
