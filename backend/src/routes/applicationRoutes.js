import express from "express";

import {
  createApplicationHandler,
  updateApplicationStatusHandler,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", createApplicationHandler);

router.patch("/:id/status", updateApplicationStatusHandler);

export default router;