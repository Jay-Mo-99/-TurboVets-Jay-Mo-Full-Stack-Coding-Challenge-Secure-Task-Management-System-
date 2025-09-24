# 🔐 Secure Task Management System

A full-stack task management application with JWT authentication, drag-and-drop Kanban board, and comprehensive CRUD operations.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### How to run both backend and frontend apps

1. **Clone and install dependencies:**
```bash
cd secure-task-mgmt
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

### Environment Setup
- **JWT secrets**: Configured in `simple-api-server.js` (production should use environment variables)
- **Database config**: Currently using JSON file storage (`users.json`, `tasks.json`) for simplicity

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

### NX Monorepo Layout and Rationale
- **`apps/dashboard/`**: React frontend with TailwindCSS
- **`apps/api/`**: Original NestJS setup (replaced with Express for simplicity)
- **`libs/auth/`**: Shared authentication utilities
- **`libs/data/`**: Shared data models and DTOs
- **`simple-api-server.js`**: Express.js API server (main backend)

### Explanation of Shared Libraries/Modules
- **Authentication Library**: JWT token handling and validation
- **Data Models**: TypeScript interfaces for User and Task entities
- **Shared utilities**: Common functions used across apps

## 📊 Data Model Explanation

### Database Schema (JSON File Storage)

```typescript
interface User {
  email: string;
  username: string;
  passwordHash: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'Personal' | 'Work' | 'Study';
  dueDate: string | null;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}
```

### ERD/Diagram
```
Users (1) ──────────── (*) Tasks
├── email (PK)              ├── id (PK)
├── username                ├── title
└── passwordHash            ├── description
                           ├── status
                           ├── priority
                           ├── category
                           ├── dueDate
                           ├── userEmail (FK)
                           ├── createdAt
                           └── updatedAt
```

## 🔐 Access Control Implementation

### Current Implementation
- **JWT Authentication**: Token-based authentication for all API endpoints
- **User Isolation**: Each user can only access their own tasks
- **Protected Routes**: All task operations require valid JWT token

### How JWT Auth Integrates with Access Control
- Login generates JWT token with user information
- Token is stored in localStorage and attached to all API requests
- Server validates token on each protected endpoint
- Tasks are filtered by user email from JWT payload

*Note: Advanced role-based access control (organizations, roles, permissions) planned for future implementation*

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

## 🔮 Future Considerations

### Advanced Role Delegation
- Implement organization hierarchy (2-level)
- Add roles: Owner, Admin, Viewer
- Role-based permissions system

### Production-Ready Security
- **JWT refresh tokens**: Implement token refresh mechanism
- **CSRF protection**: Add cross-site request forgery protection  
- **RBAC caching**: Efficient role-based access control caching

### Scaling Permission Checks Efficiently
- Database indexing for large-scale permissions
- Caching layer for frequently accessed permissions
- Optimized query patterns for role inheritance

### Additional Enhancements
- **Database Migration**: Move from JSON files to PostgreSQL/SQLite
- **Audit Logging**: Track user actions and system events
- **Task Analytics**: Completion visualization and productivity metrics
- **Real-time Collaboration**: WebSocket integration for live updates
- **Mobile App**: Native mobile application
- **Email Notifications**: Task reminders and updates

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Express.js, Node.js, JWT, bcryptjs
- **Storage**: JSON files (development), PostgreSQL planned (production)
- **Tools**: NX Monorepo, ESLint, Prettier
- **Authentication**: JWT tokens with secure password hashing

## 📝 Development Notes

- **Current State**: Fully functional task management system with all core features
- **Architecture**: Monorepo structure ready for scalability
- **Security**: Basic JWT authentication implemented, production security planned
- **Performance**: Optimized for development, production optimizations planned

---

Built with ❤️ using modern web technologies and best practices.
