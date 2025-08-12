// Re-export minimal browser-friendly PersonalizationEngine
// Source: /config/personalization-engine.js

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
    return { assessmentHistory, microassessmentHistory, selectedPath: userPath.path, lastUpdated: new Date().toISOString() };
  }
  loadBehaviorPatterns() {
    const practiceData = JSON.parse(localStorage.getItem('practiceData') || '{}');
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    return this.analyzeBehaviorPatterns(practiceData, chatHistory);
  }
  loadPreferences() { return JSON.parse(localStorage.getItem('userPreferences') || '{}'); }
  analyzeBehaviorPatterns(practiceData, chatHistory) {
    const patterns = {
      practiceFrequency: this.calculatePracticeFrequency(practiceData),
      preferredPracticeTime: 'morning',
      engagementLevel: this.calculateEngagementLevel(practiceData, chatHistory),
      strugglingAreas: this.identifyStrugglingAreas(chatHistory),
      improvementTrends: null
    };
    return patterns;
  }
  calculatePracticeFrequency(practiceData) {
    const dates = Object.keys(practiceData); if (dates.length === 0) return 0;
    const firstDate = new Date(Math.min(...dates.map(d => new Date(d))));
    const daysSinceStart = Math.ceil((new Date() - firstDate) / (1000 * 60 * 60 * 24));
    return dates.length / Math.max(daysSinceStart, 1);
  }
  calculateEngagementLevel(practiceData, chatHistory) {
    const recentPractices = Object.keys(practiceData).filter(date => { const d = new Date(date); const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); return d >= weekAgo; }).length;
    const recentChats = chatHistory.filter(chat => { const d = new Date(chat.timestamp || chat.date || Date.now()); const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); return d >= weekAgo; }).length;
    return Math.min(100, (recentPractices * 10) + (recentChats * 5));
  }
  identifyStrugglingAreas(chatHistory) {
    const keywords = { anxiety: ['anxious','anxiety','worry','nervous','panic'], depression: ['sad','depressed','hopeless','empty'], stress: ['stressed','overwhelmed','pressure','tense'], sleep: ['sleep','insomnia','tired','exhausted'], relationships: ['lonely','isolated','relationship','social'] };
    const struggles = {};
    chatHistory.forEach(chat => {
      const msg = (chat.message || '').toLowerCase();
      Object.keys(keywords).forEach(area => { keywords[area].forEach(k => { if (msg.includes(k)) struggles[area] = (struggles[area] || 0) + 1; }); });
    });
    return struggles;
  }
  generatePersonalizedRecommendations() {
    const engagement = this.behaviorPatterns.engagementLevel;
    const path = this.userProfile.selectedPath || 'hybrid';
    const base = engagement < 30 ? { title: 'Start Small', action: '5 min daily practice', priority: 'high' } : engagement < 70 ? { title: 'Build Momentum', action: 'Add variety', priority: 'medium' } : { title: 'Deepen Practice', action: 'Longer advanced techniques', priority: 'low' };
    const pathRec = { western: { title: 'Structured Progress', action: 'Weekly CBT goals' }, eastern: { title: 'Mindful Growth', action: 'Longer meditation' }, hybrid: { title: 'Integrated Approach', action: 'Goal + meditation' } }[path];
    return { dailyPractice: [base, pathRec] };
  }
}

window.PersonalizationEngine = PersonalizationEngine;
