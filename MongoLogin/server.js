const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const path = require('path');  // Import path module
require('dotenv').config();

// Create an Express app
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public' folder

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB Atlas
async function connectToMongo() {
  await client.connect();
  console.log("Connected to MongoDB Atlas");
}

// Routes
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user into MongoDB
  const newUser = {
    username,
    password: hashedPassword,
  };

  try {
    await usersCollection.insertOne(newUser);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  // Find user by username
  const user = await usersCollection.findOne({ username });
  if (!user) {
    return res.status(400).send('User not found');
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',  // Token expiration time
  });

  res.status(200).json({ token });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongo();
  console.log(`Server running on port ${PORT}`);
});
