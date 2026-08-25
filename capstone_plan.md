# Capstone Project Plan: Full-Stack Task Manager

## 1. App Specification & User Stories

### Overview
A full-stack task management application where users can register, log in, and manage their tasks securely. The app will feature a responsive Angular frontend styled with Angular Material, connecting to an Express/MongoDB backend via a REST API.

### Core Features
- **User Authentication:** Registration, Login, and secure session management using JWT.
- **Task Management:** Create, Read, Update, and Delete (CRUD) tasks with advanced details like priority, progress tracking, and assignees.
- **Filtering & Sorting:** View tasks based on completion status.
- **Responsive UI:** Clean, accessible interface using Angular Material.

### User Stories
- **As a visitor**, I want to register for a new account so that I can have a personalized task list.
- **As a registered user**, I want to log in using my credentials so that I can securely access my tasks.
- **As a user**, I want to add a new task with a title, description, priority, and due date.
- **As a user**, I want to mark a task as complete or incomplete so that I can track my progress.
- **As a user**, I want to edit an existing task's details, including progress stats and assignee names.
- **As a user**, I want to delete a task when it's no longer relevant.
- **As a logged-in user**, I want to log out so that my account remains secure on shared devices.

## 2. Database Schema (MongoDB / Mongoose)

### `User` Collection
Stores user credentials and details.
- `_id`: ObjectId
- `username`: String, required, trim
- `email`: String, required, unique, trim, lowercase
- `passwordHash`: String, required (hashed via bcrypt)
- `createdAt`: Date (automatically managed by timestamps)
- `updatedAt`: Date (automatically managed by timestamps)

### `Task` Collection
Stores tasks linked to specific users, including advanced tracking fields.
- `_id`: ObjectId
- `title`: String, required, trim
- `description`: String, trim (optional)
- `completed`: Boolean, default: false
- `priority`: String, default: 'Low'
- `progress_label`: String, default: 'New Task'
- `progress_stats`: String, default: '0%'
- `progress_bar_fill`: Number, default: 0
- `due_date`: Date or String
- `assignee_initials_list`: Array of Strings
- `assignee_names`: Array of Strings
- `created_at`: String (ISO Date)
- `user`: ObjectId, ref: 'User', required (links the task to the user who created it)
- `createdAt`: Date (automatically managed by timestamps)
- `updatedAt`: Date (automatically managed by timestamps)

## 3. REST API Contract

### Authentication Routes

| Method | Endpoint | Description | Request Body | Response Shape (Success) | Auth Req? |
|--------|----------|-------------|--------------|----------------|-----------|
| POST | `/api/auth/register` | Register a new user | `{ username, email, password }` | `{ token, user: { id, username, email } }` | No |
| POST | `/api/auth/login` | Log in a user | `{ email, password }` | `{ token, user: { id, username, email } }` | No |

### Task Routes

| Method | Endpoint | Description | Request Body | Response Shape (Success) | Auth Req? |
|--------|----------|-------------|--------------|----------------|-----------|
| GET | `/api/tasks` | Get all tasks for the logged-in user (supports `?completed=true/false`) | None | `[ { _id, title, description, priority, user, ... } ]` | Yes |
| GET | `/api/tasks/:id` | Get a specific task by ID | None | `{ _id, title, description, priority, user, ... }` | Yes |
| POST | `/api/tasks` | Create a new task | `{ title, description?, priority?, ... }` | `{ _id, title, description, priority, user, ... }` | Yes |
| PUT | `/api/tasks/:id` | Update a task | `{ title?, description?, completed?, priority?, ... }` | `{ _id, title, ... }` | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | None | `204 No Content` | Yes |

*Note: All authenticated routes require an `Authorization: Bearer <JWT_TOKEN>` header.*
