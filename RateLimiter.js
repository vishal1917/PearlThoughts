// src/RateLimiter.js
class RateLimiter {
    constructor(maxRequestsPerMinute) {
        this.maxRequestsPerMinute = maxRequestsPerMinute;
        this.requests = 0;
        this.resetInterval = 60000; // 1 minute
        this.lastReset = Date.now();
    }

    async acquire() {
        const now = Date.now();
        if (now - this.lastReset > this.resetInterval) {
            this.requests = 0;
            this.lastReset = now;
        }

        if (this.requests >= this.maxRequestsPerMinute) {
            throw new Error('Rate limit exceeded');
        }

        this.requests++;
    }
}

module.exports = RateLimiter;
