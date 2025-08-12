const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Add these fields to your User schema
// Add these fields to your User schema
const userSchema = new mongoose.Schema({
    // Authentication fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In production, this should be hashed
    age: { type: Number, required: true },
    registrationDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isVerified: { type: Boolean, default: false },
    
    // Optional legacy fields (for existing assessment flow)
    birthday: { type: Date },
    contact: { type: String },
    gender: { type: String },
    
    assessments: [{
        score: Number,
        answers: [Number],
        recommendation: String,
        completedAt: { type: Date, default: Date.now },
        type: { type: String, default: 'general' }
    }],
    chatHistory: [{
        message: String,
        response: String,
        timestamp: { type: Date, default: Date.now }
    }],
    // NEW FIELDS FOR PATH SYSTEM
    selectedPath: {
        type: String,
        enum: ['western', 'eastern', 'hybrid'],
        default: null
    },
    pathDetails: {
        type: Object,
        default: null
    },
    pathSelectedAt: {
        type: Date,
        default: null
    },
    specializedTests: {
        type: Object,
        default: {}
    },
    // JOURNEY TRACKING FIELDS
    currentLevel: {
        type: Number,
        default: 1
    },
    totalXP: {
        type: Number,
        default: 0
    },
    milestonesReached: [{
        milestoneId: Number,
        name: String,
        earnedAt: { type: Date, default: Date.now },
        xpAwarded: Number
    }],
    achievements: [{
        achievementId: Number,
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
        category: String
    }],
    habitTracking: {
        type: Object,
        default: {}
    },
    rewardHistory: [{
        type: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);