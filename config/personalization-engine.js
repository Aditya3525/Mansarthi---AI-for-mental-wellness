class PersonalizationEngine {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.behaviorPatterns = this.loadBehaviorPatterns();
        this.preferences = this.loadPreferences();
    }

    loadUserProfile() {
        const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        const microassessmentHistory = JSON.parse(localStorage.getItem('microassessmentHistory') || '{}');
        const userPath = JSON.parse(localStorage.getItem('userPath') || '{}');
        
        return {
            assessmentHistory,
            microassessmentHistory,
            selectedPath: userPath.path,
            lastUpdated: new Date().toISOString()
        };
    }

    loadBehaviorPatterns() {
        const practiceData = JSON.parse(localStorage.getItem('practiceData') || '{}');
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        
        return this.analyzeBehaviorPatterns(practiceData, chatHistory);
    }

    loadPreferences() {
        return JSON.parse(localStorage.getItem('userPreferences') || '{}');
    }

    analyzeBehaviorPatterns(practiceData, chatHistory) {
        const patterns = {
            practiceFrequency: this.calculatePracticeFrequency(practiceData),
            preferredPracticeTime: this.identifyPreferredTimes(practiceData),
            engagementLevel: this.calculateEngagementLevel(practiceData, chatHistory),
            strugglingAreas: this.identifyStrugglingAreas(chatHistory),
            improvementTrends: this.calculateImprovementTrends()
        };

        return patterns;
    }

    calculatePracticeFrequency(practiceData) {
        const dates = Object.keys(practiceData);
        if (dates.length === 0) return 0;

        const totalDays = dates.length;
        const firstDate = new Date(Math.min(...dates.map(d => new Date(d))));
        const daysSinceStart = Math.ceil((new Date() - firstDate) / (1000 * 60 * 60 * 24));
        
        return totalDays / Math.max(daysSinceStart, 1);
    }

    identifyPreferredTimes(practiceData) {
        // This would analyze practice completion times if we tracked them
        // For now, return a default suggestion
        return 'morning'; // morning, afternoon, evening
    }

    calculateEngagementLevel(practiceData, chatHistory) {
        const recentPractices = Object.keys(practiceData)
            .filter(date => {
                const dateObj = new Date(date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return dateObj >= weekAgo;
            }).length;

        const recentChats = chatHistory.filter(chat => {
            const chatDate = new Date(chat.timestamp || chat.date || Date.now());
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return chatDate >= weekAgo;
        }).length;

        // Calculate engagement score (0-100)
        return Math.min(100, (recentPractices * 10) + (recentChats * 5));
    }

    identifyStrugglingAreas(chatHistory) {
        const keywords = {
            anxiety: ['anxious', 'anxiety', 'worry', 'nervous', 'panic'],
            depression: ['sad', 'depressed', 'hopeless', 'empty', 'worthless'],
            stress: ['stressed', 'overwhelmed', 'pressure', 'tense'],
            sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'rest'],
            relationships: ['lonely', 'isolated', 'relationship', 'social']
        };

        const struggles = {};
        
        chatHistory.forEach(chat => {
            const message = (chat.message || '').toLowerCase();
            
            Object.keys(keywords).forEach(area => {
                keywords[area].forEach(keyword => {
                    if (message.includes(keyword)) {
                        struggles[area] = (struggles[area] || 0) + 1;
                    }
                });
            });
        });

        return struggles;
    }

    calculateImprovementTrends() {
        const microHistory = this.userProfile.microassessmentHistory;
        const dates = Object.keys(microHistory).sort();
        
        if (dates.length < 7) return null;

        const recent7 = dates.slice(-7).map(date => microHistory[date].score);
        const previous7 = dates.slice(-14, -7).map(date => microHistory[date].score);

        if (previous7.length === 0) return null;

        const recentAvg = recent7.reduce((a, b) => a + b, 0) / recent7.length;
        const previousAvg = previous7.reduce((a, b) => a + b, 0) / previous7.length;

        return {
            trend: recentAvg > previousAvg ? 'improving' : recentAvg < previousAvg ? 'declining' : 'stable',
            change: Math.round(recentAvg - previousAvg),
            recentAverage: Math.round(recentAvg),
            previousAverage: Math.round(previousAvg)
        };
    }

    generatePersonalizedRecommendations() {
        const recommendations = {
            dailyPractice: this.getDailyPracticeRecommendations(),
            strugglingSupport: this.getStrugglingSupportRecommendations(),
            learningContent: this.getLearningContentRecommendations(),
            urgentCare: this.getUrgentCareRecommendations()
        };

        return recommendations;
    }

    getDailyPracticeRecommendations() {
        const patterns = this.behaviorPatterns;
        const path = this.userProfile.selectedPath || 'hybrid';
        
        const recommendations = [];

        // Base recommendation on engagement level
        if (patterns.engagementLevel < 30) {
            recommendations.push({
                title: 'Start Small',
                description: 'Begin with just 5 minutes of daily practice to build consistency.',
                action: 'Choose one simple technique',
                priority: 'high'
            });
        } else if (patterns.engagementLevel < 70) {
            recommendations.push({
                title: 'Build Momentum',
                description: 'You\'re making progress! Try adding variety to maintain engagement.',
                action: 'Explore new techniques in your path',
                priority: 'medium'
            });
        } else {
            recommendations.push({
                title: 'Deepen Practice',
                description: 'Your consistency is excellent. Consider more advanced techniques.',
                action: 'Try longer sessions or specialized practices',
                priority: 'low'
            });
        }

        // Path-specific recommendations
        const pathRecommendations = {
            western: {
                title: 'Structured Progress',
                description: 'Focus on measurable goals and evidence-based techniques.',
                action: 'Set weekly therapy homework or CBT exercises'
            },
            eastern: {
                title: 'Mindful Growth',
                description: 'Deepen your awareness through contemplative practices.',
                action: 'Explore longer meditation sessions or mindful movement'
            },
            hybrid: {
                title: 'Integrated Approach',
                description: 'Balance structured goals with mindful awareness.',
                action: 'Combine goal-setting with meditation practice'
            }
        };

        recommendations.push(pathRecommendations[path] || pathRecommendations.hybrid);

        return recommendations;
    }

    getStrugglingSupportRecommendations() {
        const struggles = this.behaviorPatterns.strugglingAreas;
        const recommendations = [];

        Object.keys(struggles).forEach(area => {
            const count = struggles[area];
            if (count >= 3) { // Mentioned 3+ times recently
                const supportRecommendations = {
                    anxiety: {
                        title: 'Anxiety Support',
                        description: 'Specific techniques for managing anxious thoughts and feelings.',
                        action: 'Try breathing exercises or grounding techniques',
                        urgency: count >= 5 ? 'high' : 'medium'
                    },
                    depression: {
                        title: 'Mood Support',
                        description: 'Activities and strategies to improve mood and motivation.',
                        action: 'Focus on behavioral activation and social connection',
                        urgency: count >= 5 ? 'high' : 'medium'
                    },
                    stress: {
                        title: 'Stress Management',
                        description: 'Tools for reducing and managing daily stress.',
                        action: 'Practice stress-reduction techniques',
                        urgency: 'medium'
                    },
                    sleep: {
                        title: 'Sleep Improvement',
                        description: 'Better sleep habits for improved mental health.',
                        action: 'Review sleep hygiene and relaxation techniques',
                        urgency: 'medium'
                    },
                    relationships: {
                        title: 'Social Connection',
                        description: 'Building and maintaining meaningful relationships.',
                        action: 'Explore communication skills and social activities',
                        urgency: 'medium'
                    }
                };

                recommendations.push(supportRecommendations[area]);
            }
        });

        return recommendations;
    }

    getLearningContentRecommendations() {
        const path = this.userProfile.selectedPath || 'hybrid';
        const engagementLevel = this.behaviorPatterns.engagementLevel;
        
        const contentRecommendations = {
            western: [
                { title: 'CBT Workbook Exercises', type: 'interactive', difficulty: 'beginner' },
                { title: 'Goal Setting Masterclass', type: 'video', difficulty: 'intermediate' },
                { title: 'Advanced Problem Solving', type: 'article', difficulty: 'advanced' }
            ],
            eastern: [
                { title: 'Meditation for Beginners', type: 'guided', difficulty: 'beginner' },
                { title: 'Mindfulness in Daily Life', type: 'video', difficulty: 'intermediate' },
                { title: 'Advanced Contemplative Practices', type: 'guided', difficulty: 'advanced' }
            ],
            hybrid: [
                { title: 'Mindful Goal Achievement', type: 'interactive', difficulty: 'beginner' },
                { title: 'Integrated Wellness Practices', type: 'video', difficulty: 'intermediate' },
                { title: 'Advanced Mind-Body Techniques', type: 'guided', difficulty: 'advanced' }
            ]
        };

        const difficulty = engagementLevel < 30 ? 'beginner' : 
                          engagementLevel < 70 ? 'intermediate' : 'advanced';

        return contentRecommendations[path].filter(content => content.difficulty === difficulty);
    }

    getUrgentCareRecommendations() {
        const trends = this.behaviorPatterns.improvementTrends;
        const recentMicroAssessments = this.getRecentMicroAssessmentScores();
        const recommendations = [];

        // Check for declining trends
        if (trends && trends.trend === 'declining' && trends.change <= -15) {
            recommendations.push({
                title: 'Increased Support Needed',
                description: 'Your wellness scores have been declining. Consider additional support.',
                action: 'Speak with a professional or increase daily practice frequency',
                urgency: 'high',
                type: 'trend_decline'
            });
        }

        // Check for consistently low scores
        if (recentMicroAssessments.length >= 3) {
            const avgRecent = recentMicroAssessments.reduce((a, b) => a + b, 0) / recentMicroAssessments.length;
            if (avgRecent < 40) {
                recommendations.push({
                    title: 'Low Wellness Scores',
                    description: 'Your recent check-ins show consistently low wellness scores.',
                    action: 'Consider speaking with a mental health professional',
                    urgency: 'high',
                    type: 'low_scores'
                });
            }
        }

        return recommendations;
    }

    getRecentMicroAssessmentScores() {
        const microHistory = this.userProfile.microassessmentHistory;
        const recentDates = Object.keys(microHistory)
            .sort()
            .slice(-7); // Last 7 days

        return recentDates.map(date => microHistory[date].score);
    }

    updatePreferences(newPreferences) {
        this.preferences = { ...this.preferences, ...newPreferences };
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }

    savePersonalizationData() {
        const personalizationData = {
            userProfile: this.userProfile,
            behaviorPatterns: this.behaviorPatterns,
            preferences: this.preferences,
            lastAnalyzed: new Date().toISOString()
        };

        localStorage.setItem('personalizationData', JSON.stringify(personalizationData));
        return personalizationData;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalizationEngine;
}