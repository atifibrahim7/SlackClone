# Slack Clone Backend

A robust backend API for the Slack Clone React Native application with Stream Chat integration.

## Features

- 🔐 **Authentication** - JWT-based authentication with secure password hashing
- 👥 **User Management** - User registration, login, and profile management
- 💬 **Stream Chat Integration** - Seamless integration with Stream Chat API
- 🛡️ **Security** - Rate limiting, input validation, and security headers
- 📱 **React Native Ready** - Optimized for React Native applications
- 🗄️ **MongoDB** - Robust data persistence with Mongoose ODM

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stream Chat account and API keys

### Installation

1. **Clone and install dependencies:**
```bash
cd slack-clone-backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user.

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "tokens": {
      "jwt": "your_jwt_token",
      "stream": "your_stream_token"
    },
    "userId": "johndoe",
    "userToken": "your_stream_token",
    "apiKey": "your_stream_api_key"
  }
}
```

#### POST `/api/auth/login`
Login an existing user.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:** Same as signup response

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

#### POST `/api/auth/refresh-token`
Refresh Stream Chat token (requires authentication).

### Health Check

#### GET `/api/health`
Check API health status.

## Stream Chat Integration

The backend automatically:
- Creates users in Stream Chat when they register
- Generates Stream Chat tokens for authentication
- Synchronizes user data between your database and Stream Chat
- Handles token refresh for long-lived sessions

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation using express-validator
- **CORS**: Configured for React Native applications
- **Security Headers**: Helmet.js for security headers

## Database Schema

### User Model
```javascript
{
  username: String,      // Unique username
  email: String,         // Unique email
  password: String,      // Hashed password
  fullName: String,      // User's full name
  image: String,         // Profile image URL
  isActive: Boolean,     // Account status
  lastSeen: Date,        // Last activity
  streamUserId: String,  // Stream Chat user ID
  createdAt: Date,       // Account creation date
  updatedAt: Date        // Last update date
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Additional error details"]
}
```

## Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP

## React Native Integration

Update your React Native app's API base URL:

```javascript
// For development with localtunnel
const API_BASE_URL = 'https://little-flowers-take.loca.lt';

// For local development
const API_BASE_URL = 'http://localhost:3000';
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.js  # MongoDB connection
│   └── stream.js    # Stream Chat service
├── controllers/     # Route controllers
│   └── authController.js
├── middleware/      # Express middleware
│   ├── auth.js      # JWT authentication
│   ├── validation.js # Input validation
│   ├── rateLimiter.js # Rate limiting
│   └── errorHandler.js # Error handling
├── models/          # Mongoose models
│   └── User.js
├── routes/          # Express routes
│   ├── authRoutes.js
│   └── index.js
└── server.js        # Main server file
```

## Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/slack-clone

# Stream Chat
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development
PUBLIC_URL=https://your-tunnel-url.loca.lt
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 