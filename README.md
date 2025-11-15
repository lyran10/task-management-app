Task Management App

Live demo link - https://task-management-app-client-rose.vercel.app/

This project is a full-stack Task Management application built with a React (Vite) frontend and a Node.js + Express backend, connected through MongoDB.
The app supports user authentication, task CRUD operations.

Client (Frontend)

The frontend is built using:

React + TypeScript

Vite for faster development

Material UI for UI components

React SSR (Server-Side Rendering) for improved performance

Context API for authentication, theme mode, and toast notifications


Features

User Sign-in with validation

Theme mode (light/dark)

Task listing with pagination

Add & Edit tasks (all users)

Delete tasks (admin only)

Forgot Password page UI

Loader and toast notifications

------------------------------------------------------------------------------------------------------------------------------------------------

Backend (Server)

The backend uses:

Node.js + Express

MongoDB + Mongoose

JWT Authentication

bcryptjs for password hashing

Helmet + CORS for security

dotenv for environment configuration


Features

User authentication (JWT)

Role-based access (admin, user)

Each user can only view and manage their own tasks

Admin can delete tasks

Pagination support for tasks

Simple folder structure and easy routes

----------------------------------------------------------------------------------------------------------------------------------------------------

Creating an Admin User

The backend includes a helper script to create an admin account. Add the credentials manually in the create-admin.js file and run npm run seed:admin in the terminal.







