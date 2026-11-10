import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

import app from "../src/app.js";
import {
  deleteApplication,

} 
from "../src/repositories/applicationRepository.js";

function startTestServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app);

    server.listen(0, () => {
      const address = server.address();

      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

test("POST /api/applications creates an application", async () => {
  const { server, baseUrl } = await startTestServer();

  let savedApplication;

  try {
    const response = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: "Apple",
        position: "Software Engineer Intern",
        applicationDate: "2026-11-10",
        status: "Applied",
        notes: "Submitted online",

      }),
    });

    assert.equal(response.status, 201);

    savedApplication = await response.json();

    assert.equal(savedApplication.company_name, "Apple");
    assert.equal(savedApplication.job_title, "Software Engineer Intern");
    assert.equal(savedApplication.status, "Applied");
  } 
  finally {
    if (savedApplication?.id) {

      deleteApplication(savedApplication.id);
    }

    server.close();
  }
});

test("POST /api/applications rejects invalid application", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({
        company: "",
        position: "",
        applicationDate: "",
        status: "",
      }),

    });

    assert.equal(response.status, 400);

    const body = await response.json();

    assert.match(body.error, /Company name is required/);
  } 
  finally {
    server.close();
  }

});

test("PATCH /api/applications/:id/status updates application status", async () => {
  const { server, baseUrl } = await startTestServer();

  let savedApplication;

  try {
    const createResponse = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        company: "Netflix",
        position: "Software Engineer Intern",
        applicationDate: "2026-11-10",
        status: "Applied",
      }),
    });

    savedApplication = await createResponse.json();

    const updateResponse = await fetch(
      `${baseUrl}/api/applications/${savedApplication.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Interview",
        }),
      }
    );

    assert.equal(updateResponse.status, 200);

    const updatedApplication = await updateResponse.json();

    assert.equal(updatedApplication.status, "Interview");
    assert.equal(updatedApplication.id, savedApplication.id);
  } 
  finally {
    if (savedApplication?.id) {
      deleteApplication(savedApplication.id);
    }

    server.close();
  }
});

test("PATCH /api/applications/:id/status returns 404 for missing application", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(
      `${baseUrl}/api/applications/999999/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Interview",
        }),
      }
    );

    assert.equal(response.status, 404);

    const body = await response.json();

    assert.equal(body.error, "Application not found.");
  } 
  finally {
    server.close();
  }
});