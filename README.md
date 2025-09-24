# 🔐 Secure Task Management System

A full-stack task management application with JWT authentication, drag-and-drop Kanban board, and comprehensive CRUD operations.

## 🚀 Setup Instructions

### How to run both backend and frontend apps

1. **Install dependencies:**
```bash
npm install
```

2. **Start the API server:**
```bash
node simple-api-server.js
```
The API server will run on `http://localhost:3001`

3. **Start the frontend dashboard (in a new terminal):**
```bash
npx nx serve dashboard
```
The dashboard will run on `http://localhost:4200` (or `4201` if 4200 is busy)

4. **Access the application:**
- Open your browser and navigate to `http://localhost:4200`
- Register a new account or login with existing credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if exists)
   - Update `JWT_SECRET` in `.env` file

## 🏗️ Architecture Overview

### NX Monorepo Layout
- **`apps/dashboard/`**: React frontend with TailwindCSS
- **`apps/api/`**: NestJS setup (currently not used)
- **`libs/auth/`**: Shared authentication utilities
- **`libs/data/`**: Shared data models and DTOs
- **`simple-api-server.js`**: Express.js API server (main backend)

## 📊 Data Model Explanation

### Current Storage (JSON Files)

**Users** (stored in `users.json`):
```javascript
{
  email: string,
  username: string,
  passwordHash: string
}
```

**Tasks** (stored in `tasks.json`):
```javascript
{
  id: string,
  title: string,
  description: string | null,
  status: 'pending' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  category: 'Personal' | 'Work' | 'Study',
  dueDate: string | null,
  userEmail: string,
  createdAt: string,
  updatedAt: string
}
```

## 🔐 Access Control Implementation

### How JWT Authentication Works
- User registers/logs in → receives JWT token
- Token stored in browser localStorage
- All API requests include `Authorization: Bearer <token>` header
- Server validates token and extracts user info
- Each user can only access their own tasks (filtered by userEmail)

## 📡 API Docs

### Authentication Endpoints
```http
POST /register
Content-Type: application/json
{
  "username": "string",
  "email": "string", 
  "password": "string"
}
Response: { "success": true, "token": "jwt_token", "username": "string" }

POST /login  
Content-Type: application/json
{
  "email": "string",
  "password": "string"
}
Response: { "success": true, "token": "jwt_token", "username": "string" }
```

### Task Management Endpoints

**Create Task:**
```http
POST /tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "title": "string",
  "description": "string (optional)",
  "priority": "low|medium|high",
  "category": "Personal|Work|Study",
  "dueDate": "ISO_string (optional)"
}
Response: { "success": true, "task": Task }
```

**List Tasks:**
```http
GET /tasks
Authorization: Bearer <jwt_token>
Response: { "success": true, "tasks": Task[] }
```

**Update Task:**
```http
PUT /tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "title": "string (optional)",
  "description": "string (optional)", 
  "status": "pending|in-progress|completed (optional)",
  "priority": "low|medium|high (optional)",
  "category": "Personal|Work|Study (optional)",
  "dueDate": "ISO_string (optional)"
}
Response: { "success": true, "task": Task }
```

**Delete Task:**
```http
DELETE /tasks/:id
Authorization: Bearer <jwt_token>
Response: { "success": true, "message": "Task deleted successfully" }
```

**Health Check:**
```http
GET /api/health
Response: { "status": "ok", "message": "API is working" }
## ✨ Features Implemented

### Core Features ✅
- **User Authentication**: Register/Login with JWT
- **Task CRUD Operations**: Create, Read, Update, Delete tasks
- **Kanban Board**: Drag-and-drop interface with 3 columns (TO DO, IN PROGRESS, DONE)
- **Task Management**: 
  - Categories (Personal, Work, Study)
  - Priority levels (Low, Medium, High) 
  - Due dates with overdue detection
  - Optional descriptions
- **Filtering & Sorting**: Filter by category, sort by date/priority/alphabetical
- **Responsive Design**: Mobile-friendly interface
- **Data Persistence**: JSON file storage maintains data across server restarts

### Frontend Features ✅
- **React + TailwindCSS**: Modern UI with responsive design
- **Real-time Updates**: Immediate UI feedback for all operations
- **Form Validation**: Client-side validation for required fields
- **User Experience**: 
  - Clear Form functionality
  - Inline task editing
  - Visual feedback for overdue tasks
  - Task count displays

### Backend Features ✅
- **Express.js API**: RESTful API with proper HTTP status codes
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Comprehensive error responses
- **Data Validation**: Server-side input validation

## ️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, NX, Vite
- **Backend**: Express.js, Node.js, JWT, bcryptjs
- **Storage**: JSON files (`users.json`, `tasks.json`)
- **Tools**: NX Monorepo, ESLint

---

**Built with modern web technologies - fully functional task management system with authentication and drag-and-drop Kanban board.**
