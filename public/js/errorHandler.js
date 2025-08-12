// Re-export from config for browser use
// Source: /config/errorHandler.js

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.userFeedback = [];
    }

    logError(error) {
        this.errorLog.push({ error, timestamp: new Date() });
        fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }).catch(() => {});
    }

    submitFeedback(feedback) {
        this.userFeedback.push({ feedback, timestamp: new Date() });
        fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
        }).catch(() => {});
    }

    showFeedbackWidget() {
        if (document.getElementById('feedback-widget')) return;
        const widget = document.createElement('div');
        widget.id = 'feedback-widget';
        widget.style = 'position:fixed;bottom:30px;right:30px;z-index:9999;background:#fff;border-radius:10px;box-shadow:0 2px 8px #0002;padding:20px;width:320px;max-width:90vw;';
        widget.innerHTML = `
            <h4 style="margin-top:0">💬 Feedback</h4>
            <textarea id="feedback-text" rows="4" style="width:100%;resize:vertical" placeholder="Share your thoughts or report an issue..."></textarea>
            <button id="feedback-submit" style="margin-top:10px;width:100%">Submit</button>
            <button id="feedback-close" style="margin-top:5px;width:100%">Close</button>
        `;
        document.body.appendChild(widget);
        document.getElementById('feedback-submit').onclick = () => {
            const text = document.getElementById('feedback-text').value.trim();
            if (text) {
                this.submitFeedback({ text, page: window.location.pathname });
                widget.innerHTML = '<div style="text-align:center;padding:20px 0">Thank you for your feedback! 💙</div>';
                setTimeout(() => widget.remove(), 2000);
            }
        };
        document.getElementById('feedback-close').onclick = () => widget.remove();
    }
}

window.errorHandler = new ErrorHandler();
