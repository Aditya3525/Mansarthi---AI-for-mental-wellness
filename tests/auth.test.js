const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Test database
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mental-wellbeing-test';

describe('Authentication Routes', () => {
    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(MONGODB_URI);
    });

    afterAll(async () => {
        // Clean up and close database connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear users collection before each test
        await mongoose.connection.db.collection('users').deleteMany({});
    });

    describe('POST /api/register', () => {
        const validUserData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            age: 25
        };

        it('should register a new user with valid data', async () => {
            const response = await request(app)
                .post('/api/register')
                .send(validUserData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.user.email).toBe(validUserData.email);
            expect(response.body.user.name).toBe(validUserData.name);
        });

        it('should reject registration with invalid email', async () => {
            const invalidData = { ...validUserData, email: 'invalid-email' };
            
            const response = await request(app)
                .post('/api/register')
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Please provide a valid email address');
        });

        it('should reject registration with weak password', async () => {
            const invalidData = { ...validUserData, password: '123' };
            
            const response = await request(app)
                .post('/api/register')
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Password must be at least 8 characters with letters and numbers');
        });

        it('should reject registration with invalid age', async () => {
            const invalidData = { ...validUserData, age: 10 };
            
            const response = await request(app)
                .post('/api/register')
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Age must be between 13 and 120');
        });

        it('should reject duplicate email registration', async () => {
            // Register first user
            await request(app)
                .post('/api/register')
                .send(validUserData)
                .expect(201);

            // Try to register same email again
            const response = await request(app)
                .post('/api/register')
                .send(validUserData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User with this email already exists');
        });
    });

    describe('POST /api/login', () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            age: 25
        };

        beforeEach(async () => {
            // Register a user before each login test
            await request(app)
                .post('/api/register')
                .send(userData);
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: userData.email,
                    password: userData.password
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.user.email).toBe(userData.email);
        });

        it('should reject login with invalid email', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'wrong@example.com',
                    password: userData.password
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should reject login with invalid password', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: userData.email,
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should validate email format', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'invalid-email',
                    password: userData.password
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Please provide a valid email address');
        });
    });
});