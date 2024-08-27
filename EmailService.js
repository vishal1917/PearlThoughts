// src/EmailService.js
const MockProvider = require('./MockProvider');
const RateLimiter = require('./RateLimiter');
const Queue = require('./Queue');
const CircuitBreaker = require('./CircuitBreaker');

class EmailService {
    constructor(providers, rateLimit, circuitBreakerThreshold) {
        this.providers = providers;
        this.rateLimiter = new RateLimiter(rateLimit);
        this.queue = new Queue();
        this.circuitBreaker = new CircuitBreaker(circuitBreakerThreshold);
        this.retryCount = 0;
        this.status = {};
    }

    async sendEmail(email) {
        const sendAttempt = async (provider) => {
            try {
                this.circuitBreaker.reset();
                await this.rateLimiter.acquire();
                const response = await provider.sendEmail(email);
                this.status[email.id] = 'Sent';
                return response;
            } catch (error) {
                this.status[email.id] = `Failed: ${error.message}`;
                this.circuitBreaker.recordFailure();
                throw error;
            }
        };

        const tryProviders = async () => {
            for (const provider of this.providers) {
                try {
                    return await sendAttempt(provider);
                } catch (error) {
                    if (this.circuitBreaker.isOpen()) {
                        console.log(this.circuitBreaker.toString());
                        throw new Error('All providers failed and circuit breaker is open');
                    }
                    console.log(`Provider failed, retrying with another provider...`);
                }
            }
            throw new Error('All providers failed');
        };

        this.queue.add(() => this.retryWithBackoff(tryProviders));
        await this.queue.process();
    }

    async retryWithBackoff(fn) {
        let attempts = 0;
        while (attempts < 5) {
            try {
                return await fn();
            } catch (error) {
                attempts++;
                const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
                await this.delay(delay);
            }
        }
        throw new Error('Max retries reached');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = EmailService;
