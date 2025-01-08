# Full-Stack Application with FastAPI and React

## Overview
This project is a full-stack application built with FastAPI (backend) and React (frontend). It implements authentication, real-time data visualization, and CRUD operations with advanced features like concurrency handling and recovery mechanisms. The project emphasizes security, modularity, and user-friendly design with a consistent dark theme.

---

## Features

### Backend (FastAPI)
1. **Authentication**
   - Accepts username and password.
   - Issues session tokens (JWT-based) for authentication.
   - Validates session tokens for protected endpoints.

2. **Random Number Generator**
   - Generates random numbers every second.
   - Stores numbers in Redis with timestamps as keys.

3. **API Endpoints**
   - **Login Endpoint**: Issues session tokens.
   - **Real-Time Data Streaming**: Provides WebSocket endpoint for real-time random number streaming.
   - **CSV File Fetch**: Fetches records from `backend_table.csv` (protected endpoint).
   - **CRUD Operations**: Allows Create, Read, Update, Delete on `backend_table.csv` with file locking for concurrency.

4. **Concurrency and Recovery**
   - Implements file locking to handle simultaneous operations.
   - Creates backups before overwriting files to enable recovery.

5. **Database**
   - Stores user sessions and generated random numbers.

---

### Frontend (React)
1. **Authentication**
   - Login page for username and password.
   - Session token management with Redux.
   - Restricted access for authenticated users.

2. **Main Application**
   - **Interactive Plot**: Displays real-time random number stream using Chart.js.
   - **Dynamic Table**: Displays stored random numbers in a sortable, paginated table.
   - **CRUD Interface**: Enables CRUD operations on `backend_table.csv`.

3. **Features**
   - **Dynamic Updates**: Real-time data updates plot and table.
   - **Error Handling**: Displays errors for failed logins, unauthorized actions, or conflicts.
   - **Session Persistence**: Maintains user session with localStorage.
   - **Recovery UI**: Option to restore data from backups.

---

## Tech Stack
- **Backend**: FastAPI, Redis
- **Frontend**: React, Redux, Chart.js
- **Database**: MongoDB
- **Hosting**: Railway (Backend), Vercel (Frontend)

---

## Deployment Links
- **Backend**: [Backend Hosted on Railway](https://fsdtask-production.up.railway.app/)
- **Frontend**: [Frontend Hosted on Vercel](https://fsd-task-nu.vercel.app/)

---

## Setup and Usage

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/hemantsoni23/fsd_task.git
   cd fsd_task
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server locally:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Access the API docs:
   Visit `http://127.0.0.1:8000/`.

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## Testing Instructions

### Authentication
1. Navigate to the login page.
2. Enter any username and password to log in. Or do registration.
3. Use the provided session token to access protected routes.

### Real-Time Data Visualization
1. Log in to the application.
2. Navigate to the dashboard.
3. Observe the real-time chart updates with streamed random numbers.

### CRUD Operations
1. Access the CRUD interface.
2. Perform Create, Read, Update, and Delete actions on `backend_table.csv`.
3. Verify changes persist and errors are displayed for invalid actions.

### Recovery
1. Perform a CRUD operation that triggers a file overwrite.
2. Use the recovery option to restore the previous version.

---

## Challenges and Solutions
1. **Concurrency Handling**: Implemented file locking with Python's threading library to prevent race conditions during CRUD operations.
2. **Real-Time Updates**: Used WebSockets for seamless real-time data streaming and integrated Chart.js for dynamic visualization.
3. **Session Management**: Leveraged Redux for state management, ensuring smooth session persistence.
