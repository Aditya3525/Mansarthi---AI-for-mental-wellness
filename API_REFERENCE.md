# API Reference Documentation

## 🔗 Complete API Endpoint Reference

### Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
```http
POST /api/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securePassword123",
  "age": 25
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "registrationDate": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. User Login
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. User Logout
```http
POST /api/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 📊 Assessment Endpoints

### 1. Save Assessment Results
```http
POST /api/save-assessment
```

**Request Body:**
```json
{
  "userId": "user_id_here",
  "assessmentResults": {
    "score": 75,
    "answers": [3, 4, 2, 5, 3, 4, 2, 1, 3, 4],
    "recommendation": "Your mental wellness is good overall. Consider incorporating daily mindfulness practices.",
    "type": "general",
    "completedAt": "2024-01-15T10:30:00.000Z"
  },
  "userInfo": {
    "birthday": "1995-05-15",
    "contact": "+1234567890",
    "gender": "non-binary"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Assessment saved successfully",
  "userId": "user_id_here",
  "assessmentsCount": 3
}
```

### 2. Get User Assessments
```http
GET /api/user/:userId/assessments
```

**Response:**
```json
{
  "success": true,
  "assessments": [
    {
      "score": 75,
      "answers": [3, 4, 2, 5, 3, 4, 2, 1, 3, 4],
      "recommendation": "Your mental wellness is good overall...",
      "completedAt": "2024-01-15T10:30:00.000Z",
      "type": "general"
    }
  ]
}
```

---

## 🤖 AI Chat Endpoints

### 1. Send Chat Message
```http
POST /api/chat
```

**Request Body:**
```json
{
  "message": "I'm feeling anxious about work today",
  "userId": "user_id_here",
  "assessmentResults": {
    "score": 65,
    "strugglingAreas": ["anxiety", "stress"]
  },
  "inputMode": "text",
  "emotionContext": {
    "primary": "anxious",
    "intensity": 7
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "I understand you're feeling anxious about work. That's a completely normal response to workplace stress. Let's try a quick grounding technique...",
  "provider": "openai",
  "contextUsed": {
    "userPath": "hybrid",
    "assessmentScore": 65,
    "strugglingAreas": ["anxiety", "stress"]
  }
}
```

### 2. Get Chat History
```http
GET /api/user/:userId/chat-history
```

**Response:**
```json
{
  "success": true,
  "chatHistory": [
    {
      "message": "I'm feeling anxious about work today",
      "response": "I understand you're feeling anxious...",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🛣️ Personalization Endpoints

### 1. Update User Path
```http
POST /api/update-user-path
```

**Request Body:**
```json
{
  "userId": "user_id_here",
  "selectedPath": "hybrid",
  "pathDetails": {
    "preferences": ["mindfulness", "cbt"],
    "goals": ["reduce_anxiety", "improve_sleep"],
    "experience": "beginner"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User path updated successfully",
  "selectedPath": "hybrid"
}
```

### 2. Get Personalized Recommendations
```http
GET /api/user/:userId/recommendations
```

**Response:**
```json
{
  "success": true,
  "recommendations": {
    "daily": [
      "Combine CBT journaling with mindful awareness",
      "Practice structured breathing exercises",
      "Set mindful goals with present-moment check-ins"
    ],
    "struggling": [
      "Use mindful problem-solving techniques",
      "Practice evidence-based meditation",
      "Combine behavioral activation with mindfulness"
    ],
    "resources": [
      "Integrated therapy techniques",
      "Mindful CBT exercises",
      "Balanced wellness practices"
    ]
  },
  "userPath": "hybrid"
}
```

---

## 🎯 Progress Tracking Endpoints

### 1. Get Growth Journey Data
```http
GET /api/growth-journey/:userId
```

**Response:**
```json
{
  "success": true,
  "journey": {
    "level": 3,
    "totalXP": 425,
    "xpInCurrentLevel": 25,
    "xpForNextLevel": 200,
    "milestonesReached": [
      {
        "id": 1,
        "name": "Welcome Aboard",
        "earned": true
      },
      {
        "id": 2,
        "name": "Building Foundations", 
        "earned": true
      }
    ],
    "daysSinceJoin": 15,
    "assessmentsCompleted": 3,
    "chatsSessions": 12
  }
}
```

### 2. Award User Reward
```http
POST /api/growth-journey/:userId/reward
```

**Request Body:**
```json
{
  "rewardType": "achievement",
  "rewardValue": 50,
  "description": "Completed 7-day mindfulness streak"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reward earned successfully",
  "reward": {
    "type": "achievement",
    "value": 50,
    "description": "Completed 7-day mindfulness streak",
    "earnedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 👥 Community Endpoints

### 1. Get Group Sessions
```http
GET /api/group-sessions
```

**Query Parameters:**
- `type` (optional): Filter by session type
- `limit` (optional): Number of sessions to return

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session_1",
      "title": "Mindful Monday Check-in",
      "description": "Start your week with mindful intention setting",
      "startTime": "2024-01-15T18:00:00.000Z",
      "duration": 60,
      "facilitator": "Dr. Sarah Wilson",
      "maxParticipants": 12,
      "currentParticipants": 8,
      "type": "mindfulness"
    }
  ],
  "total": 5
}
```

### 2. Join Group Session
```http
POST /api/group-sessions/:sessionId/join
```

**Request Body:**
```json
{
  "userId": "user_id_here",
  "isAnonymous": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined session",
  "sessionToken": "mock_session_token_session_1",
  "joinUrl": "/group-session/session_1",
  "guidelines": [
    "Maintain respectful communication",
    "Share only what feels comfortable",
    "Listen without judgment",
    "Support others with kindness"
  ]
}
```

---

## 🚨 System & Support Endpoints

### 1. Error Logging
```http
POST /api/errors
```

**Request Body:**
```json
{
  "error": {
    "message": "TypeError: Cannot read property 'score' of undefined",
    "stack": "Error stack trace...",
    "page": "/dashboard",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Error logged successfully"
}
```

### 2. Submit Feedback
```http
POST /api/feedback
```

**Request Body:**
```json
{
  "feedback": {
    "text": "The chatbot responses are very helpful, but could use more personalization",
    "page": "/multimodal-chatbot",
    "rating": 4,
    "category": "feature_request"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

---

## 🛠️ Specialized Testing Endpoints

### 1. Save Specialized Test Results
```http
POST /api/specialized-test
```

**Request Body:**
```json
{
  "userId": "user_id_here",
  "testType": "anxiety_gad7",
  "results": {
    "score": 12,
    "severity": "moderate",
    "answers": [2, 3, 2, 1, 3, 2, 1],
    "recommendations": [
      "Consider speaking with a mental health professional",
      "Practice daily relaxation techniques",
      "Monitor anxiety triggers in a journal"
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Specialized test results saved",
  "testId": "test_result_id"
}
```

### 2. Get Specialized Test History
```http
GET /api/user/:userId/specialized-tests
```

**Response:**
```json
{
  "success": true,
  "tests": [
    {
      "testType": "anxiety_gad7",
      "score": 12,
      "severity": "moderate",
      "completedAt": "2024-01-15T10:30:00.000Z",
      "recommendations": ["Consider speaking with a mental health professional..."]
    }
  ]
}
```

---

## 📱 Microassessment Endpoints

### 1. Submit Daily Check-in
```http
POST /api/microassessment
```

**Request Body:**
```json
{
  "userId": "user_id_here",
  "responses": {
    "mood": 7,
    "energy": 6,
    "stress": 4,
    "sleep": 8,
    "social": 5
  },
  "notes": "Had a good day overall, work was manageable"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Daily check-in saved",
  "score": 72,
  "trend": "improving",
  "recommendations": [
    "Your mood and energy are good today!",
    "Consider stress management techniques for tomorrow"
  ]
}
```

### 2. Get Microassessment Trends
```http
GET /api/user/:userId/microassessment-trends
```

**Query Parameters:**
- `period`: "week", "month", "quarter"
- `format`: "chart", "summary"

**Response:**
```json
{
  "success": true,
  "trends": {
    "period": "week",
    "averageScore": 68,
    "improvement": "+5%",
    "strongAreas": ["sleep", "mood"],
    "needsAttention": ["stress", "social"],
    "dailyScores": [65, 70, 68, 72, 75, 69, 71]
  }
}
```

---

## 🔒 Authentication & Security

### Headers Required
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>  // For protected routes
```

### Error Response Format
All endpoints return errors in consistent format:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

### Rate Limiting
- **General endpoints**: 100 requests per minute per IP
- **AI Chat endpoint**: 20 requests per minute per user
- **Assessment endpoints**: 50 requests per minute per user

### Status Codes
- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (access denied)
- **404**: Not Found
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

---

This API reference provides complete documentation for all endpoints available in the Mansarthi mental wellness platform, including request/response examples and authentication requirements.