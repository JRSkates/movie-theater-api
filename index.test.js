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
    await User.bulkCreate([
        { username: "g.lucas@gmail.com", password: "password123" },
        { username: "j.doe@gmail.com", password: "password456" },
    ])
});

afterAll(async () => {
    await db.close();
});

describe("Users endpoint", () => {
    it("GET /users", async () => {
        const response = await request(app).get("/users");
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    it("GET /users/:id", async () => {
        const response = await request(app).get(`/users/1`);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe("g.lucas@gmail.com");
    })

    it("GET /users/:id 404", async () => {
        const response = await request(app).get(`/users/100`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    })
})