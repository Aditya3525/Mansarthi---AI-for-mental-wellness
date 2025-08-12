# Mansarthi - AI for Mental Wellness 🧠✨

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4+-blue.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v5+-red.svg)](https://expressjs.com/)
[![AI Powered](https://img.shields.io/badge/AI-Multi--Provider-purple.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Transform your mental wellness journey with AI-powered support, personalized practices, and community connection.**

Mansarthi is a comprehensive mental wellness platform that combines evidence-based therapeutic approaches with cutting-edge AI technology to provide personalized mental health support, accessible 24/7.

## 🌟 Key Features

### 🤖 **AI-Powered Chat Companion**
- Multi-provider AI integration (OpenAI GPT, Google Gemini, Ollama)
- Context-aware responses based on user assessments and wellness path
- Crisis detection and appropriate resource escalation
- Therapeutic technique integration (CBT, mindfulness, etc.)

### 📊 **Comprehensive Assessment System**
- Initial mental health screening with personalized recommendations
- Daily micro-assessments for continuous monitoring
- Specialized tests for specific conditions (anxiety, depression, stress)
- Progress tracking with trend analysis

### 🛣️ **Personalized Wellness Paths**
- **Western Path**: Evidence-based therapy (CBT, behavioral activation)
- **Eastern Path**: Mindfulness, meditation, contemplative practices
- **Hybrid Path**: Integrated approach combining both methodologies

### 🎯 **Gamified Progress Tracking**
- XP-based level system for engagement
- Milestone achievements and rewards
- Habit tracking and streak monitoring
- Visual progress journey representation

### 👥 **Community Support**
- Anonymous group support sessions
- Peer interaction and encouragement
- Facilitated wellness discussions
- Safe space content moderation

### 🚨 **Crisis Support System**
- 24/7 emergency resource access
- Automatic crisis detection
- Professional referral protocols
- Safety planning tools

## 🏗️ Technical Architecture

### **Backend Stack**
- **Server**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcryptjs + JWT sessions
- **AI Integration**: Multi-provider fallback system

### **Frontend Stack**
- **UI**: Responsive HTML5/CSS3 with modern JavaScript
- **Personalization**: Client-side behavior analytics
- **Error Handling**: Comprehensive logging and user feedback
- **SEO**: Dynamic meta management for all pages

### **AI & Machine Learning**
- **Primary AI**: OpenAI GPT for conversational intelligence
- **Secondary AI**: Google Gemini for diverse response patterns
- **Local AI**: Ollama support for privacy-focused deployments
- **Personalization**: Behavior pattern analysis and recommendation engine

## 📁 Project Structure

```
mansarthi/
├── 📄 server.js                     # Main Express server (959 lines)
├── 📦 package.json                  # Dependencies & scripts
├── ⚙️ config/                       # Configuration modules
│   ├── database.js                  # MongoDB connection
│   ├── aiService.js                 # Multi-provider AI integration  
│   ├── personalization-engine.js   # User behavior analysis
│   ├── errorHandler.js              # Error management system
│   └── metaManager.js               # SEO meta management
├── 🗃️ models/                       # Database schemas
│   └── User.js                      # Comprehensive user model
├── 🌐 public/                       # Frontend application
│   ├── index.html                   # Landing page
│   ├── login.html                   # Authentication
│   ├── dashboard.html               # User dashboard  
│   ├── assessment.html              # Mental health assessments
│   ├── multimodal-chatbot.html      # AI chat interface
│   ├── path-selection.html          # Wellness path selection
│   ├── growth-journey.html          # Progress tracking
│   ├── community.html               # Social features
│   ├── crisis-support.html          # Emergency resources
│   └── js/                          # Client-side JavaScript
└── 📚 docs/                         # Documentation
    ├── PROJECT_DOCUMENTATION.md     # Complete project overview
    ├── TECHNICAL_FLOW.md            # User journey & technical flows
    └── API_REFERENCE.md             # Complete API documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local instance or cloud)
- Optional: AI API keys for enhanced features

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

3. **Environment setup**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Edit with your configuration
   nano .env
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the platform**
   ```
   Open your browser to http://localhost:3000
   ```

### Environment Configuration

```env
# Database Connection
MONGODB_URI=mongodb://localhost:27017/mental-wellbeing-app

# AI Service Keys (Optional but recommended)
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_URL=http://localhost:11434

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📖 Complete Documentation

### 📚 **Comprehensive Guides**
- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Complete project overview, features, and architecture
- **[TECHNICAL_FLOW.md](TECHNICAL_FLOW.md)** - User journeys, data flows, and technical architecture
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API endpoint documentation

### 🎯 **User Journey Overview**

1. **Onboarding**: Registration → Assessment → Path Selection → Dashboard
2. **Daily Use**: Micro-assessments → AI Chat → Progress Tracking
3. **Community**: Group Sessions → Peer Support → Shared Growth
4. **Crisis Support**: Immediate Resources → Professional Referral

### 🔧 **API Endpoints Summary**

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Auth** | `/api/register`, `/api/login` | User authentication |
| **Assessment** | `/api/save-assessment`, `/api/chat` | Mental health evaluation |
| **AI Chat** | `/api/chat`, `/api/chat-history` | AI conversation system |
| **Progress** | `/api/growth-journey`, `/api/recommendations` | Tracking & personalization |
| **Community** | `/api/group-sessions` | Social support features |

## 🎨 User Interface Highlights

### **Modern, Accessible Design**
- Gradient-based calming color schemes
- Responsive layout for all device types
- Accessibility-first approach (WCAG 2.1 compliant)
- Intuitive navigation and user flows

### **Personalized Dashboard**
- Real-time progress visualization
- Personalized daily recommendations
- Quick access to all platform features
- Adaptive content based on user path

### **AI Chat Interface**
- Natural language conversation
- Context-aware therapeutic responses
- Crisis detection and support escalation
- Multimodal input support (text, voice notes)

## 🔒 Security & Privacy

### **Data Protection**
- End-to-end encryption for sensitive data
- bcryptjs password hashing with salt rounds
- Minimal data collection principle
- GDPR compliance architecture

### **Crisis Management**
- Automated content moderation
- Professional escalation protocols
- 24/7 emergency resource access
- Immediate intervention for high-risk users

### **Privacy Features**
- Anonymous community participation
- Data export and deletion capabilities
- Transparent privacy policy
- User consent for all data collection

## 🌍 Impact & Mission

### **Democratizing Mental Health**
Mansarthi aims to make evidence-based mental health support accessible to everyone, regardless of geographic location, economic status, or cultural background.

### **Key Benefits**
- **Accessibility**: 24/7 AI-powered support
- **Personalization**: Adaptive to individual needs and preferences
- **Evidence-Based**: Grounded in proven therapeutic approaches
- **Community**: Social support and shared healing
- **Privacy**: Secure, confidential, and user-controlled

### **Target Impact**
- Reduce barriers to mental health support
- Provide early intervention for mental health challenges
- Support existing therapy with continuous care
- Build resilient communities around mental wellness

## 🤝 Contributing

We welcome contributions from developers, mental health professionals, and community members who share our mission of improving mental wellness accessibility.

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Contribution Areas**
- 🐛 Bug fixes and performance improvements
- ✨ New features and enhancements
- 📝 Documentation improvements
- 🧪 Testing and quality assurance
- 🌐 Internationalization and localization
- 🎨 UI/UX design improvements

## 📞 Support & Resources

### **Getting Help**
- 📖 **Documentation**: Comprehensive guides in `/docs`
- 🐛 **Issues**: GitHub Issues for bug reports
- 💬 **Discussions**: Community discussions for questions
- 📧 **Contact**: support@mansarthi.com

### **Crisis Resources**
**If you're in crisis, please reach out immediately:**
- 🇺🇸 **National Suicide Prevention Lifeline**: 988
- 📱 **Crisis Text Line**: Text HOME to 741741
- 🌍 **International**: Visit findahelpline.com

### **Professional Support**
This platform supplements but does not replace professional mental health care. Please consult with licensed mental health professionals for comprehensive treatment.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Mental Health Professionals** who provided guidance on therapeutic approaches
- **AI Research Community** for advancing conversational AI capabilities  
- **Open Source Contributors** who make projects like this possible
- **Users and Testers** who help us improve and evolve the platform

---

<div align="center">

**Built with ❤️ for mental wellness and community healing**

*Mansarthi - Where technology meets compassion in the journey toward mental wellness.*

[![GitHub stars](https://img.shields.io/github/stars/Aditya3525/Mansarthi---AI-for-mental-wellness.svg?style=social)](https://github.com/Aditya3525/Mansarthi---AI-for-mental-wellness/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Aditya3525/Mansarthi---AI-for-mental-wellness.svg?style=social)](https://github.com/Aditya3525/Mansarthi---AI-for-mental-wellness/network)
[![Follow](https://img.shields.io/github/followers/Aditya3525.svg?style=social)](https://github.com/Aditya3525)

</div>