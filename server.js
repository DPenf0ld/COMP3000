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
  const { firstName, lastName, email, password, organisation } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !password || !organisation) {
    return res.status(400).send('All fields are required');
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  // Password validation: At least 5 characters, 1 capital letter, 1 number, 1 special character
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{5,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).send('Password must contain a capital letter, a number, a special character, and be at least 5 characters long');
  }

  if (!organisation) {
    return res.status(400).send('Organisation is required');
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
    organisation,
    role: "user",
    tasks: {
      passwordtaskComplete: false,
      webtaskComplete: false,
      emailtaskComplete: false,
    },
    quizscores: {
      phishingCorrect: 0,
      passwordCorrect: 0,
      webCorrect: 0,
      percentage: 0,
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
    return res.status(400).json("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  let organisationUsers = [];

  // If user is an admin, retrieve all users in the same organisation
  if (user.role === 'admin') {
    organisationUsers = await usersCollection
      .find({ organisation: user.organisation }, { projection: { password: 0 } })
      .toArray();
  }

  res.status(200).json({
    message: 'Login successful',
    token,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    organisation: user.organisation,
    tasks: user.tasks || {},
    quizscores: user.quizscores || {},
    organisationUsers, // will be kept empty unless the user is an admin
  });
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

app.post('/update-scores', async (req, res) => {
  const { email, phishingCorrect, passwordCorrect, webCorrect, percentage } = req.body;

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  try {
    const updateResult = await usersCollection.updateOne(
      { email },
      {
        $set: {
          'quizscores.phishingCorrect': phishingCorrect,
          'quizscores.passwordCorrect': passwordCorrect,
          'quizscores.webCorrect': webCorrect,
          'quizscores.percentage': percentage
        }
      }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: 'Scores updated successfully' });
    } else {
      res.status(400).json({ message: 'Score update failed' });
    }
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/update-profile', async (req, res) => {
  const { email, firstName, lastName, organisation } = req.body;

  if (!email || !firstName || !lastName || !organisation) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  try {
    const updateResult = await usersCollection.updateOne(
      { email },
      { $set: { firstName, lastName, organisation } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(400).json({ message: 'No changes made or user not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/delete-user', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required for deletion' });
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  try {
    const deleteResult = await usersCollection.deleteOne({ email });

    if (deleteResult.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found or already deleted' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

app.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing fields' });
  }

  const db = client.db('GuardPoint');
  const usersCollection = db.collection('users');

  try {
      const user = await usersCollection.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Current password incorrect' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await usersCollection.updateOne(
          { email },
          { $set: { password: hashedPassword } }
      );

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongo();
  console.log(`Server running on port ${PORT}`);
});

// Status codes reminder:
// 200 - OK: Successful request, action completed.
// 201 - Created: New resource created (e.g., user).
// 400 - Bad Request: Invalid input or missing parameters. CLIENT SIDE
// 401 - Unauthorized: Auth required or invalid token.
// 403 - Forbidden: Authenticated but no permission to access.
// 404 - Not Found: Resource (e.g., user) not found.
// 500 - Internal Server Error: Server error or unexpected condition.
