const axios = require('axios');

class AIService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    }

    async getChatResponse(message, assessmentResults = {}, userPath = null) {
        console.log(`AI Service: Processing message with path: ${userPath?.path || 'none'}`);
        
        // Try providers in order with path-aware prompts
        const providers = [
            () => this.tryOpenAI(message, assessmentResults, userPath),
            () => this.tryGemini(message, assessmentResults, userPath),
            () => this.tryOllama(message, assessmentResults, userPath),
            () => this.getFallbackResponse(message, assessmentResults, userPath)
        ];

        for (const provider of providers) {
            try {
                const response = await provider();
                if (response) {
                    console.log('AI Service: Response generated successfully');
                    return response;
                }
            } catch (error) {
                console.log(`AI Service: Provider failed, trying next...`);
                continue;
            }
        }

        return this.getFallbackResponse(message, assessmentResults, userPath);
    }

    buildSystemPrompt(assessmentResults, userPath) {
        let basePrompt = `You are a compassionate AI mental health companion. You provide supportive, evidence-based guidance while being warm and understanding. Always acknowledge the user's feelings and provide practical, actionable advice.`;

        // Add assessment context
        if (assessmentResults.score) {
            basePrompt += ` The user completed an assessment with a wellbeing score of ${assessmentResults.score}%. `;
            if (assessmentResults.score >= 75) {
                basePrompt += `They're doing well overall but want to maintain and improve their mental health.`;
            } else if (assessmentResults.score >= 50) {
                basePrompt += `They have some areas for improvement and are looking for support.`;
            } else {
                basePrompt += `They may be facing some challenges and need extra support and encouragement.`;
            }
        }

        // Add path-specific guidance
        if (userPath?.path) {
            const pathPrompts = {
                western: `
                IMPORTANT: The user prefers WESTERN/EVIDENCE-BASED approaches. Focus on:
                - Cognitive Behavioral Therapy (CBT) techniques
                - Structured problem-solving methods
                - Goal-setting and behavioral activation
                - Scientific evidence and research-backed strategies
                - Thought record exercises and cognitive restructuring
                - Practical, step-by-step solutions
                - Measurable outcomes and progress tracking
                
                Avoid overly spiritual or mystical language. Keep responses practical and scientifically grounded.`,
                
                eastern: `
                IMPORTANT: The user prefers EASTERN/MINDFULNESS approaches. Focus on:
                - Mindfulness and meditation practices
                - Breathing exercises (Pranayama)
                - Present-moment awareness
                - Acceptance and non-judgment
                - Body-mind connection
                - Gentle, flowing guidance
                - Holistic wellbeing concepts
                - Balance and harmony
                
                Use calm, contemplative language. Emphasize being rather than doing.`,
                
                hybrid: `
                IMPORTANT: The user prefers a HYBRID approach combining Western and Eastern methods. Focus on:
                - Mindfulness-based CBT techniques
                - Structured meditation with clear goals
                - Evidence-based practices enhanced with mindfulness
                - Balanced problem-solving (logical + intuitive)
                - Practical spirituality
                - Both doing and being approaches
                - Comprehensive, integrated solutions
                
                Blend scientific backing with mindful awareness. Offer both structured and flowing guidance.`
            };
            
            basePrompt += pathPrompts[userPath.path];
        }

        basePrompt += `

        Guidelines for all responses:
        - Keep responses under 200 words
        - Always end with a specific, actionable suggestion
        - Be encouraging and hopeful
        - Acknowledge emotions before giving advice
        - Ask clarifying questions when helpful
        - Suggest professional help for serious concerns
        - Use a warm, supportive tone`;

        return basePrompt;
    }

    async tryOpenAI(message, assessmentResults, userPath) {
        if (!this.openaiApiKey) return null;

        const systemPrompt = this.buildSystemPrompt(assessmentResults, userPath);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 300,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${this.openaiApiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        return response.data.choices[0].message.content.trim();
    }

    async tryGemini(message, assessmentResults, userPath) {
        if (!this.geminiApiKey) return null;

        const systemPrompt = this.buildSystemPrompt(assessmentResults, userPath);
        const fullPrompt = `${systemPrompt}\n\nUser message: ${message}\n\nResponse:`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
            {
                contents: [{
                    parts: [{ text: fullPrompt }]
                }],
                generationConfig: {
                    maxOutputTokens: 300,
                    temperature: 0.7
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );

        return response.data.candidates[0].content.parts[0].text.trim();
    }

    async tryOllama(message, assessmentResults, userPath) {
        const systemPrompt = this.buildSystemPrompt(assessmentResults, userPath);

        const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
            model: 'llama2',
            prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
            stream: false,
            options: {
                temperature: 0.7,
                num_predict: 300
            }
        }, {
            timeout: 15000
        });

        return response.data.response.trim();
    }

    getFallbackResponse(message, assessmentResults, userPath) {
        const messageKeywords = message.toLowerCase();
        const pathResponses = this.getPathSpecificFallbacks(userPath?.path);
        
        // Anxiety-related
        if (messageKeywords.includes('anxious') || messageKeywords.includes('anxiety') || messageKeywords.includes('worry') || messageKeywords.includes('panic')) {
            return pathResponses.anxiety;
        }
        
        // Depression/mood related
        if (messageKeywords.includes('sad') || messageKeywords.includes('depressed') || messageKeywords.includes('down') || messageKeywords.includes('hopeless')) {
            return pathResponses.depression;
        }
        
        // Stress related
        if (messageKeywords.includes('stress') || messageKeywords.includes('overwhelmed') || messageKeywords.includes('pressure')) {
            return pathResponses.stress;
        }
        
        // Sleep related
        if (messageKeywords.includes('sleep') || messageKeywords.includes('insomnia') || messageKeywords.includes('tired') || messageKeywords.includes('exhausted')) {
            return pathResponses.sleep;
        }
        
        // Relationship related
        if (messageKeywords.includes('relationship') || messageKeywords.includes('lonely') || messageKeywords.includes('isolated') || messageKeywords.includes('social')) {
            return pathResponses.relationship;
        }
        
        // General greetings
        if (messageKeywords.includes('hello') || messageKeywords.includes('hi') || messageKeywords.includes('hey')) {
            return pathResponses.greeting;
        }
        
        // Default response
        return pathResponses.general;
    }

    getPathSpecificFallbacks(path) {
        const responses = {
            western: {
                anxiety: "I understand you're feeling anxious. Let's try a cognitive approach: First, identify what specific thoughts are triggering your anxiety. Then, ask yourself: 'Is this thought helpful? What evidence supports or contradicts it?' Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. Would you like to explore what's causing these anxious thoughts?",
                
                depression: "I hear that you're struggling with low mood. From a behavioral perspective, let's focus on small, achievable actions. Try scheduling one pleasurable activity today, even if it's just 10 minutes of something you used to enjoy. Depression often involves negative thought patterns - can you identify one negative thought you've had today and consider if there's a more balanced way to think about it?",
                
                stress: "Stress is often about feeling out of control. Let's break this down systematically: What are the main stressors you're facing? Which ones can you influence and which are outside your control? For immediate relief, try progressive muscle relaxation - tense and release each muscle group for 5 seconds. Can you tell me about the biggest stressor you're dealing with right now?",
                
                sleep: "Sleep hygiene is crucial for mental health. Try these evidence-based strategies: Keep a consistent sleep schedule, avoid screens 1 hour before bed, and keep your room cool and dark. If racing thoughts keep you awake, try the 'worry time' technique - dedicate 15 minutes earlier in the day to write down worries. What's your current bedtime routine like?",
                
                relationship: "Healthy relationships require clear communication and boundaries. Practice 'I' statements to express your needs: 'I feel... when... because...' Consider what you need from relationships and communicate those needs clearly. Are you dealing with a specific relationship challenge I can help you think through?",
                
                greeting: "Hello! I'm your AI mental health companion, and I'm here to provide evidence-based support tailored to your needs. I can help you work through challenges using cognitive-behavioral techniques, problem-solving strategies, and goal-setting approaches. What's on your mind today?",
                
                general: "I'm here to support you using proven psychological techniques. Whether you're dealing with anxiety, depression, stress, or relationship issues, we can work together to identify patterns, challenge unhelpful thoughts, and develop practical coping strategies. What specific challenge would you like to address today?"
            },
            
            eastern: {
                anxiety: "I sense your anxiety, and I want you to know that this feeling will pass. Let's ground ourselves in the present moment. Take three deep breaths with me: breathe in slowly for 4 counts, hold for 4, and exhale for 6. Notice your feet touching the ground. Anxiety often comes from our mind wandering to the future. Can you bring your attention to one thing you can see, hear, or feel right now?",
                
                depression: "Your feelings are valid, and you don't have to carry this heaviness alone. Sometimes depression disconnects us from our natural flow. Try this gentle practice: place one hand on your heart and one on your belly. Breathe deeply and send yourself compassion with each breath. Consider spending a few minutes in nature today, even if it's just looking out a window. What small act of self-kindness could you offer yourself today?",
                
                stress: "Stress often arises when we resist what is. Let's practice acceptance while still taking caring action. Sit quietly for a moment and notice where you feel tension in your body. Breathe into those areas with kindness. Remember: you cannot control the waves, but you can learn to surf. What would it feel like to release just 10% of the resistance you're holding?",
                
                sleep: "Sleep is sacred rest for your body and spirit. Create a peaceful transition to sleep: dim the lights, perhaps light a candle or use calming scents. Practice gratitude by thinking of three things that went well today, however small. If your mind is busy, visualize your thoughts as clouds passing through the sky. What helps you feel most peaceful before bed?",
                
                relationship: "All relationships are opportunities for growth and compassion. When we approach others with loving-kindness, we often receive it in return. If you're experiencing relationship challenges, first cultivate compassion for yourself, then extend it to the other person. Consider: what would love do in this situation? How can you stay true to your heart while honoring the other person's journey?",
                
                greeting: "Welcome, dear soul. I'm here to walk alongside you on your wellness journey with mindfulness, compassion, and ancient wisdom. Together we can explore meditation, breathing practices, and gentle ways to find peace amidst life's challenges. Take a deep breath - you're exactly where you need to be. What's calling for your attention today?",
                
                general: "Life is a flowing river, and sometimes we feel caught in turbulent waters. Through mindfulness, breathing practices, and gentle awareness, we can find our center even in difficult times. Remember: this moment is the only one we truly have. How can I support you in finding more peace and balance in your life right now?"
            },
            
            hybrid: {
                anxiety: "I understand your anxiety, and we can address this using both practical and mindful approaches. Start with grounding: notice 3 things you can see, 2 you can hear, 1 you can smell. Then, gently examine your anxious thoughts - are they helpful? What would you tell a good friend having these thoughts? Combine this with mindful breathing: 4 counts in, 6 counts out. What specific situation is triggering your anxiety?",
                
                depression: "Depression can feel overwhelming, but there are gentle yet effective ways to support yourself. Let's combine mindful awareness with small actions: first, notice and accept how you're feeling without judgment. Then, choose one tiny positive action - maybe a 5-minute walk or calling a friend. Practice self-compassion as you would with a loved one. What's one small step that feels manageable today?",
                
                stress: "Stress affects both mind and body, so let's address both. Start with mindful breathing to activate your calm response, then let's problem-solve systematically. What aspects of your stress can you influence? For the rest, practice acceptance. Try the STOP technique: Stop, Take a breath, Observe your thoughts and feelings, Proceed mindfully. What's the main source of stress you'd like to address?",
                
                sleep: "Good sleep combines practical habits with relaxation. Create a calming routine: no screens 1 hour before bed, keep your room cool, and practice gratitude or gentle meditation. If worries arise, acknowledge them kindly and remind yourself that night is for rest, not problem-solving. Try progressive muscle relaxation combined with mindful breathing. What's currently interfering with your sleep?",
                
                relationship: "Healthy relationships benefit from both clear communication and mindful awareness. Practice listening with full presence, express your needs using 'I' statements, and approach conflicts with curiosity rather than judgment. Take a mindful pause before reacting. Consider: what boundaries do you need, and how can you express them with compassion? What relationship challenge can I help you navigate?",
                
                greeting: "Hello! I'm your integrated AI companion, here to support you with both evidence-based techniques and mindful practices. Whether you need practical problem-solving or gentle awareness exercises, we can find the right combination for your unique situation. I believe in both the power of action and the wisdom of stillness. What would be most helpful for you today?",
                
                general: "Every challenge is an opportunity for growth using both practical wisdom and mindful awareness. We can combine structured problem-solving with gentle self-compassion, goal-setting with present-moment awareness. The best approach is often one that honors both your need for progress and your need for peace. How can I support you in finding this balance today?"
            }
        };

        return responses[path] || responses.hybrid;
    }
}

module.exports = new AIService();