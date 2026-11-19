import express from "express";

import {
  createApplicationHandler,
  updateApplicationStatusHandler,
  getAllApplicationsHandler,
  deleteApplicationHandler,
} from "../controllers/applicationController.js";

const router = express.Router();

// Get all applications belonging to the logged-in student.
router.get("/", getAllApplicationsHandler);

// Create a new application for the logged-in student.
router.post("/", createApplicationHandler);

// Update an application's status.
router.patch("/:id/status", updateApplicationStatusHandler);

// Delete an application belonging to the logged-in student.
router.delete("/:id", deleteApplicationHandler);

export default router;
