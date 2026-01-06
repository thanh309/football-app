# Football App (Kickoff)

A full-stack web application for booking football fields and managing football communities.

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **State/Data Fetching**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: MySQL 8.0 (Async with AIOMySQL + SQLAlchemy)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Pydantic
- **Containerization**: Docker & Docker Compose

## Prerequisites

Before running the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (3.11 or higher)
- [Docker & Docker Compose](https://www.docker.com/) (Required for the database)

---

## Getting Started

To run the application locally, you will need to open **two separate terminal windows**:

1. **Terminal 1**: Runs the Backend (API + Database)
2. **Terminal 2**: Runs the Frontend (React Application)

### 1. Backend Setup

The project uses MySQL and FastAPI. The easiest way to run the full backend is via Docker.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Start the backend services (Database + API):
   ```bash
   docker-compose up -d --build
   ```

   To view the API logs:
   ```bash
   docker-compose logs -f api
   ```

   The backend will run at `http://localhost:8000`. API Docs are available at `http://localhost:8000/docs`.

3. **(Optional) Seed Mock Data**:
   
   To populate the database with sample data (users, fields, matches, etc.), run the following command **in a separate terminal** (make sure you are in the `backend` directory):

   ```bash
   docker-compose exec api python scripts/seed_data.py
   ```

   To **reset the database** (drop all tables and recreate them):
   ```bash
   docker-compose exec api python scripts/reset_db.py
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```
   
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`.

## Project Structure

```
football-app/
├── backend/                # FastAPI Application
│   ├── app/               # Application source code
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # SQLAlchemy database models
│   │   ├── schemas/       # Pydantic models (request/response)
│   │   └── services/      # Business logic
│   ├── scripts/           # Utility scripts (db reset, seed)
│   └── tests/             # Pytest tests
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
│   └── index.css          # Tailwind imports
│
└── README.md
```