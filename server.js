import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON bodies

app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from public, frontend and controllers folder
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));


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
    tasks: {
      passwordtaskComplete: false,
      webtaskComplete: false,
      emailtaskComplete: false
    }
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

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }


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

  res.status(200).json({ token,tasks: user.tasks || {} });
});

app.post('/update-tasks', async (req, res) => {
  const { email, taskName, status } = req.body;

  if (!email || !taskName || status === undefined) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  try {
    const updateResult = await usersCollection.updateOne(
      { email },
      { $set: { [`tasks.${taskName}`]: status } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.status(400).json({ message: 'Task update failed' });
    }
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongo();
  console.log(`Server running on port ${PORT}`);
});
