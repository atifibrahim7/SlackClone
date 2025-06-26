const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stream Chat
const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET,
);

// Simple login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Check if user exists in GetStream
    const { users } = await streamClient.queryUsers({ id: userId });

    let user;

    if (users.length === 0) {
      // User doesn't exist, create new user
      user = {
        id: userId,
        name: userId, // Use userId as name for simplicity
        image: `https://getstream.io/random_png/?id=${userId}&name=${userId}`,
        role: 'user',
      };

      await streamClient.upsertUser(user);
      console.log(`Created new user: ${userId}`);
    } else {
      // User exists
      user = users[0];
      console.log(`User ${userId} found`);
    }

    // Generate Stream token
    const token = streamClient.createToken(userId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        token: token,
        user: user,
        apiKey: process.env.STREAM_API_KEY,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Slack Clone Simple Backend',
    endpoints: {
      login: 'POST /api/login',
      health: 'GET /api/health',
    },
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Stream API Key: ${process.env.STREAM_API_KEY ? 'Set' : 'Not Set'}`,
  );
});
