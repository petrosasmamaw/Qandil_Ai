import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const formatNotesChat = (row) => {
  if (!row) return null;
  let messages = [];
  try {
    messages = typeof row.messages === "string" ? JSON.parse(row.messages) : row.messages || [];
  } catch (e) {
    messages = [];
  }
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    title: row.title,
    subject: row.subject,
    messages,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class NotesChat {
  static async create(data) {
    const id = data.id || data._id || uuidv4();
    const {
      userId,
      title = "New Notes",
      subject = null,
      messages = [],
    } = data;

    const res = await query(
      `INSERT INTO notes_chats (id, user_id, title, subject, messages, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, userId, title, subject, JSON.stringify(messages)]
    );

    return formatNotesChat(res.rows[0]);
  }

  static async find(filter = {}) {
    if (filter.userId) {
      const res = await query(
        `SELECT * FROM notes_chats WHERE user_id = $1 ORDER BY created_at DESC`,
        [filter.userId]
      );
      return res.rows.map(formatNotesChat);
    }
    const res = await query(`SELECT * FROM notes_chats ORDER BY created_at DESC`);
    return res.rows.map(formatNotesChat);
  }

  static async findById(id) {
    if (!id) return null;
    const res = await query(`SELECT * FROM notes_chats WHERE id = $1`, [id]);
    return formatNotesChat(res.rows[0]);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const existing = await NotesChat.findById(id);
    if (!existing) return null;

    let updatedTitle = existing.title;
    let updatedSubject = existing.subject;
    let updatedMessages = [...existing.messages];

    if (update.title !== undefined) {
      updatedTitle = update.title;
    }
    if (update.subject !== undefined) {
      updatedSubject = update.subject;
    }

    if (update.$push && update.$push.messages) {
      const newMsg = {
        ...update.$push.messages,
        id: update.$push.messages.id || uuidv4(),
        timestamp: update.$push.messages.timestamp || new Date().toISOString(),
      };
      updatedMessages.push(newMsg);
    } else if (Array.isArray(update.messages)) {
      updatedMessages = update.messages;
    }

    const res = await query(
      `UPDATE notes_chats
       SET title = $1, subject = $2, messages = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [updatedTitle, updatedSubject, JSON.stringify(updatedMessages), id]
    );

    return formatNotesChat(res.rows[0]);
  }

  static async findByIdAndDelete(id) {
    const res = await query(`DELETE FROM notes_chats WHERE id = $1 RETURNING *`, [id]);
    return formatNotesChat(res.rows[0]);
  }
}

export default NotesChat;
