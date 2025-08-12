# Mansarthi API Documentation

## Overview
The Mansarthi API provides endpoints for mental wellness support, including user authentication, assessments, AI chatbot interaction, and progress tracking.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require user authentication. Include the user ID in the request body where specified.

## Endpoints

### Authentication

#### Register User
```http
POST /api/register
```

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "password123",
    "age": 25
}
```

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, required, unique
- `password`: At least 8 characters with letters and numbers, required
- `age`: Number between 13-120, required

**Response (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

#### Login User
```http
POST /api/login
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "selectedPath": "western",
        "currentLevel": 1,
        "totalXP": 0
    }
}
```

### User Data

#### Get User Data
```http
GET /api/user-data?userId=user_id
```

**Response (200):**
```json
{
    "success": true,
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "selectedPath": "western",
        "currentLevel": 1,
        "totalXP": 150,
        "assessments": [...],
        "achievements": [...],
        "chatHistory": [...]
    }
}
```

### Assessments

#### Save Assessment
```http
POST /api/save-assessment
```

**Request Body:**
```json
{
    "userId": "user_id",
    "assessmentResults": {
        "answers": [3, 4, 2, 5, 1, 3, 4, 2, 5, 1],
        "score": 75,
        "recommendation": "You're doing well overall..."
    },
    "userInfo": {
        "assessmentType": "general"
    }
}
```

**Validation Rules:**
- `answers`: Array of numbers 1-5, required
- `assessmentType`: String, optional

**Response (200):**
```json
{
    "success": true,
    "message": "Assessment saved successfully",
    "user": {
        "id": "user_id",
        "assessments": [...],
        "totalXP": 160,
        "achievements": [...]
    }
}
```

### Path Selection

#### Save Path Selection
```http
POST /api/save-path
```

**Request Body:**
```json
{
    "userId": "user_id",
    "selectedPath": "western",
    "pathDetails": {
        "preferences": ["CBT", "structured_approach"],
        "goals": ["anxiety_management", "mood_improvement"]
    }
}
```

**Available Paths:**
- `western`: Evidence-based, CBT approaches
- `eastern`: Mindfulness, meditation approaches  
- `hybrid`: Combined Western and Eastern methods

**Response (200):**
```json
{
    "success": true,
    "message": "Path selection saved successfully",
    "user": {
        "selectedPath": "western",
        "pathDetails": {...},
        "totalXP": 170
    }
}
```

### AI Chat

#### Send Chat Message
```http
POST /api/chat
```

**Request Body:**
```json
{
    "message": "I'm feeling anxious about work today",
    "userId": "user_id",
    "assessmentResults": {
        "score": 75
    },
    "inputMode": "text",
    "emotionContext": "anxious"
}
```

**Validation Rules:**
- `message`: String, 1-1000 characters, required
- `userId`: String, required for saving chat history
- `inputMode`: Optional, defaults to "text"

**Response (200):**
```json
{
    "success": true,
    "response": "I understand you're feeling anxious about work. Let's try a grounding technique...",
    "timestamp": "2023-01-01T12:00:00.000Z",
    "xpGained": 5
}
```

### Progress Tracking

#### Update Progress
```http
POST /api/update-progress
```

**Request Body:**
```json
{
    "userId": "user_id",
    "activity": "daily_checkin",
    "xpGained": 10
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Progress updated successfully",
    "user": {
        "currentLevel": 2,
        "totalXP": 180,
        "achievements": [...]
    }
}
```

#### Get Progress Data
```http
GET /api/progress?userId=user_id
```

**Response (200):**
```json
{
    "success": true,
    "progress": {
        "currentLevel": 2,
        "totalXP": 180,
        "xpToNextLevel": 120,
        "milestonesReached": [...],
        "achievements": [...],
        "habitTracking": {...}
    }
}
```

## Error Responses

### Validation Error (400)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "Email is required",
        "Password must be at least 8 characters"
    ]
}
```

### Authentication Error (401)
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Internal server error"
}
```

## AI Service Configuration

The application supports multiple AI providers:

1. **OpenAI GPT** - Set `OPENAI_API_KEY` in environment
2. **Google Gemini** - Set `GEMINI_API_KEY` in environment  
3. **Ollama** - Set `OLLAMA_URL` (defaults to http://localhost:11434)

The service will automatically try providers in order and fall back to predefined responses if all fail.

## Rate Limiting

- Default: 100 requests per minute per IP
- Configure with `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`

## Security Features

- Password hashing with bcrypt
- Input sanitization (removes script tags)
- CORS protection
- Request size limits (10MB)
- Environment variable configuration