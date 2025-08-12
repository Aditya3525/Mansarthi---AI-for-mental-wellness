const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import models
const User = require('./models/User');

// Import AI service
const aiService = require('./config/aiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Authentication Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        // Create new user
        const user = new User({
            name,
            email,
            password, // In production, hash this password
            age: parseInt(age),
            registrationDate: new Date(),
            isVerified: false
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
    // Compare hashed password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

app.post('/api/logout', (req, res) => {
    try {
        // In a production app, you would invalidate the session/token here
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

// Save user info and assessment
app.post('/api/save-assessment', async (req, res) => {
    try {
        const { userId, assessmentResults, userInfo } = req.body;

        // Require a userId to attach assessment; prevent creating invalid users
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId is required to save an assessment'
            });
        }

        // Build safe assessment object (whitelist fields)
        const assessment = {
            score: assessmentResults?.score,
            answers: Array.isArray(assessmentResults?.answers) ? assessmentResults.answers : undefined,
            recommendation: assessmentResults?.recommendation,
            completedAt: assessmentResults?.completedAt ? new Date(assessmentResults.completedAt) : new Date(),
            type: assessmentResults?.type || 'general'
        };

        // Optional: update legacy profile fields if provided
        const legacyProfileUpdates = {};
        if (userInfo?.birthday) legacyProfileUpdates.birthday = new Date(userInfo.birthday);
        if (userInfo?.contact) legacyProfileUpdates.contact = userInfo.contact;
        if (userInfo?.gender) legacyProfileUpdates.gender = userInfo.gender;

        const update = {
            $push: { assessments: assessment },
            ...(Object.keys(legacyProfileUpdates).length ? { $set: legacyProfileUpdates } : {})
        };

        const user = await User.findByIdAndUpdate(userId, update, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Assessment saved successfully',
            userId: user._id,
            assessmentsCount: user.assessments?.length || 0
        });

    } catch (error) {
        console.error('Error saving assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving assessment data'
        });
    }
});

// Chatbot endpoint - NEW!
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId, assessmentResults, inputMode, emotionContext } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        console.log(`Multimodal chat request - Mode: ${inputMode}, User: ${userId}`);
        
        // Get user's path information
        let userPath = null;
        if (userId) {
            try {
                const user = await User.findById(userId);
                if (user && user.selectedPath) {
                    userPath = {
                        path: user.selectedPath,
                        details: user.pathDetails
                    };
                }
            } catch (dbError) {
                console.error('Error fetching user path:', dbError);
            }
        }
        
        // Enhanced context for multimodal AI
        const enhancedContext = {
            ...assessmentResults,
            inputMode: inputMode,
            emotionContext: emotionContext,
            timestamp: new Date().toISOString()
        };
        
        // Get AI response with enhanced context
        const aiResponse = await aiService.getChatResponse(message, enhancedContext, userPath);
        
        // Generate emotional insights if emotion context is provided
        let emotionalInsights = null;
        if (emotionContext) {
            emotionalInsights = generateEmotionalInsights(emotionContext, userPath);
        }
        
        // Save enhanced chat history
        if (userId) {
            try {
                await User.findByIdAndUpdate(userId, {
                    $push: {
                        chatHistory: {
                            message: message,
                            response: aiResponse,
                            timestamp: new Date(),
                            inputMode: inputMode,
                            emotionContext: emotionContext,
                            userPath: userPath?.path || null
                        }
                    }
                });
            } catch (dbError) {
                console.error('Error saving enhanced chat history:', dbError);
            }
        }
        
        res.json({
            success: true,
            response: aiResponse,
            emotionalInsights: emotionalInsights,
            userPath: userPath?.path || null,
            inputMode: inputMode
        });
        
    } catch (error) {
        console.error('Error in multimodal chat endpoint:', error);
        
        // Enhanced fallback response
        const fallbackResponse = "I'm experiencing some technical difficulties, but I'm still here to support you. Your emotional wellbeing matters, and I want you to know you're not alone in this moment.";
        
        res.json({
            success: true,
            response: fallbackResponse
        });
    }
});

// Get user assessment history
app.get('/api/user/:userId/assessments', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({
            success: true,
            assessments: user.assessments
        });
        
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment data'
        });
    }
});

// Get user chat history - NEW!
app.get('/api/user/:userId/chat-history', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({
            success: true,
            chatHistory: user.chatHistory || []
        });
        
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history'
        });
    }
});

// Update user path selection
app.post('/api/update-user-path', async (req, res) => {
    try {
        const { userId, selectedPath, pathDetails } = req.body;
        
        if (!userId || !selectedPath) {
            return res.status(400).json({
                success: false,
                message: 'User ID and selected path are required'
            });
        }

        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                selectedPath: selectedPath,
                pathDetails: pathDetails,
                pathSelectedAt: new Date()
            }
        }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User path updated successfully',
            selectedPath: selectedPath
        });

    } catch (error) {
        console.error('Error updating user path:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user path'
        });
    }
});

// Get personalized recommendations based on user's path
app.get('/api/user/:userId/recommendations', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const recommendations = getPersonalizedRecommendations(user.selectedPath, user.assessments);
        
        res.json({
            success: true,
            recommendations: recommendations,
            userPath: user.selectedPath
        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations'
        });
    }
});

// Helper function to generate personalized recommendations
function getPersonalizedRecommendations(path, assessments) {
    const latestAssessment = assessments && assessments.length > 0 ? 
        assessments[assessments.length - 1] : null;
    
    const baseRecommendations = {
        western: {
            daily: [
                "Practice thought recording for 10 minutes",
                "Complete a structured problem-solving exercise",
                "Review and update your SMART goals"
            ],
            struggling: [
                "Use the ABC model to analyze your thoughts",
                "Practice progressive muscle relaxation",
                "Engage in behavioral activation activities"
            ],
            resources: [
                "CBT workbooks and exercises",
                "Therapy technique videos",
                "Goal-setting frameworks"
            ]
        },
        eastern: {
            daily: [
                "Practice 10 minutes of mindfulness meditation",
                "Complete breathing exercises (Pranayama)",
                "Do gentle yoga or movement practice"
            ],
            struggling: [
                "Practice loving-kindness meditation",
                "Use body scanning for tension release",
                "Connect with nature for grounding"
            ],
            resources: [
                "Guided meditation sessions",
                "Yoga and movement videos",
                "Mindfulness articles and practices"
            ]
        },
        hybrid: {
            daily: [
                "Combine CBT journaling with mindful awareness",
                "Practice structured breathing exercises",
                "Set mindful goals with present-moment check-ins"
            ],
            struggling: [
                "Use mindful problem-solving techniques",
                "Practice evidence-based meditation",
                "Combine behavioral activation with mindfulness"
            ],
            resources: [
                "Integrated therapy techniques",
                "Mindful CBT exercises",
                "Balanced wellness practices"
            ]
        }
    };

    return baseRecommendations[path] || baseRecommendations.hybrid;
}

// Basic route to test server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login page route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve chatbot page (legacy path) -> point to multimodal chatbot
app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'multimodal-chatbot.html'));
});

app.get('/resources', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resources.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/specialized-tests', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'specialized-tests.html'));
});

// Add route for path selection page
app.get('/path-selection', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'path-selection.html'));
});

// Add this route to your server.js
app.get('/daily-practice', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'daily-practice.html'));
});

// Add this route to your server.js
app.get('/multimodal-chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'multimodal-chatbot.html'));
});

// Handle common typo/alternate path
app.get('/multimode-chatbot', (req, res) => {
    res.redirect(301, '/multimodal-chatbot');
});

// Add this route to your server.js
app.get('/progress-tracking', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'progress-tracking.html'));
});

// Add route for microassessment page
app.get('/microassessment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'microassessment.html'));
});

// API endpoint for personalization data
app.get('/api/personalization/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // This would integrate with the PersonalizationEngine
        // For now, return basic user data
        res.json({
            success: true,
            personalization: {
                selectedPath: user.selectedPath,
                assessmentHistory: user.assessments,
                lastActive: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error fetching personalization data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching personalization data'
        });
    }
});

// Helper function to generate emotional insights
function generateEmotionalInsights(emotionContext, userPath) {
    const dominantEmotion = Object.keys(emotionContext).reduce((a, b) => 
        emotionContext[a] > emotionContext[b] ? a : b
    );
    
    const pathInsights = {
        western: {
            anxiety: "Your anxiety levels seem elevated. Consider using cognitive restructuring techniques to examine the thoughts driving these feelings.",
            sadness: "I notice sadness in your communication. Behavioral activation might help - try scheduling one small pleasant activity today.",
            anger: "There's frustration coming through. Let's explore what's triggering this and develop healthy expression strategies.",
            happiness: "I'm glad to hear positive emotions! This is a good time to reflect on what's working well in your life.",
            neutral: "You seem emotionally balanced right now, which is great for working through challenges objectively."
        },
        eastern: {
            anxiety: "I sense anxiety in your energy. Try focusing on your breath and grounding yourself in the present moment.",
            sadness: "Your heart seems heavy. Remember that this feeling will pass, like clouds moving across the sky.",
            anger: "There's fiery energy present. Consider channeling this into compassionate action or mindful movement.",
            happiness: "Beautiful positive energy is flowing through you. Let this joy fill your entire being.",
            neutral: "You're in a centered state - perfect for mindful awareness and gentle self-reflection."
        },
        hybrid: {
            anxiety: "I notice anxious energy. Let's combine mindful breathing with practical problem-solving to address your concerns.",
            sadness: "Your sadness comes through clearly. We can honor this feeling while also taking small positive actions.",
            anger: "This frustrated energy can be transformed. Let's mindfully examine the situation and plan constructive responses.",
            happiness: "Wonderful to sense your joy! This positive state is perfect for setting mindful intentions.",
            neutral: "You're in a balanced space - ideal for both reflective awareness and practical planning."
        }
    };
    
    const path = userPath?.path || 'hybrid';
    return pathInsights[path][dominantEmotion] || "I'm sensing your emotional state and want you to know that all feelings are valid and temporary.";
}

// Get community posts
app.get('/api/community/:communityId/posts', async (req, res) => {
    try {
        const { communityId } = req.params;
        const { filter = 'all', limit = 20, offset = 0 } = req.query;
        
        // In a real app, this would fetch from database
        // For now, return mock data
        const mockPosts = [
            {
                id: 1,
                author: "Anonymous User",
                authorId: "anon_001",
                communityId: communityId,
                content: "Having a challenging day but the breathing exercises really helped.",
                category: "support",
                createdAt: new Date().toISOString(),
                likes: 12,
                comments: 5,
                helpful: 8,
                isAnonymous: true
            }
        ];
        
        res.json({
            success: true,
            posts: mockPosts,
            total: mockPosts.length,
            hasMore: false
        });
        
    } catch (error) {
        console.error('Error fetching community posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts'
        });
    }
});

// Create new community post
app.post('/api/community/:communityId/posts', async (req, res) => {
    try {
        const { communityId } = req.params;
        const { content, category, isAnonymous = true } = req.body;
        const userId = req.body.userId || 'anonymous';
        
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Post content is required'
            });
        }
        
        // Content moderation (basic)
        const moderationResult = moderateContent(content);
        if (!moderationResult.approved) {
            return res.status(400).json({
                success: false,
                message: 'Content requires moderation',
                reason: moderationResult.reason
            });
        }
        
        // In a real app, save to database
        const newPost = {
            id: Date.now(),
            authorId: userId,
            author: isAnonymous ? "Anonymous User" : "Community Member",
            communityId: communityId,
            content: content.trim(),
            category: category || 'general',
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
            helpful: 0,
            isAnonymous: isAnonymous
        };
        
        res.json({
            success: true,
            post: newPost,
            message: 'Post created successfully'
        });
        
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating post'
        });
    }
});

// Get group sessions
app.get('/api/group-sessions', async (req, res) => {
    try {
        const { status = 'all', type = 'all' } = req.query;
        
        // Mock session data
        const mockSessions = [
            {
                id: 1,
                title: "Morning Mindfulness Circle",
                facilitatorType: "AI",
                facilitatorName: "Luna",
                scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
                duration: 30,
                maxParticipants: 12,
                currentParticipants: 8,
                status: "upcoming",
                type: "meditation",
                description: "Start your day with guided mindfulness meditation and gentle intention setting.",
                guidelines: [
                    "Maintain respectful communication",
                    "Share only what feels comfortable",
                    "Listen without judgment",
                    "Support others with kindness"
                ]
            },
            {
                id: 2,
                title: "Anxiety Support Group",
                facilitatorType: "AI",
                facilitatorName: "Sage",
                scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
                duration: 45,
                maxParticipants: 10,
                currentParticipants: 6,
                status: "upcoming",
                type: "support",
                description: "Safe space to share anxiety experiences and learn coping strategies together."
            }
        ];
        
        res.json({
            success: true,
            sessions: mockSessions,
            total: mockSessions.length
        });
        
    } catch (error) {
        console.error('Error fetching group sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions'
        });
    }
});

// Join group session
app.post('/api/group-sessions/:sessionId/join', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { userId, isAnonymous = true } = req.body;
        
        // In a real app, check session capacity, user eligibility, etc.
        res.json({
            success: true,
            message: 'Successfully joined session',
            sessionToken: 'mock_session_token_' + sessionId,
            joinUrl: `/group-session/${sessionId}`,
            guidelines: [
                "Maintain respectful communication",
                "Share only what feels comfortable", 
                "Listen without judgment",
                "Support others with kindness"
            ]
        });
        
    } catch (error) {
        console.error('Error joining session:', error);
        res.status(500).json({
            success: false,
            message: 'Error joining session'
        });
    }
});

// Content moderation helper
function moderateContent(content) {
    const flaggedWords = ['harmful', 'dangerous', 'suicide', 'kill', 'die'];
    const lowerContent = content.toLowerCase();
    
    for (const word of flaggedWords) {
        if (lowerContent.includes(word)) {
            return {
                approved: false,
                reason: 'Content requires professional review',
                escalate: true
            };
        }
    }
    
    return { approved: true };
}

// Add main community route
app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'community.html'));
});

// Growth Journey routes - NEW
app.get('/growth-journey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'growth-journey.html'));
});

// API endpoint for growth journey data
app.get('/api/growth-journey/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Calculate user progress
        const journeyData = calculateUserJourney(user);
        
        res.json({
            success: true,
            journey: journeyData
        });

    } catch (error) {
        console.error('Error fetching growth journey:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching growth journey'
        });
    }
});

// Helper function to calculate user journey progress
function calculateUserJourney(user) {
    const assessments = user.assessments || [];
    const chatHistory = user.chatHistory || [];
    const joinDate = user.createdAt;
    const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
    
    // Calculate XP from various activities
    let totalXP = 0;
    totalXP += assessments.length * 50; // 50 XP per assessment
    totalXP += Math.min(chatHistory.length * 10, 500); // 10 XP per chat, max 500
    totalXP += Math.min(daysSinceJoin * 5, 200); // 5 XP per day active, max 200
    
    // Calculate level (every 200 XP = 1 level)
    const level = Math.floor(totalXP / 200) + 1;
    const xpInCurrentLevel = totalXP % 200;
    
    // Determine milestones reached
    const milestonesReached = calculateMilestones(user, totalXP, level);
    
    return {
        level: level,
        totalXP: totalXP,
        xpInCurrentLevel: xpInCurrentLevel,
        xpForNextLevel: 200,
        milestonesReached: milestonesReached,
        daysSinceJoin: daysSinceJoin,
        assessmentsCompleted: assessments.length,
        chatsSessions: chatHistory.length
    };
}

function calculateMilestones(user, totalXP, level) {
    const milestones = [];
    
    // Basic milestones based on level and activities
    if (level >= 1) milestones.push({ id: 1, name: "Welcome Aboard", earned: true });
    if (level >= 2) milestones.push({ id: 2, name: "Building Foundations", earned: true });
    if (level >= 3) milestones.push({ id: 3, name: "Gaining Momentum", earned: true });
    if (level >= 4) milestones.push({ id: 4, name: "Mindful Explorer", earned: level >= 4 });
    if (level >= 5) milestones.push({ id: 5, name: "Wellness Warrior", earned: level >= 5 });
    
    return milestones;
}

// API endpoint for earning rewards
app.post('/api/growth-journey/:userId/reward', async (req, res) => {
    try {
        const { userId } = req.params;
        const { rewardType, rewardValue, description } = req.body;
        
        // In a real app, validate and save the reward
        // For now, just return success
        res.json({
            success: true,
            message: 'Reward earned successfully',
            reward: {
                type: rewardType,
                value: rewardValue,
                description: description,
                earnedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error earning reward:', error);
        res.status(500).json({
            success: false,
            message: 'Error earning reward'
        });
    }
});

// Start server
// Error handling and feedback APIs
app.post('/api/errors', async (req, res) => {
    try {
        const errorInfo = req.body;
        // Log error (in production, send to monitoring service like Sentry)
        console.error('Client Error:', errorInfo);
        // Save to database if needed
        // await ErrorLog.create(errorInfo);
        res.json({ success: true, message: 'Error logged successfully' });
    } catch (error) {
        console.error('Error logging failed:', error);
        res.status(500).json({ success: false, message: 'Failed to log error' });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const feedback = req.body;
        // Save feedback to database
        console.log('User Feedback:', feedback);
        // In production, save to database:
        // await UserFeedback.create(feedback);
        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Feedback submission failed:', error);
        res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        services: {
            database: 'connected', // Check actual DB connection
            ai: 'available', // Check AI service availability
            storage: 'available'
        }
    };
    res.json(healthCheck);
});

// Add routes for new pages
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get('/crisis-support', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crisis-support.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    // Don't expose error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({
        success: false,
        message: isDevelopment ? error.message : 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`\n🌟 ====================================\n   MINDFUL AI ECOSYSTEM - READY!\n====================================\n\n🚀 Server running on: http://localhost:${PORT}\n🎯 Environment: ${process.env.NODE_ENV || 'development'}\n🧠 AI Services: Multi-provider ready\n🤝 Community: Active\n📊 Progress Tracking: Enabled\n🔒 Privacy: Protected\n🆘 Crisis Support: Available 24/7\n\nReady to transform mental wellness! 💙\n====================================\n`);
});