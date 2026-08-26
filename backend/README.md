# ⚙️ TaskMaster Backend API

The REST API backend for TaskMaster, built with Node.js, Express 5, TypeScript, and MongoDB Atlas.

## 🛠️ Tech Stack
- **Node.js & Express 5**: Fast, modular REST API.
- **TypeScript & TSX**: Type-safe development.
- **MongoDB Atlas & Mongoose**: Document database and object modeling.
- **Zod**: Robust request body and query validation.
- **Security**: JWT authentication, bcrypt password hashing, CORS middleware.
- **Testing**: Jest + Supertest (19 integration tests with in-memory MongoDB).

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in this directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Run Development Server
```bash
npm start
```
Server runs on `http://localhost:3000/`.

### 4. Run Tests
```bash
npm test
```

## 🌐 Endpoints Overview
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/users` - List registered users (Protected)
- `GET /api/tasks` - List tasks for authenticated user (Protected)
- `POST /api/tasks` - Create a new task (Protected)
- `GET /api/tasks/:id` - Get task details (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)
