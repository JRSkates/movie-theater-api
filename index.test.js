const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const Test = require('supertest/lib/test');
const { db } = require('./db/connection');
const app = require('./src/app');
const { Show, User } = require('./models/index');

beforeAll(async () => {
    await db.sync({ force: true });
});

afterAll(async () => {
    await db.close();
});

describe("Users endpoint", () => {
    it("GET /users", async () => {
        const response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })
})