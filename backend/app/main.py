"""
FastAPI application entry point.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import get_settings
from app.database import init_db, close_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    await init_db()
    
    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)
    
    yield
    
    # Shutdown
    await close_db()


app = FastAPI(
    title="Kick-off API",
    description="Backend API for Kick-off Amateur Football Management Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded media
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


# --- Router Registration ---
from app.routers import auth

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Additional routers will be registered as they are created:
# from app.routers import players, teams, fields, bookings, matches
# from app.routers import posts, notifications, moderation, search, media
# app.include_router(players.router, prefix="/api/players", tags=["Players"])
# app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
# app.include_router(fields.router, prefix="/api/fields", tags=["Fields"])
# app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
# app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])
# app.include_router(posts.router, prefix="/api/posts", tags=["Community"])
# app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
# app.include_router(moderation.router, prefix="/api/mod", tags=["Moderation"])
# app.include_router(search.router, prefix="/api/search", tags=["Search"])
# app.include_router(media.router, prefix="/api/media", tags=["Media"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Kick-off API is running"}


@app.get("/api/health")
async def health_check():
    """API health check."""
    return {"status": "healthy"}
