import express from "express";
import multer from "multer";
import { mkdirSync, existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument
} from "../repositories/documentRepository.js";

const router = express.Router();

const routesFolder = path.dirname(fileURLToPath(import.meta.url));
const uploadFolder = path.join(routesFolder, "..", "..", "uploads");

mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadFolder);
  },

  filename: function (_req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage
});


router.get("/", (req, res) => {
  const documents = getAllDocuments(req.userId);

  res.json(documents);
});


router.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "Please select a document to upload."
    });
  }

  const documentId = addDocument(
    {
      file_name: req.file.filename,
      original_name: req.file.originalname,
      file_type: req.file.mimetype,
      file_path: req.file.path
    },
    req.userId
  );

  res.status(201).json({
    id: documentId,
    original_name: req.file.originalname,
    file_type: req.file.mimetype
  });
});

router.get("/:id/download", (req, res) => {
  const document = getDocumentById(req.params.id, req.userId);

  if (!document) {
    return res.status(404).json({
      error: "Document not found."
    });
  }

  if (!existsSync(document.file_path)) {
    return res.status(404).json({
      error: "Document file not found."
    });
  }

  res.download(document.file_path, document.original_name);
});

router.delete("/:id", (req, res) => {
  const document = getDocumentById(req.params.id, req.userId);

  if (!document) {
    return res.status(404).json({
      error: "Document not found."
    });
  }

  if (existsSync(document.file_path)) {
    unlinkSync(document.file_path);
  }

  deleteDocument(req.params.id, req.userId);

  res.json({
    message: "Document deleted successfully."
  });
});

export default router;