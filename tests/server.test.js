import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest'; //used for HTTP requests and check 
import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Mocked database functions
const mockFindOne = vi.fn();
const mockInsertOne = vi.fn();
const mockUpdateOne = vi.fn();
const mockDeleteOne = vi.fn();
const mockToArray = vi.fn();

// Mock MongoClient
vi.mock('mongodb', () => ({
  MongoClient: {
    db: () => ({
      collection: () => ({
        findOne: mockFindOne,
        insertOne: mockInsertOne,
        updateOne: mockUpdateOne,
        deleteOne: mockDeleteOne,
        find: () => ({ toArray: mockToArray })
      })
    })
  }
}));

//copy routes - ALLOWS TESTING IN A SAFE ENVIRONMENT

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

  // Check if user already exists by email
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await mockInsertOne({ firstName, lastName, email, password: hashedPassword, organisation });
  res.status(201).send('User registered successfully');
});


// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user by email
  const user = await mockFindOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = 'fake-jwt-token'; // Mock JWT token

  let organisationUsers = [];

  // If user is an admin, retrieve all users in the same organisation
  if (user.role === 'admin') {
    organisationUsers = await mockToArray();
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

// Task Update Route
app.post('/update-tasks', async (req, res) => {
  const { email, taskName, status } = req.body;
  if (!email || !taskName || status === undefined) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const result = await mockUpdateOne();
  if (result.modifiedCount > 0) {
    return res.status(200).json({ message: 'Task updated successfully' });
  } else {
    return res.status(400).json({ message: 'Task update failed' });
  }
});

// Score Update Route
app.post('/update-scores', async (req, res) => {
  const result = await mockUpdateOne();
  if (result.modifiedCount > 0) {
    return res.status(200).json({ message: 'Scores updated successfully' });
  } else {
    return res.status(400).json({ message: 'Score update failed' });
  }
});

// Profile Update Route
app.post('/update-profile', async (req, res) => {
  const { email, firstName, lastName, organisation } = req.body;
  if (!email || !firstName || !lastName || !organisation) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const result = await mockUpdateOne();
  if (result.modifiedCount > 0) {
    return res.status(200).json({ message: 'Profile updated successfully' });
  } else {
    return res.status(400).json({ message: 'No changes made or user not found' });
  }
});

// Delete User Route
app.delete('/delete-user', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required for deletion' });
  }

  const result = await mockDeleteOne();
  if (result.deletedCount === 1) {
    return res.status(200).json({ message: 'User deleted successfully' });
  } else {
    return res.status(404).json({ message: 'User not found or already deleted' });
  }
});


// ====================== TESTS =========================

beforeEach(() => {
  mockFindOne.mockReset();
  mockInsertOne.mockReset();
  mockUpdateOne.mockReset();
  mockDeleteOne.mockReset();
  mockToArray.mockReset();
});

describe('POST /signup', () => {
  it('should reject invalid email format', async () => {
    const res = await request(app).post('/signup').send({
      firstName: 'A',
      lastName: 'B',
      email: 'invalidemail',
      password: 'Password1!',
      organisation: 'Org'
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid email format');
  });

  it('should reject weak passwords', async () => {
    const res = await request(app).post('/signup').send({
      firstName: 'A',
      lastName: 'B',
      email: 'user@example.com',
      password: 'weak',
      organisation: 'Org'
    });
    expect(res.status).toBe(400);
    expect(res.text).toMatch(/Password must contain/);
  });
});

describe('POST /login', () => {
  it('should fail when email or password is missing', async () => {
    const res = await request(app).post('/login').send({ email: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

  it('should fail when user not found', async () => {
    mockFindOne.mockResolvedValue(null);
    const res = await request(app).post('/login').send({
      email: 'missing@example.com',
      password: 'Password1!'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User not found');
  });

  it('should fail with invalid credentials', async () => {
    const hashed = await bcrypt.hash('Password1!', 10);
    mockFindOne.mockResolvedValue({ email: 'user@example.com', password: hashed });
    const res = await request(app).post('/login').send({
      email: 'user@example.com',
      password: 'WrongPass!'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');    
  });
});

describe('POST /update-tasks', () => {
  it('should reject invalid task update request', async () => {
    const res = await request(app).post('/update-tasks').send({
      email: 'user@example.com',
      taskName: '',
      status: true
    });
    expect(res.status).toBe(400);
  });

  it('should confirm successful task update', async () => {
    mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
    const res = await request(app).post('/update-tasks').send({
      email: 'user@example.com',
      taskName: 'emailtaskComplete',
      status: true
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task updated successfully');
  });
});

describe('POST /update-scores', () => {
  it('should confirm score update', async () => {
    mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
    const res = await request(app).post('/update-scores').send({
      email: 'user@example.com',
      phishingCorrect: 3,
      passwordCorrect: 3,
      webCorrect: 3,
      percentage: 100
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Scores updated successfully');
  });
});

describe('POST /update-profile', () => {
  it('should reject missing profile fields', async () => {
    const res = await request(app).post('/update-profile').send({
      email: '',
      firstName: 'A',
      lastName: 'B',
      organisation: 'Org'
    });
    expect(res.status).toBe(400);
  });

  it('should confirm profile update', async () => {
    mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
    const res = await request(app).post('/update-profile').send({
      email: 'user@example.com',
      firstName: 'New',
      lastName: 'Name',
      organisation: 'Org'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully');
  });
});

describe('DELETE /delete-user', () => {
  it('should reject when email is missing', async () => {
    const res = await request(app).delete('/delete-user').send({});
    expect(res.status).toBe(400);
  });

  it('should confirm successful deletion', async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = await request(app).delete('/delete-user').send({
      email: 'user@example.com'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('should handle already deleted user', async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 0 });
    const res = await request(app).delete('/delete-user').send({
      email: 'user@example.com'
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found or already deleted');
  });
});


