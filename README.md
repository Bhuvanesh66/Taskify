# Taskify - Task Management Application

Taskify is a modern task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users organize and track their tasks across different categories.



## Features

- 🔐 **User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Protected routes

- 📋 **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as complete/incomplete
  - Categorize tasks (work, personal, shopping, health, etc.)
  - Task description support
  - Filter tasks by category

- 💅 **Modern UI/UX**
  - Clean and intuitive interface
  - Responsive design
  - Category color coding
  - Smooth animations and transitions
  - Loading states and error handling

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- Express Middleware for authentication
- CORS support

### Frontend
- React (with Vite)
- Material-UI (MUI) components
- React Router for navigation
- Axios for API calls
- Context API for state management
- Form validation with Formik and Yup

## API Endpoints

### Authentication
```http
POST /api/v1/auth/register
{
    "name": "Alice",
    "email": "alice@test.com",
    "password": "secret123"
}

POST /api/v1/auth/login
{
    "email": "alice@test.com",
    "password": "secret123"
}
```

### Tasks
```http
GET /api/v1/tasks
GET /api/v1/tasks?category=work

POST /api/v1/tasks
{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "category": "shopping"
}

PATCH /api/v1/tasks/:id
{
    "isDone": true
}

DELETE /api/v1/tasks/:id
```

## Data Models

### User Schema
```javascript
{
    _id: ObjectId,
    name: String,
    email: String (unique),
    password: String (hashed),
    createdAt: Date
}
```

### Task Schema
```javascript
{
    _id: ObjectId,
    userId: ObjectId (ref: User),
    title: String,
    description: String (optional),
    category: String,
    isDone: Boolean (default: false),
    createdAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/taskify.git
cd taskify
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Configure environment variables
Create a .env file in the backend directory:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## Security Measures

- Password hashing using bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Rate limiting
- XSS protection

## Future Enhancements

- [ ] Task due dates and reminders
- [ ] Collaborative task sharing
- [ ] Task priority levels
- [ ] Dark/Light theme toggle
- [ ] Task search functionality
- [ ] Task sorting options
- [ ] Mobile app version

## Acknowledgments

- Material-UI for the component library
- MongoDB Atlas for database hosting
- React and Node.js communities for excellent documentation
