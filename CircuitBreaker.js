// src/CircuitBreaker.js
class CircuitBreaker {
    constructor(threshold) {
        this.threshold = threshold;
        this.failures = 0;
        this.state = 'CLOSED'; // Other states: OPEN, HALF_OPEN
    }

    recordFailure() {
        this.failures++;
        if (this.failures >= this.threshold) {
            this.state = 'OPEN';
        }
    }

    reset() {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    isOpen() {
        return this.state === 'OPEN';
    }

    toString() {
        return `CircuitBreaker state: ${this.state}`;
    }
}

module.exports = CircuitBreaker;
