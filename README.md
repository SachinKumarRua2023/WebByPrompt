# WebByPrompt

A full-stack web application for generating high-quality AI prompts for software projects.

[![Django](https://img.shields.io/badge/Django-4.2-green)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46e3b7)](https://render.com/)

## 📁 Project Structure

```
WebByPrompt/
├── Backend/              # Django REST API
│   ├── backend/          # Core Django configuration
│   ├── apps/             # Modular apps
│   │   ├── home/         # Landing & health endpoints
│   │   ├── users/        # Authentication & user management
│   │   ├── prompts/      # Prompt CRUD operations
│   │   └── api/          # API versioning placeholder
│   ├── requirements.txt
│   └── manage.py
│
├── Frontend-Web/         # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API integration
│   │   └── hooks/      # Custom React hooks
│   ├── package.json
│   └── vite.config.js
│
├── Frontend-App/         # React Native mobile app
│   ├── src/
│   │   ├── screens/      # App screens
│   │   └── services/     # API integration
│   ├── App.js
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL (via Supabase)

### 1. Clone the Repository

```bash
git clone https://github.com/SachinKumarRua2023/WebByPrompt.git
cd WebByPrompt
```

### 2. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

API Endpoints:
- Health Check: `GET /api/health/`
- Landing Page: `GET /api/landing/`
- Authentication: `POST /api/token/`, `POST /api/token/refresh/`
- Prompts: `GET/POST /api/prompts/`
- Users: `POST /api/auth/register/`

### 3. Frontend-Web Setup

```bash
cd Frontend-Web

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Frontend-App Setup (React Native)

```bash
cd Frontend-App

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Scan the QR code with Expo Go app on your mobile device.

## ⚙️ Environment Variables

### Backend `.env`

```env
# Database Configuration (Supabase)
DB_NAME=your_supabase_db_name
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_HOST=your_supabase_host.supabase.co
DB_PORT=5432

# Django Security
SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,*.onrender.com

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT Settings
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7
```

### Frontend-Web `.env.local`

```env
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development
VITE_APP_NAME=WebByPrompt
```

## 🗄️ Supabase Setup

1. Create a project at [https://supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the connection string
4. Update the `DB_HOST`, `DB_PASSWORD`, and `DB_NAME` in your `.env`

## 📡 Deployment

### Backend → Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command:
   ```bash
   cd Backend && pip install -r requirements.txt
   ```
4. Set start command:
   ```bash
   cd Backend && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
   ```
5. Add environment variables from your `.env`
6. Deploy!

### Frontend → Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory: `Frontend-Web`
4. Add environment variables
5. Deploy!

### Frontend-App → Expo

```bash
cd Frontend-App
npx expo build:android  # or :ios
```

## 📋 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Obtain JWT access + refresh tokens |
| POST | `/api/token/refresh/` | Refresh access token |
| POST | `/api/auth/register/` | Register new user |
| GET | `/api/auth/me/` | Get current user |
| PATCH | `/api/auth/me/update/` | Update profile |

### Prompts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prompts/` | List all accessible prompts |
| POST | `/api/prompts/` | Create new prompt (auto-generates content) |
| GET | `/api/prompts/{id}/` | Get prompt details |
| PATCH | `/api/prompts/{id}/` | Update prompt |
| DELETE | `/api/prompts/{id}/` | Delete prompt |
| POST | `/api/prompts/{id}/toggle-favorite/` | Toggle favorite status |
| POST | `/api/prompts/{id}/regenerate/` | Regenerate prompt content |
| GET | `/api/prompts/my-prompts/` | Get current user's prompts |
| GET | `/api/prompts/favorites/` | Get favorite prompts |
| GET | `/api/prompts/public/` | Get public prompts |
| GET | `/api/prompts/categories/` | Get available categories |

### Health & Info

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/` | Health check |
| GET | `/api/landing/` | Landing page info |
| GET | `/` | API root with endpoints list |

## 🔑 Features

### Core Features

- **Smart Prompt Generation**: AI-powered prompts with tech stack suggestions
- **JWT Authentication**: Secure token-based authentication
- **CRUD Operations**: Full create, read, update, delete for prompts
- **Categories**: Organize prompts by role (Developer, Data Scientist, etc.)
- **Favorites**: Bookmark important prompts
- **Public/Private**: Control prompt visibility

### Tech Stack Suggestions

Generated prompts include:
- Recommended technologies based on project type
- API integration guidance
- Environment setup instructions
- Best practices and constraints

## 🧪 Testing

### Backend Tests

```bash
cd Backend
python manage.py test
```

### Frontend Tests

```bash
cd Frontend-Web
npm run test
```

## 🐛 Troubleshooting

### Database Connection Issues

1. Verify Supabase credentials in `.env`
2. Ensure your IP is allowed in Supabase settings
3. Check if the database exists

### CORS Errors

1. Update `CORS_ALLOWED_ORIGINS` in backend `.env`
2. Include your frontend URL

### JWT Token Issues

1. Clear browser localStorage
2. Login again to get fresh tokens
3. Check token expiration settings

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/SachinKumarRua2023/WebByPrompt/issues) page.

---

Built with ❤️ using Django, React, and Supabase
