import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest'; //used for HTTP requests and check responses
import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// MOCK FUNCTIONS
const mockFindOne = vi.fn();
const mockInsertOne = vi.fn();

// Mock MongoClient
vi.mock('mongodb', () => {
  return {
    MongoClient: {
      db: () => ({
        collection: () => ({
          findOne: mockFindOne,
          insertOne: mockInsertOne,
          updateOne: vi.fn(),
          deleteOne: vi.fn()
        })
      })
    }
  };
});

// Route for signup
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, organisation } = req.body;

  if (!firstName || !lastName || !email || !password || !organisation) {
    return res.status(400).send('All fields are required');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{5,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).send('Password must contain a capital letter, a number, a special character, and be at least 5 characters long');
  }

  const existingUser = await mockFindOne({ email });
  if (existingUser) {
    return res.status(400).send('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await mockInsertOne({ firstName, lastName, email, password: hashedPassword, organisation });
  res.status(201).send('User registered successfully');
});

// Tests
describe('POST /signup', () => {
    //clear the previous test data
  beforeEach(() => {
    mockFindOne.mockReset();
    mockInsertOne.mockReset();
  });

  //Sign Up Test 1
  it('should create a new user with valid input', async () => {
    mockFindOne.mockResolvedValue(null); // no existing user
    mockInsertOne.mockResolvedValue({}); // simulate insert

    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password1!',
        organisation: 'TestOrg'
      });

    expect(response.status).toBe(201);
    expect(response.text).toBe('User registered successfully');
  });

  //Sign Up Test 2
  it('should return 400 if fields are missing', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '',
        organisation: 'TestOrg'
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('All fields are required');
  });

  //Sign Up Test 3
  it('should return 400 if user already exists', async () => {
    mockFindOne.mockResolvedValue({ email: 'john.doe@example.com' }); // simulate existing user

    const response = await request(app)
      .post('/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com', //use same email as existing user
        password: 'Password1!',
        organisation: 'TestOrg'
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('User with this email already exists');
  });
});

