// Input validation utilities
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    // At least 8 characters, one letter, one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
};

const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
};

const validateAge = (age) => {
    const numAge = parseInt(age);
    return !isNaN(numAge) && numAge >= 13 && numAge <= 120;
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Validation middleware
const validateRegistration = (req, res, next) => {
    const { name, email, password, age } = req.body;
    const errors = [];

    if (!name || !validateName(name)) {
        errors.push('Name must be 2-50 characters long');
    }

    if (!email || !validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password || !validatePassword(password)) {
        errors.push('Password must be at least 8 characters with letters and numbers');
    }

    if (!age || !validateAge(age)) {
        errors.push('Age must be between 13 and 120');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // Sanitize inputs
    req.body.name = sanitizeInput(name);
    req.body.email = sanitizeInput(email.toLowerCase());
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 1) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // Sanitize inputs
    req.body.email = sanitizeInput(email.toLowerCase());
    
    next();
};

const validateAssessment = (req, res, next) => {
    const { answers, assessmentType } = req.body;
    const errors = [];

    if (!Array.isArray(answers)) {
        errors.push('Answers must be an array');
    } else if (answers.length === 0) {
        errors.push('Assessment answers cannot be empty');
    } else if (answers.some(answer => typeof answer !== 'number' || answer < 1 || answer > 5)) {
        errors.push('All answers must be numbers between 1 and 5');
    }

    if (assessmentType && typeof assessmentType !== 'string') {
        errors.push('Assessment type must be a string');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

const validateChatMessage = (req, res, next) => {
    const { message } = req.body;
    const errors = [];

    if (!message || typeof message !== 'string') {
        errors.push('Message is required and must be a string');
    } else if (message.trim().length === 0) {
        errors.push('Message cannot be empty');
    } else if (message.length > 1000) {
        errors.push('Message cannot exceed 1000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // Sanitize message
    req.body.message = sanitizeInput(message);
    
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateAssessment,
    validateChatMessage,
    sanitizeInput
};