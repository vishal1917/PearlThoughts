// src/MockProvider.js
class MockProvider {
    constructor(name, failProbability = 0) {
        this.name = name;
        this.failProbability = failProbability;
    }

    async sendEmail(email) {
        if (Math.random() < this.failProbability) {
            throw new Error(`${this.name} failed to send email.`);
        }
        return `Email sent by ${this.name}`;
    }
}

module.exports = MockProvider;
