# TaskMaster Pro

## Overview
TaskMaster Pro is a task management application that allows users to register, log in with 2FA, and manage tasks (add, toggle completion, delete) with a filter option.

## Technologies Used

### Frontend
- **React (v19.1.0)**: Builds the dynamic user interface, managing state and rendering components like login forms and task lists.
- **React DOM**: Enables rendering React components into the DOM for browser-based use.
- **@testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @testing-library/dom**: Facilitates unit testing of components.
- **react-scripts (v5.0.1)**: Provides development and build tools, including hot reloading.
- **Tailwind CSS (v3.4.1)**: Styles the UI with utility-first CSS for responsive design.
- **web-vitals**: Monitors performance metrics for user experience optimization.

### Backend
- **Node.js**: Runs the server, handling API requests on `http://localhost:5000`.
- **Express.js**: Creates RESTful APIs for authentication and task management.
- **MongoDB**: Stores user and task data in a flexible, scalable NoSQL database.

## Usage
- **Frontend**: Interact with the UI to log in/register, add tasks, toggle completion, and filter tasks.
- **Backend**: Manages API endpoints (e.g., `/api/auth/login`, `/api/tasks`) and persists data.

## Setup
1. Clone the repository.
2. Install dependencies: `npm install` (frontend) and set up backend with Node.js/Express/MongoDB.
3. Start the backend: `node server.js` (ensure MongoDB is running).
4. Start the frontend: `npm start`.
