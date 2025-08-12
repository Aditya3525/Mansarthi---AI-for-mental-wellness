# User Journey & Technical Flow Documentation

## 🗺️ Complete User Journey Map

### 1. Onboarding Flow
```
Landing Page (/) → Registration → Initial Assessment → Path Selection → Dashboard
```

#### Step-by-Step Onboarding:
1. **Landing Page** (`index.html`)
   - User sees welcome message and project overview
   - Options to register or login
   - Introduction to AI-powered mental wellness

2. **Registration** (`login.html`)
   - User provides: name, email, password, age
   - Server creates user account with bcrypt password hashing
   - Automatic redirect to assessment

3. **Initial Assessment** (`assessment.html`)
   - Comprehensive mental health questionnaire
   - AI analyzes responses and calculates wellbeing score
   - Generates personalized recommendations

4. **Path Selection** (`path-selection.html`)
   - User chooses wellness approach:
     - **Western**: CBT, structured therapy
     - **Eastern**: Mindfulness, meditation
     - **Hybrid**: Integrated approach
   - System customizes all future interactions based on selection

5. **Dashboard** (`dashboard.html`)
   - Personalized home base with daily recommendations
   - Progress tracking, upcoming practices
   - Quick access to all features

### 2. Daily Use Patterns

#### Morning Routine Flow
```
Dashboard → Micro-Assessment → Daily Practice → AI Chat (if needed)
```

#### Wellness Session Flow
```
Dashboard → Multimodal Chatbot → Specialized Tests → Progress Tracking
```

#### Crisis Support Flow
```
Any Page → Crisis Detection → Crisis Support → Professional Resources
```

---

## 🔧 Technical Architecture Flow

### 1. Request Processing Pipeline

```
User Request → Express Middleware → Authentication → Database Query → AI Processing → Response
```

#### Detailed Request Flow:
1. **Middleware Stack**:
   ```javascript
   app.use(cors());                    // Enable cross-origin requests
   app.use(express.json());           // Parse JSON bodies
   app.use(express.static('public')); // Serve static files
   ```

2. **Authentication Layer**:
   - Session validation for protected routes
   - User identification for personalization
   - Security checks for data access

3. **Database Operations**:
   - MongoDB queries through Mongoose
   - User data retrieval and updates
   - Assessment and chat history storage

4. **AI Processing**:
   - Multi-provider fallback system
   - Context-aware prompt generation
   - Response personalization based on user path

### 2. AI Service Integration Flow

```
User Message → Context Building → Provider Selection → AI API Call → Response Processing → User
```

#### AI Processing Steps:
1. **Context Building**:
   ```javascript
   // Combine user data for AI context
   const context = {
     assessmentResults: user.assessments[0],
     selectedPath: user.selectedPath,
     recentChatHistory: user.chatHistory.slice(-5),
     strugglingAreas: personalization.strugglingAreas
   };
   ```

2. **Provider Selection**:
   ```javascript
   const providers = [
     () => this.tryOpenAI(message, context),      // Primary
     () => this.tryGemini(message, context),      // Secondary  
     () => this.tryOllama(message, context),      // Local
     () => this.getFallbackResponse(message)      // Backup
   ];
   ```

3. **Response Enhancement**:
   - Path-specific therapeutic techniques
   - Crisis detection and escalation
   - Personalized recommendations integration

### 3. Database Schema Relationships

```
User (Root Document)
├── assessments: [Assessment]
├── chatHistory: [ChatMessage]
├── pathDetails: PathConfiguration
├── milestonesReached: [Milestone]
├── achievements: [Achievement]
└── habitTracking: HabitData
```

#### User Data Flow:
```
Registration → Profile Creation → Assessment Storage → Path Selection → 
Continuous Updates (Chat, Progress, Habits) → Analytics & Personalization
```

---

## 🎯 Feature Interaction Map

### 1. Assessment System Integration

```
Initial Assessment → Path Recommendation → Daily Micro-assessments → 
Specialized Tests → Progress Analytics → AI Chat Context
```

#### Assessment Data Flow:
1. **Collection**: User answers questionnaire
2. **Processing**: Score calculation and categorization
3. **Storage**: MongoDB assessment array update
4. **Integration**: Assessment context feeds into AI responses
5. **Analytics**: Trend analysis for personalization

### 2. Personalization Engine Workflow

```
User Behavior Data → Pattern Analysis → Recommendation Generation → 
UI Customization → Content Personalization
```

#### Personalization Components:
1. **Data Collection**:
   ```javascript
   {
     practiceFrequency: calculated from user activities,
     engagementLevel: based on recent interactions,
     strugglingAreas: extracted from chat analysis,
     improvementTrends: longitudinal assessment comparison
   }
   ```

2. **Recommendation Types**:
   - **Daily Practice**: Tailored to user path and engagement level
   - **Struggling Support**: Targeted help for identified challenges
   - **Learning Content**: Progressive skill-building materials
   - **Urgent Care**: Crisis intervention when patterns indicate risk

### 3. Gamification Integration

```
User Actions → XP Calculation → Level Progression → Milestone Checks → 
Achievement Unlocks → Reward Distribution
```

#### XP System Mechanics:
```javascript
// XP Calculation
totalXP = (assessments.length * 50) +     // 50 XP per assessment
          (chatSessions * 10) +           // 10 XP per chat
          (dailyActivityDays * 5);        // 5 XP per active day

// Level Calculation  
level = Math.floor(totalXP / 200) + 1;   // 200 XP per level
```

---

## 🔄 Data Flow Diagrams

### 1. User Registration & Onboarding
```
[User] → [Frontend Form] → [POST /api/register] → [Input Validation] → 
[Password Hashing] → [MongoDB Save] → [Success Response] → [Redirect to Assessment]
```

### 2. AI Chat Interaction
```
[User Message] → [POST /api/chat] → [User Context Retrieval] → [AI Provider Selection] → 
[API Call with Context] → [Response Processing] → [Chat History Update] → [Response to User]
```

### 3. Assessment Processing
```
[Assessment Submission] → [POST /api/save-assessment] → [Score Calculation] → 
[Recommendation Generation] → [Database Update] → [Personalization Engine Update] → 
[Progress Tracking Update] → [Success Response]
```

### 4. Progress Tracking Update
```
[User Activity] → [XP Calculation] → [Level Check] → [Milestone Evaluation] → 
[Achievement Unlock] → [Database Update] → [UI Notification]
```

---

## 🛡️ Security & Error Handling Flow

### 1. Error Handling Pipeline
```
[Error Occurrence] → [Error Capture] → [Error Classification] → [Logging] → 
[User Notification] → [Recovery Action] → [Monitoring Alert]
```

### 2. Crisis Detection Flow
```
[User Message/Assessment] → [Content Analysis] → [Risk Assessment] → 
[Crisis Classification] → [Immediate Resources] → [Professional Escalation]
```

### 3. Privacy Protection Flow
```
[Data Collection] → [Consent Verification] → [Encryption] → [Secure Storage] → 
[Access Control] → [Audit Logging] → [Data Retention Management]
```

---

## 📱 Frontend State Management

### 1. Client-Side Data Flow
```
Page Load → User Authentication Check → Data Fetching → State Initialization → 
Component Rendering → User Interaction → State Updates → Server Sync
```

### 2. Local Storage Strategy
```javascript
// Stored Client-Side for Performance
{
  userPreferences: {},           // UI customizations
  practiceData: {},             // Daily activity tracking
  assessmentHistory: [],        // Recent assessments for analytics
  chatHistory: [],              // Recent conversations
  personalizationData: {}       // Behavior patterns cache
}
```

### 3. Real-Time Features
```
User Action → Frontend Update → API Call → Server Processing → 
Database Update → Response → Frontend Sync → UI Update
```

---

## 🔧 Development & Deployment Flow

### 1. Development Workflow
```
Code Change → Local Testing → Git Commit → Push to Repository → 
CI/CD Pipeline → Automated Testing → Deployment → Monitoring
```

### 2. Data Migration Strategy
```
Schema Changes → Migration Scripts → Backup Creation → 
Gradual Rollout → Data Validation → Rollback Plan
```

### 3. Performance Optimization Flow
```
Performance Monitoring → Bottleneck Identification → Optimization Implementation → 
Testing → Deployment → Performance Validation
```

---

This technical flow documentation provides a comprehensive understanding of how all components of the Mansarthi platform interact, from user onboarding through daily use patterns to crisis intervention workflows.