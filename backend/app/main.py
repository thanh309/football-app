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


# --- Controller Registration (MVC Architecture) ---
from app.controllers import auth_controller
from app.controllers import team_controller
from app.controllers import field_controller
from app.controllers import booking_controller
from app.controllers import match_controller
from app.controllers import content_controller
from app.controllers import notification_controller
from app.controllers import player_controller
from app.controllers import search_controller

app.include_router(auth_controller.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(player_controller.router, prefix="/api/players", tags=["Players"])
app.include_router(team_controller.router, prefix="/api/teams", tags=["Teams"])
app.include_router(field_controller.router, prefix="/api/fields", tags=["Fields"])
app.include_router(booking_controller.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(match_controller.router, prefix="/api/matches", tags=["Matches"])
app.include_router(content_controller.router, prefix="/api/posts", tags=["Community"])
app.include_router(notification_controller.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(search_controller.router, prefix="/api/search", tags=["Search"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Kick-off API is running"}


@app.get("/api/health")
async def health_check():
    """API health check."""
    return {"status": "healthy"}
