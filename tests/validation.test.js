const {
    validateRegistration,
    validateLogin,
    validateAssessment,
    validateChatMessage,
    sanitizeInput
} = require('../config/validation');

describe('Validation Functions', () => {
    describe('sanitizeInput', () => {
        it('should remove script tags', () => {
            const input = 'Hello <script>alert("hack")</script> World';
            const result = sanitizeInput(input);
            expect(result).toBe('Hello  World');
        });

        it('should trim whitespace', () => {
            const input = '  Hello World  ';
            const result = sanitizeInput(input);
            expect(result).toBe('Hello World');
        });

        it('should handle non-string input', () => {
            expect(sanitizeInput(123)).toBe(123);
            expect(sanitizeInput(null)).toBe(null);
        });
    });

    describe('validateRegistration middleware', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    age: 25
                }
            };
            res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res)
            };
            next = jest.fn();
        });

        it('should pass validation with valid data', () => {
            validateRegistration(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail with invalid email', () => {
            req.body.email = 'invalid-email';
            validateRegistration(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Please provide a valid email address']
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should fail with weak password', () => {
            req.body.password = '123';
            validateRegistration(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Password must be at least 8 characters with letters and numbers']
            });
        });

        it('should fail with invalid age', () => {
            req.body.age = 10;
            validateRegistration(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Age must be between 13 and 120']
            });
        });

        it('should sanitize inputs', () => {
            req.body.name = '  John <script>alert("hack")</script> Doe  ';
            req.body.email = '  JOHN@EXAMPLE.COM  ';
            
            validateRegistration(req, res, next);
            
            expect(req.body.name).toBe('John  Doe');
            expect(req.body.email).toBe('john@example.com');
        });
    });

    describe('validateChatMessage middleware', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: {
                    message: 'Hello, I need help with anxiety.'
                }
            };
            res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res)
            };
            next = jest.fn();
        });

        it('should pass validation with valid message', () => {
            validateChatMessage(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail with empty message', () => {
            req.body.message = '';
            validateChatMessage(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Message cannot be empty']
            });
        });

        it('should fail with message too long', () => {
            req.body.message = 'a'.repeat(1001);
            validateChatMessage(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Message cannot exceed 1000 characters']
            });
        });

        it('should sanitize message', () => {
            req.body.message = 'Hello <script>alert("hack")</script> World';
            validateChatMessage(req, res, next);
            
            expect(req.body.message).toBe('Hello  World');
            expect(next).toHaveBeenCalled();
        });
    });

    describe('validateAssessment middleware', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: {
                    answers: [3, 4, 2, 5, 1],
                    assessmentType: 'general'
                }
            };
            res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res)
            };
            next = jest.fn();
        });

        it('should pass validation with valid assessment', () => {
            validateAssessment(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail with non-array answers', () => {
            req.body.answers = 'not an array';
            validateAssessment(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Answers must be an array']
            });
        });

        it('should fail with empty answers', () => {
            req.body.answers = [];
            validateAssessment(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['Assessment answers cannot be empty']
            });
        });

        it('should fail with invalid answer values', () => {
            req.body.answers = [1, 2, 6, 4]; // 6 is invalid
            validateAssessment(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: ['All answers must be numbers between 1 and 5']
            });
        });
    });
});