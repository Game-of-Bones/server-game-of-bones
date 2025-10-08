import request from "supertest";
import app from "../app";
import database from "../database/client";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
const exec = promisify(execCallback);

describe("Likes API", () => {
  const token = "fake-test-token";

  // Reset database once before all tests
  beforeAll(async () => {
    try {
      await exec("npm run test:reset");
      // Wait for database to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Failed to reset test database:", err);
      throw err;
    }
  }, 30000);

  afterAll(async () => {
    await database.end();
  });

  describe("GET /api/posts/:postId/likes", () => {
    it("should return the correct like count for a post", async () => {
      const response = await request(app).get("/api/posts/1/likes");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("count");
      expect(typeof response.body.count).toBe("number");
      expect(response.body.count).toBeGreaterThanOrEqual(0);
    });

    it("should return a count of 0 for a post with no likes", async () => {
      // First, remove any existing likes on post 1
      await request(app)
        .post("/api/posts/1/like")
        .set("Authorization", `Bearer ${token}`);
      
      // If there was a like, remove it again to ensure count is 0
      const checkResponse = await request(app).get("/api/posts/1/likes");
      if (checkResponse.body.count > 0) {
        await request(app)
          .post("/api/posts/1/like")
          .set("Authorization", `Bearer ${token}`);
      }

      const response = await request(app).get("/api/posts/1/likes");
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
    });
  });

  describe("POST /api/posts/:postId/like", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const response = await request(app).post("/api/posts/1/like");

      expect(response.status).toBe(401);
    });

    it("should allow an authenticated user to like a post", async () => {
      // First ensure post has no likes
      const checkResponse = await request(app).get("/api/posts/1/likes");
      if (checkResponse.body.count > 0) {
        await request(app)
          .post("/api/posts/1/like")
          .set("Authorization", `Bearer ${token}`);
      }

      const initialCount = await request(app).get("/api/posts/1/likes");
      const startingLikes = initialCount.body.count;

      const response = await request(app)
        .post("/api/posts/1/like")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Like added successfully");

      const countResponse = await request(app).get("/api/posts/1/likes");
      expect(countResponse.body.count).toBe(startingLikes + 1);
    });

    it("should allow an authenticated user to unlike a post they have already liked", async () => {
      // First, ensure the post has a like from user 1
      const checkResponse = await request(app).get("/api/posts/1/likes");
      if (checkResponse.body.count === 0) {
        await request(app)
          .post("/api/posts/1/like")
          .set("Authorization", `Bearer ${token}`);
      }

      // Get the current count
      const initialCount = await request(app).get("/api/posts/1/likes");
      const startingLikes = initialCount.body.count;

      // Now unlike it
      const response = await request(app)
        .post("/api/posts/1/like")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Like removed successfully");

      const countResponse = await request(app).get("/api/posts/1/likes");
      expect(countResponse.body.count).toBe(startingLikes - 1);
    });

    it("should return 404 if trying to like a non-existent post", async () => {
      const response = await request(app)
        .post("/api/posts/9999/like")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe("Post not found");
    });
  });
});