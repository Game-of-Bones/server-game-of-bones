import request from "supertest";
import app from "../app";
import database from "../database/client";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
const exec = promisify(execCallback);

describe("Likes API", () => {
  // Since our verifyToken middleware is a placeholder that always authenticates
  // as user 1, we can use a simple, non-empty string as our "token".
  // This removes the dependency on a login endpoint.
  const token = "fake-test-token";

  // Before each test, reset the database.
  beforeEach(async () => {
    // Reset the test database before each test
    try {
      await exec("npm run test:reset");
    } catch (err) {
      console.error("Failed to reset test database:", err);
      // If the DB reset fails, we should stop the tests.
      throw err;
    }
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await database.end();
  });

  describe("GET /api/posts/:postId/likes", () => {
    it("should return the correct like count for a post", async () => {
      // Post with ID 1 has 2 likes in the initial test data
      const response = await request(app).get("/api/posts/1/likes");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("count");
      expect(response.body.count).toBe(2);
    });

    it("should return a count of 0 for a post with no likes", async () => {
      // Post with ID 3 has no likes in the test data
      const response = await request(app).get("/api/posts/3/likes");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
    });
  });

  describe("POST /api/posts/:postId/like", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const response = await request(app).post("/api/posts/3/like");

      expect(response.status).toBe(401);
    });

    it("should allow an authenticated user to like a post", async () => {
      // User 1 likes Post 3 (which has 0 likes)
      const response = await request(app)
        .post("/api/posts/3/like")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Like added successfully");

      // Verify the like count increased to 1
      const countResponse = await request(app).get("/api/posts/3/likes");
      expect(countResponse.body.count).toBe(1);
    });

    it("should allow an authenticated user to unlike a post they have already liked", async () => {
      // User 1 (from the token) has already liked Post 1 in the test data.
      // This request should remove the like.
      const response = await request(app)
        .post("/api/posts/1/like")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Like removed successfully");

      // Verify the like count decreased from 2 to 1
      const countResponse = await request(app).get("/api/posts/1/likes");
      expect(countResponse.body.count).toBe(1);
    });

    it("should return 404 if trying to like a non-existent post", async () => {
      const response = await request(app)
        .post("/api/posts/9999/like") // Assuming post 9999 does not exist
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe("Post not found");
    });
  });
});
