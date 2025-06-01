# 🏙️ LocalLoop

**LocalLoop** is an open-source neighborhood platform designed to connect communities through local events and deals. From discovering nearby activities to finding the best local offers, this project empowers neighborhoods to build stronger connections and support local businesses.

---

## ✨ Features

- 🔐 **User Authentication System**
- 📍 **Location-Based Event Discovery**
- 💰 **Local Deals and Promotions**
- 📱 **Responsive Mobile-First Design**
- 🗺️ **Interactive Map Integration**
- 🔄 **Real-time Updates**

---

## 📦 Folder Structure

```
LocalLoop/
├── frontend/            # Next.js frontend with TypeScript
├── backend/             # FastAPI backend with PostgreSQL
├── docs/                # Technical documentation
├── .github/             # GitHub templates
│   ├── ISSUE_TEMPLATE.md
│   ├── PULL_REQUEST_TEMPLATE.md
├── demo/                # Demo videos and screenshots
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

---

## 🚀 Getting Started

## Manual Installation

### 🧰 Prerequisites

- Node.js v18+
- Python 3.8+
- PostgreSQL
- npm/pnpm and Git

---

### 🛠️ Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/neighborhood-app.git
cd neighborhood-app
```

#### 2. Backend (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
python start.py --init-db
python start.py --migrate
python start.py
```

#### 3. Frontend (Next.js)

```bash
cd ../frontend

pnpm install
pnpm dev
```

## Docker installation

### Prerequisites
- Docker
- Docker Compose

### 1. Start the Application
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- PostgreSQL: localhost:5432

### 3. Useful Commands
```bash
# Rebuild and restart
docker-compose up --build

# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh

# Access database
docker-compose exec postgres psql -U postgres -d postgres

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### 4. Development Workflow
- Code changes in `./backend` and `./frontend` are automatically synced
- Backend restarts automatically on code changes
- Frontend has hot reload enabled
- Database data persists between container restarts

### 5. Environment Variables
The backend uses your existing `.env` file with these Docker-specific overrides:
- `DATABASE_URL` points to the postgres container
- `CORS_ORIGINS` already includes localhost:3000

### 6. Troubleshooting
```bash
# If database connection fails
docker-compose restart postgres
docker-compose logs postgres

# If backend fails to start
docker-compose logs backend

# Clean restart
docker-compose down -v
docker-compose up --build
```

Then open `http://localhost:3000` in your browser.

---

## 🤝 Contributing

We welcome contributions! See our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get started. You can also explore:

- `good first issue`
- `help wanted`
- Join the discussion tab

---

## 📢 Community & Support

- 🗨️ [GitHub Discussions](https://github.com/SarthakRawat-1/localloop/discussions)
- 🐞 [Raise an Issue](https://github.com/SarthakRawat-1/localloop/issues)

---

## 🌍 Impact

LocalLoop aims to strengthen local communities by facilitating connections between residents and businesses. This project encourages neighborhood engagement, supports local economies, and builds stronger communities.

### 🔮 Future Scope

- Community messaging system
- Local business verification
- Event ticketing and RSVP
- Neighborhood forums
- Mobile app versions
- Integration with local government APIs

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE). Feel free to use, fork, and contribute.

---
