const request = require('supertest');
const dbHandler = require('./src/DbHandler/DbHandler');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = require('./index'); // Adjust the path to your main file

afterAll(() => {
    // Assuming dbHandler is imported in your main app file or accessible here
    // Close the database pool or connection to prevent open handles
    dbHandler.pool.end(); // Adjust this to match your actual DB handler
});

describe('Rate Limiting', () => {
    it('should block requests after the rate limit is exceeded', async () => {
        const MAX_REQUESTS = 500; // Max requests as defined in rate limiter
        const ROUTE = '/products'; // Adjust to the route you want to test

        for (let i = 1; i <= MAX_REQUESTS; i++) {
            const response = await request(app).get(ROUTE);
            if (i < MAX_REQUESTS) {
                expect(response.status).not.toBe(429); // Should pass for the initial requests
            }
        }

        // Make one more request, which should be blocked by rate limiter
        const response = await request(app).get(ROUTE);
        expect(response.status).toBe(429); // HTTP 429 Too Many Requests
        expect(response.text).toMatch(/Too many requests/i); // Check for rate limit message
    });
});
