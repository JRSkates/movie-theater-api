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
    const users = await User.bulkCreate([
        { username: "g.lucas@gmail.com", password: "password123" },
        { username: "j.doe@gmail.com", password: "password456" },
        { username: "s.smith@gmail.com", password: "password789" }
    ])

    const shows = await Show.bulkCreate([
        {
          "title": "Inception",
          "genre": "Science Fiction",
          "available": true
        },
        {
          "title": "The Dark Knight",
          "genre": "Action",
          "available": true
        },
        {
          "title": "Harry Potter: The Prisoner of Azkaban",
          "genre": "Fantasy",
          "available": true
        },
        {
          "title": "Jurassic Park",
          "genre": "Science Fiction",
          "available": false
        },
        {
          "title": "The Lord of the Rings: The Return of the King",
          "genre": "Fantasy",
          "available": true
        },
        {
          "title": "Black Panther",
          "genre": "Action",
          "available": true
        }
      ])

    await users[0].addShow(shows[0]); // Associate user 1 with show 1
    await users[1].addShow(shows[1]); // Associate user 2 with show 2
});

afterAll(async () => {
    await db.close();
});

describe("Users endpoint", () => {
    it("GET /users", async () => {
        const response = await request(app).get("/users");
        // console.log(response.body)
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

    it("GET /users/:id/shows", async () => {
        const response = await request(app).get(`/users/2/shows`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].title).toBe("The Dark Knight");
    })

    it("GET /users/:id/shows 404", async () => {
        const response = await request(app).get(`/users/3/shows`);
        // console.log(response.body)
        expect(response.status).toBe(404);
    })

    it("PUT /users/:id/shows/:id", async () => {
        const response = await request(app).put(`/users/1/shows/3`)
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Show added to user");
    })

    it("PUT /users/:id/shows/:id 404 no", async () => {
        const response = await request(app).put(`/users/1/shows/100`)
        // console.log(response.body)
        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("Show not found");
    })
})

describe("Shows endpoint", () => {
    it("GET /shows", async () => {
        const response = await request(app).get("/shows");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    it("GET /shows/:id", async () => {
        const response = await request(app).get(`/shows/1`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Inception");
    })

    it("GET /shows/:id 404", async () => {
        const response = await request(app).get(`/shows/100`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Show not found");
    })

    it("GET /shows/:id/users", async () => {
        const response = await request(app).get(`/shows/1/users`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].username).toBe("g.lucas@gmail.com");
    })

    it("GET /shows/:id/users 404", async () => {
        const response = await request(app).get(`/shows/4/users`);
        // console.log(response.body)
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No users found for this show");
    })

    it("PUT /shows/:id/available", async () => {
        const responseOne = await request(app).put(`/shows/4/available`)
        // console.log(responseOne.body)
        expect(responseOne.status).toBe(200); 
        expect(responseOne.body.message).toBe("Show 4 availability updated successfully to true");

        const responseTwo = await request(app).put(`/shows/5/available`)
        expect(responseTwo.status).toBe(200); 
        expect(responseTwo.body.message).toBe("Show 5 availability updated successfully to false");
    })
});
