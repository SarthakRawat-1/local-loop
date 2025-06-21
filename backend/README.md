# LocalLoop Backend

A FastAPI backend for the LocalLoop application, providing API endpoints for local events and deals.

## Features

- User authentication (signup, login, profile management)
- Events and deals management
- Location-based search
- Image upload functionality
- PostgreSQL database with SQLAlchemy ORM
- Alembic for database migrations

## Requirements

- Python 3.8+
- PostgreSQL
- Virtual environment (recommended)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd neighborhood-app/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:

Copy the `.env` file in the `app` directory and update it with your PostgreSQL credentials.

5. Initialize the database:

```bash
# Make sure PostgreSQL is running 
# Match sqlalchemy with psycopg2 or asyncpg or else it breaks and does not initialise
python start.py --init-db
```

6. Run migrations:

```bash
python start.py --migrate
```

## Running the Application

Start the FastAPI server:

```bash
python start.py
```

The API will be available at `http://localhost:8000`, and the interactive API documentation at `http://localhost:8000/docs`.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Items (Events & Deals)

- `GET /api/items` - Get all items with filtering support
- `GET /api/items/{item_id}` - Get a specific item
- `POST /api/items` - Create a new item
- `PATCH /api/items/{item_id}` - Update an item
- `DELETE /api/items/{item_id}` - Delete an item

### Uploads

- `POST /api/uploads` - Upload an image file

## Database Schema

### Users

- id (UUID, primary key)
- name (String)
- email (String, unique)
- hashed_password (String)
- created_at (DateTime)
- updated_at (DateTime)

### Items

- id (UUID, primary key)
- type (Enum: 'event', 'deal')
- title (String)
- description (Text)
- category (Enum)
- start_date (DateTime)
- end_date (DateTime)
- address (String)
- latitude (Float)
- longitude (Float)
- image (String, file path)
- user_id (UUID, foreign key to users)
- created_at (DateTime)
- updated_at (DateTime)

## Development

### Creating Migrations

To create a new migration after changing models:

```bash
alembic revision --autogenerate -m "Description of changes"
```

### Running Tests

```bash
# TODO: Add testing instructions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
