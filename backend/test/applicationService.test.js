import test from "node:test";
import assert from "node:assert/strict";

import {
  validateApplication,
  createApplication,
  validateApplicationStatus,
  updateApplicationStatus,
  saveApplication,
  changeApplicationStatus,
} from "../src/services/applicationService.js";


test("valid application passes validation", () => {
  const application = {
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
    notes: "Submitted online",
  };

  const result = validateApplication(application);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});


test("missing company fails validation", () => {
  const application = {
    company: "",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
  };

  const result = validateApplication(application);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Company name is required."));
});


test("invalid status fails validation", () => {
  const application = {
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Waiting",
  };

  const result = validateApplication(application);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Application status is invalid."));
});


test("createApplication returns valid application data", () => {
  const application = {
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
    notes: "",
  };

  const result = createApplication(application);

  assert.deepEqual(result, application);
});


test("createApplication throws error for invalid application", () => {
  const application = {
    company: "",
    position: "",
    applicationDate: "",
    status: "",
  };

  assert.throws(
    () => createApplication(application),
    /Company name is required/
  );
});


test("valid application status is accepted", () => {
  const result = validateApplicationStatus("Interview");

  assert.equal(result, "Interview");
});


test("invalid application status throws error", () => {
  assert.throws(
    () => validateApplicationStatus("Waiting"),
    /Application status is invalid/
  );
});


test("updateApplicationStatus changes the status", () => {
  const application = {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
  };

  const updatedApplication = updateApplicationStatus(
    application,
    "Under Review"
  );

  
  assert.equal(updatedApplication.status, "Under Review");
  assert.equal(updatedApplication.company, "Google");
});


test("saveApplication stores application in database", () => {
  const application = {
    company: "Amazon",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-10",
    status: "Applied",
    notes: "Submitted online",
  };

  const savedApplication = saveApplication(application);

  assert.equal(savedApplication.company_name, "Amazon");
  assert.equal(savedApplication.job_title, "Software Engineer Intern");
  assert.equal(savedApplication.status, "Applied");
  assert.equal(savedApplication.application_date, "2026-11-10");
});

test("changeApplicationStatus updates saved application status", () => {
  const application = {
    company: "Meta",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-10",
    status: "Applied",
  };

  const savedApplication = saveApplication(application);

  const updatedApplication = changeApplicationStatus(
    savedApplication.id,
    "Interview"

  );

  assert.equal(updatedApplication.status, "Interview");
  assert.equal(updatedApplication.id, savedApplication.id);

});

test("changeApplicationStatus throws error for missing application", () => {
  assert.throws(
    () => changeApplicationStatus(999999, "Interview"),
    /Application not found/
    
  );
});