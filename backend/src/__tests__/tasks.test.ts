import request from 'supertest';
import mongoose from 'mongoose';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { app } from '../../app.js';
import { User } from '../models/user.model.js';
import { Task } from '../models/task.model.js';

let authToken: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  // Register + login a test user before each test
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: 'taskuser', email: 'task@example.com', password: 'StrongPass123!' });
  authToken = res.body.token;
});

// ----- TASKS ENDPOINT TESTS -----

describe('GET /api/tasks', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('should return empty array when user has no tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return only the authenticated user tasks', async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Task A' });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Task A');
  });

  it('should filter tasks by completed=true', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Task to complete' });
    const taskId = createRes.body.id;

    await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ completed: true });

    const res = await request(app)
      .get('/api/tasks?completed=true')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].completed).toBe(true);
  });
});

describe('POST /api/tasks', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Test' });
    expect(res.status).toBe(401);
  });

  it('should create a task and return 201 with populated user', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'New Task', priority: 'High' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.priority).toBe('High');
    expect(res.body.user).toHaveProperty('username', 'taskuser');
    expect(res.body.user).toHaveProperty('email', 'task@example.com');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/validation/i);
  });
});

describe('PUT /api/tasks/:id', () => {
  let taskId: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Original Title' });
    taskId = res.body.id;
  });

  it('should update a task and return 200', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Title', completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.completed).toBe(true);
  });

  it('should return 404 for a non-existent task id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/tasks/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Ghost Update' });

    expect(res.status).toBe(404);
  });

  it('should return 404 for an invalid id format', async () => {
    const res = await request(app)
      .put('/api/tasks/not-a-valid-id')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Bad ID' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  let taskId: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Task to delete' });
    taskId = res.body.id;
  });

  it('should delete a task and return 204', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 when deleting a non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/tasks/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });
});
