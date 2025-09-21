# Lawyer Services Backend API

A comprehensive backend API for a Lawyer Services mobile application built with Node.js, Express, and MongoDB.

## Features

- **Role-based Authentication**: Support for Guest, User, and Lawyer (Admin) roles
- **Service Management**: CRUD operations for legal services
- **Messaging System**: Real-time communication between users and lawyers
- **Service Requests**: Request and manage legal services
- **Comprehensive API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Vercel

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Services
- `GET /api/services` - Get all services (public)
- `GET /api/services/categories` - Get service categories
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Lawyer only)
- `PUT /api/services/:id` - Update service (Lawyer only)
- `DELETE /api/services/:id` - Delete service (Lawyer only)

### Messages
- `GET /api/messages` - Get user conversations
- `GET /api/messages/:userId` - Get messages with specific user
- `POST /api/messages` - Send message
- `POST /api/messages/service-request` - Send service request
- `PUT /api/messages/mark-read/:messageId` - Mark message as read

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/service-requests` - Get user's service requests

### Lawyers
- `GET /api/lawyers/dashboard` - Get lawyer dashboard
- `GET /api/lawyers/service-requests` - Get lawyer's service requests
- `PUT /api/lawyers/service-requests/:id/status` - Update request status
- `GET /api/lawyers/clients` - Get lawyer's clients

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/lawyer-services
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, visit:
- **Development**: http://localhost:3000/api-docs
- **Production**: https://your-api-domain.vercel.app/api-docs

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/lawyer-services |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| BCRYPT_ROUNDS | Bcrypt salt rounds | 12 |

## Role-based Access Control

### Guest
- Browse services
- View service details
- Cannot send messages or make requests (redirected to sign up)

### User
- All guest permissions
- Send messages to lawyers
- Request services
- Manage profile

### Lawyer (Admin)
- All user permissions
- Create/edit/delete services
- Manage service requests
- View dashboard with analytics
- Manage clients

## Database Models

### User
- Basic user information
- Role-based permissions
- Authentication data

### Service
- Legal service information
- Category and pricing
- Lawyer association

### Message
- Communication between users
- Service request integration
- Read status tracking

### ServiceRequest
- Service request details
- Status management
- Client-lawyer relationship

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- Helmet security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
