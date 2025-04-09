# TaskMaster - Task Management Tool

A comprehensive task management application built with React, Node.js, and SQLite. TaskMaster helps teams organize projects, track tasks, and collaborate effectively.

## Features

- **User Authentication**: Secure login and registration system
- **Project Management**: Create, update, and organize projects with subprojects
- **Task Tracking**: Manage tasks with priorities, statuses, and due dates
- **Role-Based Access Control**: Assign different roles and permissions to team members
- **Milestone Tracking**: Set and monitor project milestones
- **Comments & Collaboration**: Discuss tasks and projects with team members
- **Custom Fields**: Add custom data to tasks and projects
- **Responsive UI**: Modern interface built with React and Material UI

## Tech Stack

### Backend
- Node.js with Express
- Sequelize ORM
- SQLite database
- JWT authentication
- bcrypt for password hashing

### Frontend
- React
- React Router for client-side routing
- Material UI components
- Tailwind CSS
- Axios for API requests

## Prerequisites

- Node.js (v14 or later)

## Getting Started

### Setup Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```
NODE_ENV=development
PORT=5000
DB_NAME=taskmaster
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:

```bash
npm run dev
```

The server will run on http://localhost:5000

### Setup Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Log in a user
- `POST /api/v1/auth/logout` - Log out a user
- `GET /api/v1/auth/me` - Get current user info

### Tasks

- `GET /api/v1/tasks` - Get all tasks (with filtering options)
- `GET /api/v1/tasks/:id` - Get a specific task
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

### Projects

- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:id` - Get a specific project
- `POST /api/v1/projects` - Create a new project
- `PUT /api/v1/projects/:id` - Update a project
- `DELETE /api/v1/projects/:id` - Delete a project
- `POST /api/v1/projects/users` - Add a user to a project
- `DELETE /api/v1/projects/:projectId/users/:userId` - Remove a user from a project

### Milestones

- `GET /api/v1/milestones` - Get all milestones
- `GET /api/v1/milestones/:id` - Get a specific milestone
- `POST /api/v1/milestones` - Create a new milestone
- `PUT /api/v1/milestones/:id` - Update a milestone
- `DELETE /api/v1/milestones/:id` - Delete a milestone

### Comments

- `GET /api/v1/comments` - Get all comments
- `POST /api/v1/comments` - Create a new comment
- `PUT /api/v1/comments/:id` - Update a comment
- `DELETE /api/v1/comments/:id` - Delete a comment

## Project Structure

### Backend

```
backend/
  ├─ src/
  │   ├─ config/        # Database and app configuration
  │   ├─ controllers/   # Route controllers
  │   ├─ middlewares/   # Custom middlewares
  │   ├─ models/        # Sequelize models
  │   ├─ routes/        # API routes
  │   ├─ scripts/       # Utility scripts
  │   ├─ utils/         # Utility functions
  │   └─ server.js      # Server entry point
  ├─ .env               # Environment variables
  ├─ database.sqlite    # SQLite database file
  └─ package.json       # Backend dependencies
```

### Frontend

```
frontend/
  ├─ src/
  │   ├─ components/    # Reusable UI components
  │   ├─ context/       # React context for state management
  │   ├─ pages/         # Application pages
  │   ├─ services/      # API service functions
  │   ├─ utils/         # Utility functions
  │   ├─ App.jsx        # Main application component
  │   ├─ index.css      # Global styles
  │   └─ main.jsx       # Application entry point
  ├─ index.html         # HTML template
  ├─ tailwind.config.js # Tailwind CSS configuration
  ├─ vite.config.js     # Vite configuration
  └─ package.json       # Frontend dependencies
```

## Development

### Database Models

The application uses the following main models:
- User: User accounts and authentication
- Project: Project management with customizable fields
- Task: Task tracking with various attributes
- Milestone: Project milestone tracking
- Comment: Discussion threads on tasks and projects
- ProjectRole: Custom roles and permissions
- UserProject: User-project relationships

### Testing

To create a test user for development:

```bash
node src/scripts/createTestUser.js
```

This will create a user with the following credentials:
- Email: test@example.com
- Password: password123
- Username: testuser

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```
