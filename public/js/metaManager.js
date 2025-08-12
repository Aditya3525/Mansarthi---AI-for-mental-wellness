// Re-export from config for browser use
// This file is generated to expose MetaManager via /public path
// Source of truth: /config/metaManager.js

class MetaManager {
    constructor() {
        this.defaultMeta = {
            title: 'Mindful AI Ecosystem - Personalized Mental Wellness Platform',
            description: 'Transform your mental wellness journey with AI-powered support, personalized practices, and community connection. Evidence-based techniques for anxiety, depression, and overall wellbeing.',
            keywords: 'mental health, AI therapy, wellness, meditation, anxiety support, depression help, mindfulness, mental wellness platform',
        };
        this.pageMeta = {
            dashboard: {
                title: 'Dashboard - Mindful AI',
                description: 'Your personalized dashboard for mental wellness, daily practices, and progress tracking.',
            },
            'assessment.html': {
                title: 'Assessment - Mindful AI',
                description: 'Take a quick assessment to personalize your wellness journey.'
            },
            'growth-journey': {
                title: 'Growth Journey - Mindful AI',
                description: 'Track your progress, milestones, and achievements on your wellness journey.'
            },
            'community': {
                title: 'Community - Mindful AI',
                description: 'Connect, share, and grow with a supportive mental wellness community.'
            },
            '404': {
                title: 'Page Not Found - Mindful AI',
                description: 'Sorry, the page you are looking for does not exist.'
            }
        };
    }

    setPageMeta(meta) {
        document.title = meta.title || this.defaultMeta.title;
        this.setMetaTag('description', meta.description || this.defaultMeta.description);
        this.setMetaTag('keywords', meta.keywords || this.defaultMeta.keywords);
    }

    setMetaTag(name, content) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    getPageMeta(page) {
        return this.pageMeta[page] || this.defaultMeta;
    }
}

window.metaManager = new MetaManager();
