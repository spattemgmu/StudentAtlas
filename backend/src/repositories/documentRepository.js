import db from "../database/db.js";
export function addDocument(document, userId) {
  const statement = db.prepare(`
    INSERT INTO documents (
      user_id,
      file_name,
      original_name,
      file_type,
      file_path
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    userId,
    document.file_name,
    document.original_name,
    document.file_type ?? null,
    document.file_path
  );

  return Number(result.lastInsertRowid);
}


export function getAllDocuments(userId) {
  const statement = db.prepare(`
    SELECT * FROM documents
    WHERE user_id = ?
    ORDER BY uploaded_at DESC
  `);

  return statement.all(userId);
}


export function getDocumentById(id, userId) {
  const statement = db.prepare(`
    SELECT * FROM documents
    WHERE id = ? AND user_id = ?
  `);

  return statement.get(id, userId);
}


export function deleteDocument(id, userId) {
  const statement = db.prepare(`
    DELETE FROM documents
    WHERE id = ? AND user_id = ?
  `);

  const result = statement.run(id, userId);

  return result.changes > 0;
}