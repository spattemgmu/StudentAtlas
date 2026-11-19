
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import app from "../src/app.js";
import db from "../src/database/db.js";

import { createUser } from "../src/repositories/userRepository.js";

import {
  addApplication,
  getApplicationById,
} from "../src/repositories/applicationRepository.js";

import { hashPassword } from "../src/utils/passwordUtils.js";

// Start a temporary Express server for testing.
const server = app.listen(0);

const baseUrl = `http://127.0.0.1:${server.address().port}`;

// Create a unique email for each test user.
function testEmail(label) {
  const safeLabel = label.toLowerCase().replace(/\s+/g, "-");
  return `${safeLabel}-${randomUUID()}@example.com`;
}

// Create a temporary user in the test database.
async function makeTestUser(label) {
  const email = testEmail(label);
  const password = "TestPassword123!";
  const passwordHash = await hashPassword(password);

  const id = createUser(label, email, passwordHash);

  return {
    id,
    email,
    password,
  };
}

// Log in and return the session cookie.
async function login(user) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  });

  // Display useful information if login fails.
  if (response.status !== 200) {
    console.log("Login status:", response.status);
    console.log("Login response:", await response.text());
    console.log("Test email:", user.email);
  }

  assert.equal(response.status, 200);

  const cookie = response.headers.get("set-cookie");

  assert.ok(
    cookie,
    "Login should return a session cookie."
  );

  return cookie.split(";")[0];
}

// Create an application owned by a specific user.
function makeApplication(userId) {
  return addApplication(
    {
      company_name: "Microsoft",
      job_title: "Software Engineer Intern",
      status: "Saved",
    },
    userId
  );
}

// Test 1: Unauthenticated users cannot delete applications.
test("DELETE requires login", async () => {
  const response = await fetch(
    `${baseUrl}/api/applications/1`,
    {
      method: "DELETE",
    }
  );

  assert.equal(response.status, 401);
});

// Test 2: A student can delete their own application.
test("DELETE removes an application owned by the student", async () => {
  const user = await makeTestUser("Delete Owner");
  const applicationId = makeApplication(user.id);

  try {
    const cookie = await login(user);

    const response = await fetch(
      `${baseUrl}/api/applications/${applicationId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: cookie,
        },
      }
    );

    assert.equal(response.status, 200);

    const result = await response.json();

    assert.equal(
      result.message,
      "Application deleted successfully."
    );

    // Verify the application was removed from the database.
    assert.equal(
      getApplicationById(applicationId, user.id),
      undefined
    );

  } finally {
    // Remove temporary test data.
    db.prepare("DELETE FROM applications WHERE user_id = ?")
      .run(user.id);

    db.prepare("DELETE FROM users WHERE id = ?")
      .run(user.id);
  }
});

// Test 3: A student cannot delete another student's application.
test("DELETE prevents deleting another student's application", async () => {
  const owner = await makeTestUser("Application Owner");
  const otherUser = await makeTestUser("Other Student");

  const applicationId = makeApplication(owner.id);

  try {
    const cookie = await login(otherUser);

    const response = await fetch(
      `${baseUrl}/api/applications/${applicationId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: cookie,
        },
      }
    );

    assert.equal(response.status, 404);

    // Verify the owner's application still exists.
    const application = getApplicationById(
      applicationId,
      owner.id
    );

    assert.ok(application);

  } finally {
    db.prepare("DELETE FROM applications WHERE user_id IN (?, ?)")
      .run(owner.id, otherUser.id);

    db.prepare("DELETE FROM users WHERE id IN (?, ?)")
      .run(owner.id, otherUser.id);
  }
});

// Test 4: Invalid application IDs are rejected.
test("DELETE rejects an invalid application ID", async () => {
  const user = await makeTestUser("Invalid ID Student");

  try {
    const cookie = await login(user);

    const response = await fetch(
      `${baseUrl}/api/applications/abc`,
      {
        method: "DELETE",
        headers: {
          Cookie: cookie,
        },
      }
    );

    assert.equal(response.status, 400);

  } finally {
    db.prepare("DELETE FROM applications WHERE user_id = ?")
      .run(user.id);

    db.prepare("DELETE FROM users WHERE id = ?")
      .run(user.id);
  }
});

// Test 5: Nonexistent applications return 404.
test("DELETE returns 404 for a missing application", async () => {
  const user = await makeTestUser("Missing Application Student");

  try {
    const cookie = await login(user);

    const response = await fetch(
      `${baseUrl}/api/applications/999999999`,
      {
        method: "DELETE",
        headers: {
          Cookie: cookie,
        },
      }
    );

    assert.equal(response.status, 404);

  } finally {
    db.prepare("DELETE FROM applications WHERE user_id = ?")
      .run(user.id);

    db.prepare("DELETE FROM users WHERE id = ?")
      .run(user.id);
  }
});

// Close the temporary server after testing.
test.after(() => {
  server.close();
});
