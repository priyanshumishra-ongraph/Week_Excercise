import { beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app.js';
import { User } from '../models/user.model.js';

beforeEach(async () => {
  await User.deleteMany({});
});

// ----- AUTH ENDPOINT TESTS -----

describe('POST /api/auth/register', () => {
  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPass123!'
  };

  it('should register a new user and return 201 with a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  it('should return 400 if email already exists', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'StrongPass123!' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.details).toBeDefined();
  });

  it('should return 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'login@example.com',
      password: 'StrongPass123!'
    });
  });

  it('should login and return 200 with a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'StrongPass123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'AnyPass123!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });
});
