const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const path = require('path');  // Import path module
require('dotenv').config();
const cors = require('cors'); // Allow cross-origin requests




// Create an Express app
const app = express();
app.use(cors());

app.use(express.json());  // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from public folder
app.use(express.static(path.join(__dirname, 'frontend')));

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
  const { firstName, lastName, email, password, dob } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !password || !dob) {
    return res.status(400).send('All fields are required');
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  // Validate Date of Birth (example: ensure it's not in the future)
  const userDob = new Date(dob);
  if (isNaN(userDob.getTime()) || userDob > new Date()) {
    return res.status(400).send('Invalid date of birth');
  }

  // Password validation: At least 5 characters, 1 capital letter, 1 number, 1 special character
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{5,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).send('Password must contain a capital letter, a number, a special character, and be at least 5 characters long');
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  // Check if user already exists by email
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user into MongoDB
  const newUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dob: userDob.toISOString(), // Save DOB in ISO string format
  };

  try {
    await usersCollection.insertOne(newUser);
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  // Find user by email
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token, });
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongo();
  console.log(`Server running on port ${PORT}`);
});
