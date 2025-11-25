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

## Technical Stack

- **Frontend**: Next.js 16 (React 19, TypeScript)

  - Tailwind CSS for styling
  - React Query for data fetching
  - React Hook Form for form management
  - Axios for HTTP requests

- **Backend**: Python FastAPI

  - Ultralytics YOLO v8 for object detection
  - Google Gemini 2.5 Flash for AI Q&A
  - Prisma ORM for database operations
  - JWT for authentication
  - bcrypt for password hashing

- **Database**: PostgreSQL

  - User authentication data
  - Chat message history

- **Containerization**: Docker & Docker Compose
  - Multi-container setup
  - Health checks for service dependencies
  - Volume persistence for database

## Architecture

The application follows a microservices architecture with three main services:

1. **Frontend Service** (Next.js) - Port 3000

   - User interface, image uploads, and result visualization
   - Communicates with backend via REST API

2. **Backend Service** (FastAPI) - Port 8000

   - Authentication, image processing, and AI integration
   - API routes: `/auth/*`, `/yolo/detect`, `/gemini/ask`, `/user/*`

3. **Database Service** (PostgreSQL) - Port 5432
   - Stores user accounts and chat message history
   - Persistent volume for data retention

### Data Flow

- **Authentication**: User signs up/in → Password hashed → JWT token issued → Used for authenticated requests
- **Object Detection**: Image uploaded → YOLO processes locally → Returns annotated image + detection list
- **Q&A**: Question + image + detections → Gemini API → Context-aware response → Saved to database

### Security

- Password hashing with bcrypt
- JWT authentication with 24-hour expiration
- Protected API endpoints
- CORS configured for frontend origin
- Environment variables for sensitive data

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd yolo
   ```

2. **Set up environment variables**:

   Create a `.env` file in the `yolo-backend` directory:

   ```bash
   cd yolo-backend
   touch .env
   ```

   Add the following variables to `.env`:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ```

   **Note**:

   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate a secure random string for `JWT_SECRET_KEY`:
     ```bash
     openssl rand -hex 32
     ```

3. **Run the application with Docker**:

   ```bash
   cd ..  # Return to project root
   docker compose up
   ```

   This command will:

   - Build the frontend and backend Docker images
   - Start PostgreSQL database
   - Run database migrations automatically
   - Start all services

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs (FastAPI Swagger UI)

**Note**: On first startup, the backend will automatically connect to the database, run migrations, and initialize the YOLO model. The first detection request may take longer as the YOLO model loads into memory.

## Running the Application with Docker

### Start Services

Start all services (frontend, backend, and database):

```bash
docker compose up
```

To run in detached mode (background):

```bash
docker compose up -d
```

### Stop Services

Stop all running services:

```bash
docker compose down
```

To stop and remove volumes (clears database data):

```bash
docker compose down -v
```

### View Logs

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

### Rebuild After Code Changes

If you've made changes to the code, rebuild the images:

```bash
docker compose up --build
```

### Common Docker Commands

```bash
# Check running containers
docker compose ps

# Restart a specific service
docker compose restart api

# Execute commands in a running container
docker compose exec api bash
```

## Project Structure

```
yolo/
├── compose.yaml              # Docker Compose configuration
├── README.md                 # This file
├── yolo-backend/             # Backend service
│   ├── Dockerfile
│   ├── entrypoint.sh         # Startup script
│   ├── main.py               # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   ├── database.py           # Prisma database client
│   ├── models/               # YOLO model files
│   │   └── yolov8n.pt
│   ├── routers/              # API route handlers
│   │   ├── auth.py          # Authentication routes
│   │   ├── yolo.py          # Object detection routes
│   │   ├── gemini.py        # AI Q&A routes
│   │   └── user.py          # User management routes
│   ├── middlewares/          # Custom middleware
│   │   └── auth.py          # JWT verification
│   ├── migrations/           # Database migrations
│   └── prisma/              # Prisma schema
└── yolo-frontend/            # Frontend service
    ├── Dockerfile
    ├── package.json          # Node.js dependencies
    ├── app/                  # Next.js app directory
    │   ├── page.tsx         # Landing/auth pages
    │   ├── yolo/            # Main application pages
    │   │   └── page.tsx     # Image upload & results page
    │   └── components/      # React components
    └── api/                 # API client utilities
```

## Usage Guide

1. **Sign Up**: Create a new account with email, name, and password
2. **Sign In**: Login with your credentials
3. **Upload Image**: Click to select an image file
4. **Detect Objects**: Click "Detect Objects" button to run YOLO detection
5. **View Results**:
   - See annotated image with bounding boxes
   - Review detection table (sortable by any column)
6. **Ask Questions**: Type questions in the input box below results
   - Questions are answered by Gemini AI using both the image and detection data

## API Endpoints

### Authentication

- `POST /auth/sign-up` - Create new user account
- `POST /auth/sign-in` - Login and get access token

### Object Detection

- `POST /yolo/detect` - Upload image and get detections (requires authentication)

### AI Q&A

- `POST /gemini/ask` - Ask question about detections (requires authentication)

### User Management

- `GET /user/profile` - Get current user profile (requires authentication)

All authenticated endpoints require an `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Technical Choices & Rationale

### Frontend: Next.js

- **Server-side rendering** for better SEO and initial load performance
- **App Router** for modern React patterns and file-based routing
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for rapid, responsive UI development

### Backend: FastAPI

- **High performance** async framework suitable for AI workloads
- **Automatic API documentation** with Swagger/OpenAPI
- **Type validation** with Pydantic models
- **Easy integration** with ML libraries and external APIs

### Database: PostgreSQL with Prisma

- **Relational database** for structured user and message data
- **Prisma ORM** for type-safe database queries
- **Migration system** for schema versioning

### Object Detection: YOLO v8

- **State-of-the-art** real-time object detection
- **Lightweight nano model** (yolov8n.pt) for faster inference
- **Local execution** ensures privacy and no external API costs

### AI Assistant: Gemini 2.5 Flash

- **Multimodal capabilities** (text + image input)
- **Fast inference** with Flash model variant
- **Context-aware** responses using both image and structured detection data

### Docker Compose

- **Easy deployment** with single command
- **Service isolation** and dependency management
- **Health checks** ensure services start in correct order
- **Volume persistence** for database data

## Troubleshooting

### Port Already in Use

If ports 3000, 8000, or 5432 are already in use:

- Stop conflicting services, or
- Modify port mappings in `compose.yaml`

### Database Connection Issues

- Ensure database service is healthy before backend starts
- Check `DATABASE_URL` environment variable
- Verify PostgreSQL is accessible from backend container

### YOLO Model Not Found

- Ensure `yolov8n.pt` exists in `yolo-backend/models/` directory
- Model will be downloaded automatically on first run if missing

### Gemini API Errors

- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Check API quota and rate limits
- Ensure internet connectivity for API calls

### Build Failures

- Clear Docker cache: `docker compose build --no-cache`
- Check Docker daemon is running
- Verify sufficient disk space

## Development

### Running Locally (Without Docker)

**Backend**:

```bash
cd yolo-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**:

```bash
cd yolo-frontend
npm install
npm run dev
```

**Database**: Requires PostgreSQL running locally or use Docker for database only.

## License

This project is created as part of an assignment submission.

## Contact

For questions or issues, please refer to the repository's issue tracker.
