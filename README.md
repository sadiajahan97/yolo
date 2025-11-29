# AI Image Analysis & Q&A Platform

A full-stack AI web application that enables users to upload images, perform object detection using YOLO (You Only Look Once), and interact with detection results through a Gemini-powered AI assistant.

## Features

- **User Authentication**: Secure login/signup flow with JWT tokens and password hashing
- **Image Upload & Object Detection**: Upload images and detect objects using YOLO v8n model running locally
- **Results Visualization**: View annotated images with bounding boxes and a sortable table of detections
- **AI-Powered Q&A**: Ask questions about detection results using Google's Gemini 2.5 Flash model

## Architecture

### Tech Stack

**Frontend:**

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation

**Backend:**

- **FastAPI** - Modern Python web framework
- **Prisma** - Type-safe ORM for database management
- **PostgreSQL** - Relational database
- **Ultralytics YOLO** - Object detection model (YOLOv8n)
- **Google Gemini 2.5 Flash** - AI assistant for Q&A
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

**Infrastructure:**

- **Docker & Docker Compose** - Containerization and orchestration
- **PostgreSQL** - Database service

### System Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js (Port 3000)
│   (Next.js)     │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│    Backend      │  FastAPI (Port 8000)
│   (FastAPI)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│  DB   │ │  YOLO   │
│(Postgres)│ │  Model  │
└───────┘ └─────────┘
         │
    ┌────▼────┐
    │ Gemini  │
    │   API   │
    └─────────┘
```

### Technical Choices

1. **FastAPI**: Chosen for its high performance, automatic API documentation, and native async support, which is ideal for handling image uploads and AI model inference.

2. **Prisma**: Provides type-safe database access and migrations, ensuring data integrity and easier schema management.

3. **YOLO v8n (nano)**: Lightweight model suitable for Docker containers while maintaining good detection accuracy. Runs inference locally without external API dependencies.

4. **Gemini 2.5 Flash**: Fast and cost-effective model for conversational Q&A about detection results. Supports multimodal input (image + text).

5. **Next.js App Router**: Modern React framework with server-side rendering capabilities and optimized performance.

6. **JWT with Refresh Tokens**: Stateless authentication with secure token rotation for enhanced security.

## Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd yolo
```

### 2. Configure Environment Variables

The application uses environment variables from both `compose.yaml` and `.env` files. Some variables are pre-configured in `compose.yaml`, while others must be set in a `.env` file.

#### Environment Variables Already Configured in `compose.yaml`:

The following variables are automatically configured in `compose.yaml`:

**Frontend (`app` service):**

- `NEXT_PUBLIC_YOLO_BACKEND_URL`: Backend API URL (default: `http://localhost:8000`)

**Backend (`api` service):**

- `DATABASE_URL`: PostgreSQL connection string (default: `postgres://postgres:p0stgr3s@db:5432/yolo`)

**Database (`db` service):**

- `POSTGRES_USER`: Database user (default: `postgres`)
- `POSTGRES_PASSWORD`: Database password (default: `p0stgr3s`)
- `POSTGRES_DB`: Database name (default: `yolo`)

#### Required Environment Variables in `.env` File:

You must create a `.env` file in the `yolo-backend/` directory with the following variables. You can use `yolo-backend/.env.example` as a template:

- `GEMINI_API_KEY`: Your Google Gemini API key (required for Q&A feature)
- `ACCESS_TOKEN_SECRET`: Secret key for JWT access tokens (required for authentication)
- `REFRESH_TOKEN_SECRET`: Secret key for JWT refresh tokens (required for authentication)

**To configure these variables**, create a `.env` file in the `yolo-backend/` directory:

```bash
cd yolo-backend
cp .env.example .env
```

Then edit `yolo-backend/.env` and replace the placeholder values:

```env
GEMINI_API_KEY=your-gemini-api-key-here
ACCESS_TOKEN_SECRET=your-access-token-secret-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
```

**Note**:

- The `.env` file is automatically loaded by Docker Compose (configured in `compose.yaml`)
- For production, use strong, randomly generated secrets. You can generate secrets using:
  ```bash
  openssl rand -hex 32
  ```
- Never commit the `.env` file to version control (it should be in `.gitignore`)

### 3. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to `yolo-backend/.env` as `GEMINI_API_KEY`

## Running the Application

### Using Docker Compose (Recommended)

The application is designed to run entirely with Docker Compose. Simply execute:

```bash
docker compose up
```

This command will:

1. Build the frontend and backend Docker images
2. Start the PostgreSQL database
3. Run database migrations automatically
4. Start all services

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Building from Scratch

If you need to rebuild the containers:

```bash
docker compose build --no-cache
docker compose up
```

### Clean Start (Remove Volumes)

To start fresh and remove all data:

```bash
docker compose down --volumes
docker compose up
```

### Viewing Logs

To view logs from all services:

```bash
docker compose logs -f
```

To view logs from a specific service:

```bash
docker compose logs -f api    # Backend logs
docker compose logs -f app    # Frontend logs
docker compose logs -f db     # Database logs
```

## Usage

1. **Sign Up**: Create a new account at http://localhost:3000/auth
2. **Sign In**: Log in with your credentials
3. **Upload Image**: Click "Choose File" and select an image
4. **Detect Objects**: Click "Detect Objects" to run YOLO detection
5. **View Results**: See the annotated image and sortable detection table
6. **Ask Questions**: Use the Q&A interface to ask questions about the detections (e.g., "How many cars are there?", "What is the highest-confidence object?")

## API Endpoints

### Authentication

- `POST /auth/sign-up` - Create a new user account
- `POST /auth/sign-in` - Sign in and receive tokens
- `POST /auth/sign-out` - Sign out and invalidate tokens
- `GET /auth/check` - Verify authentication status
- `POST /auth/refresh` - Refresh access token

### Object Detection

- `POST /yolo/detect` - Upload image and get YOLO detections (requires authentication)

### AI Q&A

- `POST /gemini/ask` - Ask questions about detection results (requires authentication)

### User

- `GET /user/profile` - Get current user profile (requires authentication)

## Project Structure

```
yolo/
├── compose.yaml              # Docker Compose configuration
├── README.md                 # This file
├── run.sh                    # Helper script for clean rebuild
├── yolo-backend/             # Backend service
│   ├── Dockerfile
│   ├── entrypoint.sh         # Database migration script
│   ├── main.py               # FastAPI application entry point
│   ├── database.py           # Prisma client initialization
│   ├── requirements.txt      # Python dependencies
│   ├── models/
│   │   └── yolov8n.pt       # YOLO model file
│   ├── routers/              # API route handlers
│   │   ├── auth.py          # Authentication routes
│   │   ├── yolo.py          # Object detection routes
│   │   ├── gemini.py        # AI Q&A routes
│   │   └── user.py          # User profile routes
│   ├── middlewares/         # Custom middleware
│   │   └── auth.py          # JWT authentication middleware
│   └── prisma/              # Prisma schema and migrations
│       └── schema.prisma    # Database schema
└── yolo-frontend/           # Frontend service
    ├── Dockerfile
    ├── package.json         # Node.js dependencies
    ├── next.config.ts       # Next.js configuration
    ├── app/                 # Next.js App Router pages
    │   ├── page.tsx         # Main application page
    │   ├── auth/            # Authentication pages
    │   ├── components/      # React components
    │   └── contexts/        # React contexts
    └── api/                 # API client utilities
        └── index.ts         # Axios instance and API calls
```

## Development

### Backend Development

To run the backend locally (without Docker):

```bash
cd yolo-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
prisma migrate deploy
prisma generate
uvicorn main:app --reload
```

### Frontend Development

To run the frontend locally (without Docker):

```bash
cd yolo-frontend
npm install
npm run dev
```

## Troubleshooting

### Database Connection Issues

If the backend cannot connect to the database:

1. Ensure the database service is running: `docker compose ps`
2. Check database logs: `docker compose logs db`
3. Verify `DATABASE_URL` in `compose.yaml` matches database credentials

### YOLO Model Not Found

The YOLO model (`yolov8n.pt`) should be automatically downloaded on first use. If issues occur:

1. Check backend logs: `docker compose logs api`
2. Ensure the `models/` directory exists in `yolo-backend/`

### Gemini API Errors

If Q&A feature is not working:

1. Verify `GEMINI_API_KEY` is set correctly in `yolo-backend/.env` file
2. Ensure the `.env` file exists in the `yolo-backend/` directory
3. Check API key validity at [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Review backend logs for specific error messages: `docker compose logs api`

### Port Conflicts

If ports 3000 or 8000 are already in use:

1. Stop conflicting services
2. Or modify port mappings in `compose.yaml`:
   ```yaml
   ports:
     - 3001:3000 # Change host port
   ```

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- Refresh tokens are stored in HTTP-only cookies
- CORS is configured to allow only the frontend origin
- Environment variables in `compose.yaml` should be kept secure and not committed with sensitive values in production
- Use strong, randomly generated secrets for production deployments
- Consider using Docker secrets or external secret management for production environments
