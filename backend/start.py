import asyncio
import os
import sys
import argparse
import uvicorn

from app.db.init_db import init_db
from app.core.config import settings


from app.db.base import Base
from app.db.session import engine

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
# await create_tables();

async def init_database():
    print("Initializing database...")
    await init_db()
    print("Database initialization complete!")


def run_migrations():
    print("Running database migrations...")
    os.system("alembic upgrade head")
    print("Migrations complete!")


def start_app(host="0.0.0.0", port=8000, reload=True):
    print(f"Starting {settings.APP_NAME} API on http://{host}:{port}")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
    )


async def main():
    await create_tables()
    parser = argparse.ArgumentParser(description="Neighborhood App Backend")
    parser.add_argument(
        "--init-db", action="store_true", help="Initialize the database"
    )
    parser.add_argument(
        "--migrate", action="store_true", help="Run database migrations"
    )
    parser.add_argument(
        "--host", type=str, default="0.0.0.0", help="Host to run the API on"
    )
    parser.add_argument(
        "--port", type=int, default=8000, help="Port to run the API on"
    )
    parser.add_argument(
        "--no-reload", action="store_true", help="Disable auto-reload"
    )
    
    args = parser.parse_args()
    
    if args.init_db:
        await init_database()
    
    if args.migrate:
        run_migrations()
    
    if not args.init_db and not args.migrate:
        start_app(args.host, args.port, not args.no_reload)


if __name__ == "__main__":
    asyncio.run(main())
