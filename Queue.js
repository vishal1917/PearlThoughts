// src/Queue.js
class Queue {
    constructor() {
        this.queue = [];
    }

    add(task) {
        this.queue.push(task);
    }

    async process() {
        while (this.queue.length) {
            const task = this.queue.shift();
            await task();
        }
    }
}

module.exports = Queue;
