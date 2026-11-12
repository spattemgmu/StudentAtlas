import express from "express";

import {
  createApplicationHandler,
  updateApplicationStatusHandler,
  getAllApplicationsHandler,
} from "../controllers/applicationController.js";

const router = express.Router();


router.get("/", getAllApplicationsHandler);

router.post("/", createApplicationHandler);

router.patch("/:id/status", updateApplicationStatusHandler);

export default router;