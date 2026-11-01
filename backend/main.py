# Forwarding root main.py to backend.app.main:app
from .app.main import app

__all__ = ["app"]
