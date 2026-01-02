# Kick-off Backend

FastAPI backend for the Kick-off Amateur Football Management Platform.

## Quick Start

### Using Docker (Recommended)

```bash
# Start MySQL and API
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start MySQL (using Docker)
docker-compose up -d db

# Run development server
uvicorn app.main:app --reload
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Environment configuration
│   ├── database.py       # Database connection
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── routers/          # API endpoints
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── dependencies/     # FastAPI dependencies
│   └── utils/            # Utility functions
├── alembic/              # Database migrations
├── tests/                # Test suite
├── uploads/              # Uploaded media files
└── docker-compose.yml    # Docker configuration
```

## Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```
