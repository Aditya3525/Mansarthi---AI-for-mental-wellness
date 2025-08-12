# Mansarthi - AI for Mental Wellness 🧠💚

Mansarthi is a comprehensive AI-powered mental wellness platform that provides personalized support through multiple therapeutic approaches. The platform combines Western evidence-based methods, Eastern mindfulness practices, and hybrid approaches to create a tailored mental health experience.

## 🌟 Features

### 🎯 Personalized AI Therapy
- **Multi-Provider AI Support**: OpenAI, Google Gemini, and Ollama integration
- **Path-Based Personalization**: Choose between Western (CBT), Eastern (Mindfulness), or Hybrid approaches
- **Contextual Responses**: AI adapts based on user preferences and assessment results

### 📊 Comprehensive Assessments
- **Initial Mental Health Assessment**: Comprehensive wellbeing evaluation
- **Specialized Tests**: Targeted assessments for specific conditions
- **Micro-Assessments**: Quick daily check-ins
- **Progress Tracking**: Monitor your mental health journey over time

### 🎮 Gamification & Progress
- **XP System**: Earn experience points for engagement
- **Achievement System**: Unlock milestones and rewards
- **Level Progression**: Track your growth journey
- **Habit Tracking**: Build and maintain healthy habits

### 🤖 Advanced AI Features
- **Multimodal Chatbot**: Text and voice interaction capabilities
- **Crisis Support**: 24/7 emergency mental health resources
- **Community Features**: Connect with others on similar journeys
- **Daily Practice Recommendations**: Personalized exercises and activities

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aditya3525/Mansarthi---AI-for-mental-wellness.git
   cd Mansarthi---AI-for-mental-wellness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/mental-wellbeing-app
   
   # AI Providers (at least one required)
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   OLLAMA_URL=http://localhost:11434
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Security
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo service mongod start
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🏗️ Architecture

### Backend Structure
```
├── server.js              # Main application server
├── config/
│   ├── database.js         # MongoDB connection
│   ├── aiService.js        # Multi-provider AI service
│   ├── errorHandler.js     # Global error handling
│   ├── metaManager.js      # Metadata management
│   └── personalization-engine.js  # User personalization
├── models/
│   └── User.js            # User data model
└── public/                # Frontend static files
```

### Frontend Pages
- **`index.html`**: Landing page and user registration
- **`login.html`**: User authentication
- **`dashboard.html`**: Main user dashboard
- **`assessment.html`**: Comprehensive mental health assessment
- **`chatbot.html`**: AI conversation interface
- **`path-selection.html`**: Therapeutic approach selection
- **`progress-tracking.html`**: User progress visualization
- **`community.html`**: Community features
- **`crisis-support.html`**: Emergency resources

## 🤖 AI Integration

### Supported Providers
1. **OpenAI GPT**: Advanced conversational AI with medical knowledge
2. **Google Gemini**: Multi-modal AI with contextual understanding
3. **Ollama**: Local AI models for privacy-focused deployments

### Therapeutic Approaches
- **Western/Evidence-Based**: CBT, DBT, and structured therapy techniques
- **Eastern/Mindfulness**: Meditation, breathing exercises, and holistic wellness
- **Hybrid**: Integrated approach combining both methodologies

## 📱 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Assessments
- `POST /api/assessment` - Submit assessment results
- `GET /api/user-data` - Get user profile and assessment history

### AI Chat
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat-history` - Retrieve chat history

### Progress Tracking
- `POST /api/progress` - Update user progress
- `GET /api/progress` - Get progress data

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure user sessions
- **Input Validation**: Sanitized user inputs
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure API key management

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For development testing:
```bash
npm run test:dev
```

## 🚀 Deployment

### Using Docker
```bash
docker build -t mansarthi .
docker run -p 3000:3000 mansarthi
```

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "mansarthi"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

### Crisis Support
If you're experiencing a mental health crisis:
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

### Mental Health Resources
- **National Alliance on Mental Illness (NAMI)**: https://www.nami.org/
- **Mental Health America**: https://www.mhanational.org/
- **WHO Mental Health**: https://www.who.int/health-topics/mental-health

## 📞 Contact

- **Project Creator**: Aditya3525
- **Repository**: [Mansarthi - AI for Mental Wellness](https://github.com/Aditya3525/Mansarthi---AI-for-mental-wellness)
- **Issues**: [GitHub Issues](https://github.com/Aditya3525/Mansarthi---AI-for-mental-wellness/issues)

---

**Disclaimer**: This application is designed to provide supportive resources and should not replace professional mental health treatment. Always consult with qualified healthcare professionals for serious mental health concerns.