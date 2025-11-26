# AI Image Analysis & Q&A Platform

A full-stack AI web application that enables users to upload images, perform object detection using YOLO (You Only Look Once) models running locally in Docker, visualize detection results in a sortable table, and interact with a Gemini-powered AI assistant to ask questions about the detected objects.

## Features

### 1. User Authentication

- Secure signup and login flow
- Password hashing using bcrypt
- JWT-based authentication with access tokens
- Protected routes requiring authentication

### 2. Image Upload & Object Detection

- User-friendly interface for uploading images
- "Detect Objects" button activates after image selection
- Backend runs YOLO v8 nano model locally inside Docker container
- Returns:
  - Annotated image with bounding boxes drawn
  - Structured list of detections including:
    - Class name
    - Bounding box coordinates (x1, y1, x2, y2)
    - Confidence score (0-1)

### 3. Results Visualization

- **Annotated Image Display**: Shows the uploaded image with bounding boxes overlaid
- **Sortable Results Table**: Displays detection data with columns:
  - Class name
  - Bounding box coordinates
  - Confidence score
- Table supports sorting by any column (ascending/descending)

### 4. Conversational Q&A About Results

- Text input interface for asking questions about detections
- Example questions:
  - "How many cars are there?"
  - "What is the highest-confidence object?"
  - "List all detected objects"
- Backend integrates with Gemini 2.5 Flash API
- Chat-style interface displays AI responses
- AI receives both the image and structured detection data for context-aware responses

## Setup Instructions

### Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

Verify Docker installation:

```bash
docker --version
docker compose version
```

### Step-by-Step Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd yolo
   ```

2. **Configure environment variables**:

   Create a `.env` file in the `yolo-backend` directory:

   ```bash
   cd yolo-backend
   touch .env
   ```

   Add the following required variables to `.env`:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ```

   **How to obtain API keys**:

   - **Gemini API Key**: 
     - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
     - Sign in with your Google account
     - Click "Create API Key" and copy the generated key
   
   - **JWT Secret Key**: 
     - Generate a secure random string using:
       ```bash
       openssl rand -hex 32
       ```
     - Or use any secure random string generator

3. **Verify Docker Compose configuration**:

   The `compose.yaml` file in the project root configures three services:
   - `app` (Frontend - Next.js)
   - `api` (Backend - FastAPI)
   - `db` (Database - PostgreSQL)

4. **Access the application**:

   After starting the services (see Docker instructions below), access:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs (FastAPI Swagger UI)

**Important Notes**:

- On first startup, the backend automatically connects to the database, runs Prisma migrations, and initializes the YOLO model
- The first detection request may take longer (10-30 seconds) as the YOLO model loads into memory
- Ensure ports 3000, 8000, and 5432 are not already in use by other applications

## How to Run the App Using Docker

### Quick Start

Run the entire application stack with a single command:

```bash
docker compose up
```

This command will:
- Build Docker images for frontend and backend (if not already built)
- Start PostgreSQL database container
- Run database migrations automatically
- Start all three services (frontend, backend, database)
- Display logs from all services in the terminal

### Running in Background (Detached Mode)

To run services in the background:

```bash
docker compose up -d
```

### Stopping the Application

Stop all running services:

```bash
docker compose down
```

To stop and remove all data (including database volumes):

```bash
docker compose down -v
```

**Warning**: The `-v` flag will delete all database data. Use with caution.

### Viewing Logs

View logs from all services:

```bash
docker compose logs -f
```

View logs from a specific service:

```bash
docker compose logs -f api      # Backend service
docker compose logs -f app       # Frontend service
docker compose logs -f db        # Database service
```

### Rebuilding After Code Changes

If you've modified the code, rebuild the images:

```bash
docker compose up --build
```

Or rebuild specific services:

```bash
docker compose build api    # Rebuild backend only
docker compose build app    # Rebuild frontend only
```

### Useful Docker Commands

```bash
# Check status of running containers
docker compose ps

# Restart a specific service
docker compose restart api

# Execute commands inside a container
docker compose exec api bash        # Access backend container shell
docker compose exec db psql -U postgres -d yolo  # Access database

# View resource usage
docker stats

# Clean up unused Docker resources
docker system prune
```

### Troubleshooting Docker Issues

**Port conflicts**: If ports 3000, 8000, or 5432 are in use, modify the port mappings in `compose.yaml`:

```yaml
ports:
  - "3001:3000"  # Change host port from 3000 to 3001
```

**Build failures**: Clear Docker cache and rebuild:

```bash
docker compose build --no-cache
docker compose up
```

**Database connection issues**: Ensure the database container is healthy before the backend starts. The `compose.yaml` includes health checks and dependency management for this.

## Architecture and Technical Choices

### System Architecture

The application follows a **three-tier microservices architecture** with clear separation of concerns:

```
┌─────────────────┐
│   Frontend      │  Next.js (Port 3000)
│   (Next.js)     │  └─ React UI Components
└────────┬────────┘  └─ API Client Layer
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │  FastAPI (Port 8000)
│   (FastAPI)     │  ├─ Authentication Routes
└────────┬────────┘  ├─ YOLO Detection Routes
         │           ├─ Gemini Q&A Routes
         │           └─ User Management Routes
         │
┌────────▼────────┐
│   Database      │  PostgreSQL (Port 5432)
│   (PostgreSQL)  │  └─ User & Message Storage
└─────────────────┘
```

**Service Communication Flow**:

1. **Frontend → Backend**: RESTful API calls via Axios with cookie-based authentication
2. **Backend → Database**: Prisma ORM for type-safe database operations
3. **Backend → External APIs**: Gemini 2.5 Flash API for AI responses

### Technical Stack Rationale

#### Frontend: Next.js 16 with TypeScript

**Why Next.js?**
- **Server-Side Rendering (SSR)**: Improves initial page load performance and SEO
- **App Router**: Modern file-based routing with React Server Components support
- **Built-in Optimization**: Automatic code splitting, image optimization, and performance enhancements
- **TypeScript Support**: Native TypeScript support for type safety and better developer experience

**Additional Frontend Technologies**:
- **Tailwind CSS**: Utility-first CSS framework for rapid, responsive UI development
- **React Query**: Efficient data fetching, caching, and synchronization with backend
- **React Hook Form**: Performant form management with minimal re-renders
- **Axios**: Promise-based HTTP client with interceptors for authentication handling

#### Backend: FastAPI (Python)

**Why FastAPI?**
- **High Performance**: Async/await support makes it ideal for I/O-bound operations (image processing, API calls)
- **Automatic API Documentation**: Built-in Swagger/OpenAPI UI at `/docs` endpoint
- **Type Validation**: Pydantic models provide runtime type checking and validation
- **Python Ecosystem**: Easy integration with ML libraries (Ultralytics, PIL) and AI APIs (Google Gemini)

**Backend Components**:
- **Ultralytics YOLO v8**: State-of-the-art object detection model running locally in Docker
- **Google Gemini 2.5 Flash**: Multimodal AI model for context-aware Q&A responses
- **Prisma ORM**: Type-safe database queries with automatic migrations
- **JWT Authentication**: Stateless authentication using JSON Web Tokens stored in HTTP-only cookies
- **bcrypt**: Secure password hashing with salt rounds

#### Database: PostgreSQL with Prisma

**Why PostgreSQL?**
- **Relational Database**: Well-suited for structured user and message data
- **ACID Compliance**: Ensures data integrity for authentication and chat history
- **Mature Ecosystem**: Extensive tooling and community support

**Why Prisma?**
- **Type Safety**: Generates TypeScript-like types for Python, reducing runtime errors
- **Migration System**: Version-controlled schema changes with automatic migration generation
- **Developer Experience**: Intuitive query API and excellent documentation

#### Containerization: Docker & Docker Compose

**Why Docker?**
- **Consistency**: Ensures the application runs identically across different environments
- **Isolation**: Each service runs in its own container with isolated dependencies
- **Portability**: Easy deployment to any Docker-compatible platform (local, cloud, CI/CD)

**Docker Compose Benefits**:
- **Single Command Deployment**: `docker compose up` starts the entire stack
- **Service Orchestration**: Automatic dependency management and health checks
- **Volume Management**: Persistent storage for database data
- **Network Isolation**: Services communicate through an internal Docker network

### Security Architecture

1. **Password Security**: 
   - Passwords are hashed using bcrypt with automatic salt generation
   - Never stored or transmitted in plain text

2. **Authentication**:
   - JWT tokens stored in HTTP-only cookies (prevents XSS attacks)
   - Tokens expire after 24 hours (configurable)
   - Secure flag enabled for HTTPS environments

3. **API Security**:
   - Protected endpoints require valid JWT tokens
   - CORS configured to allow only frontend origin
   - Environment variables for sensitive configuration (API keys, secrets)

4. **Data Privacy**:
   - YOLO model runs locally (no external API calls for detection)
   - User images processed in-memory, not stored on disk
   - Database connections use internal Docker network (not exposed)

### Data Flow Architecture

**Authentication Flow**:
```
User → Frontend → POST /auth/sign-up → Backend
                                    ├─ Hash password (bcrypt)
                                    ├─ Create user (Prisma)
                                    └─ Generate JWT → Set cookie → Frontend
```

**Object Detection Flow**:
```
User uploads image → Frontend → POST /yolo/detect → Backend
                                              ├─ Load YOLO model
                                              ├─ Process image
                                              ├─ Generate detections
                                              └─ Return annotated image + JSON → Frontend
```

**Q&A Flow**:
```
User asks question → Frontend → POST /gemini/ask → Backend
                                            ├─ Load image + detections
                                            ├─ Call Gemini API (image + prompt)
                                            ├─ Save message to database
                                            └─ Return response → Frontend
```

### Scalability Considerations

- **Stateless Backend**: JWT authentication allows horizontal scaling
- **Database Connection Pooling**: Prisma manages efficient database connections
- **Async Processing**: FastAPI's async support handles concurrent requests efficiently
- **Model Caching**: YOLO model loaded once and reused for multiple requests
- **Container-Based**: Easy to scale individual services independently

## Project Structure

```
yolo/
├── compose.yaml              # Docker Compose configuration
├── README.md                 # This file
├── yolo-backend/             # Backend service
│   ├── Dockerfile            # Backend container definition
│   ├── entrypoint.sh         # Startup script (runs migrations)
│   ├── main.py               # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   ├── database.py           # Prisma database client initialization
│   ├── models/               # YOLO model files
│   │   └── yolov8n.pt       # YOLO v8 nano model weights
│   ├── routers/              # API route handlers
│   │   ├── auth.py          # Authentication routes (sign-up, sign-in)
│   │   ├── yolo.py          # Object detection routes
│   │   ├── gemini.py        # AI Q&A routes
│   │   └── user.py          # User management routes
│   ├── middlewares/          # Custom middleware
│   │   └── auth.py          # JWT token verification middleware
│   └── prisma/              # Prisma configuration
│       ├── schema.prisma    # Database schema definition
│       └── migrations/      # Database migration files
└── yolo-frontend/            # Frontend service
    ├── Dockerfile            # Frontend container definition
    ├── package.json          # Node.js dependencies
    ├── next.config.ts        # Next.js configuration
    ├── app/                  # Next.js app directory
    │   ├── layout.tsx       # Root layout component
    │   ├── page.tsx         # Main dashboard page
    │   ├── auth/            # Authentication pages
    │   │   ├── page.tsx     # Sign-in/Sign-up page
    │   │   └── components/  # Auth form components
    │   ├── components/      # Reusable React components
    │   └── contexts/        # React context providers
    └── api/                 # API client utilities
        └── index.ts         # Axios instance and API functions
```

## Usage Guide

1. **Sign Up**: Create a new account with email, name, and password
2. **Sign In**: Login with your credentials
3. **Upload Image**: Click to select an image file or drag and drop
4. **Detect Objects**: Click "Detect Objects" button to run YOLO detection
5. **View Results**:
   - See annotated image with bounding boxes overlaid
   - Review detection table (sortable by any column: Object, Confidence, Bounding Box)
6. **Ask Questions**: Type questions in the input box below results
   - Questions are answered by Gemini AI using both the image and detection data
   - Example: "How many cars are there?" or "What is the highest-confidence object?"

## API Endpoints

### Authentication

- `POST /auth/sign-up` - Create new user account
  - Body: `{ email, password, name }`
  - Returns: Success message, sets HTTP-only cookie with JWT token

- `POST /auth/sign-in` - Login and get access token
  - Body: `{ email, password, remember? }`
  - Returns: Success message, sets HTTP-only cookie with JWT token

- `POST /auth/sign-out` - Logout (clears authentication cookie)

### Object Detection

- `POST /yolo/detect` - Upload image and get detections (requires authentication)
  - Body: `multipart/form-data` with `file` field
  - Returns: `{ annotatedImage: string, detections: Array<{object, confidence, boundingBox}> }`

### AI Q&A

- `POST /gemini/ask` - Ask question about detections (requires authentication)
  - Body: `multipart/form-data` with `file`, `detections` (JSON string), `question`
  - Returns: `{ content: string, role: "assistant" }`

### User Management

- `GET /user/profile` - Get current user profile (requires authentication)
  - Returns: `{ email: string, name: string }`

- `GET /user/messages` - Get chat message history (requires authentication)
  - Returns: `Array<{ content: string, role: "user" | "assistant" }>`

**Authentication**: All protected endpoints use HTTP-only cookies for JWT tokens. The frontend automatically includes cookies with requests via `withCredentials: true`.

## Troubleshooting

### Port Already in Use

If ports 3000, 8000, or 5432 are already in use:

1. Identify the process using the port:
   ```bash
   # macOS/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. Stop the conflicting service or modify port mappings in `compose.yaml`

### Database Connection Issues

- Ensure database service is healthy: `docker compose ps`
- Check database logs: `docker compose logs db`
- Verify `DATABASE_URL` environment variable is correct
- Ensure backend waits for database (health checks configured in `compose.yaml`)

### YOLO Model Not Found

- Ensure `yolov8n.pt` exists in `yolo-backend/models/` directory
- Model will be downloaded automatically on first run if missing
- Check backend logs for model loading errors: `docker compose logs api`

### Gemini API Errors

- Verify `GEMINI_API_KEY` is set correctly in `yolo-backend/.env`
- Check API quota and rate limits at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Ensure internet connectivity for API calls
- Review error messages in backend logs: `docker compose logs api`

### Build Failures

- Clear Docker cache: `docker compose build --no-cache`
- Check Docker daemon is running: `docker ps`
- Verify sufficient disk space: `docker system df`
- Check Docker logs for specific error messages

### Frontend Not Loading

- Verify frontend container is running: `docker compose ps`
- Check frontend logs: `docker compose logs app`
- Ensure `NEXT_PUBLIC_YOLO_BACKEND_URL` is set correctly (defaults to `http://localhost:8000`)
- Clear browser cache and cookies

### Authentication Issues

- Verify JWT secret key is set in `yolo-backend/.env`
- Check browser console for CORS or cookie errors
- Ensure cookies are enabled in browser settings
- For development, cookies use `SameSite=None` and `Secure=true` (requires HTTPS or localhost)

## Development

### Running Locally (Without Docker)

**Backend**:

```bash
cd yolo-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
export GEMINI_API_KEY=your_key_here
export JWT_SECRET_KEY=your_secret_here
export DATABASE_URL=postgres://postgres:password@localhost:5432/yolo

# Run Prisma migrations
prisma migrate deploy

# Start the server
uvicorn main:app --reload
```

**Frontend**:

```bash
cd yolo-frontend
npm install

# Set environment variable (optional, defaults to http://localhost:8000)
export NEXT_PUBLIC_YOLO_BACKEND_URL=http://localhost:8000

# Start development server
npm run dev
```

**Database**: Requires PostgreSQL running locally or use Docker for database only:

```bash
docker run -d \
  --name yolo-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yolo \
  -p 5432:5432 \
  postgres:alpine
```

## License

This project is created as part of an assignment submission.

## Contact

For questions or issues, please refer to the repository's issue tracker.
