import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const formatAIChat = (row) => {
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
    learningLevel: row.learning_level,
    messages,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class AIAssistanceChat {
  static async create(data) {
    const id = data.id || data._id || uuidv4();
    const {
      userId,
      title = "New Chat",
      learningLevel = null,
      messages = [],
    } = data;

    const res = await query(
      `INSERT INTO ai_assistance_chats (id, user_id, title, learning_level, messages, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, userId, title, learningLevel, JSON.stringify(messages)]
    );

    return formatAIChat(res.rows[0]);
  }

  static async find(filter = {}) {
    if (filter.userId) {
      const res = await query(
        `SELECT * FROM ai_assistance_chats WHERE user_id = $1 ORDER BY created_at DESC`,
        [filter.userId]
      );
      return res.rows.map(formatAIChat);
    }
    const res = await query(`SELECT * FROM ai_assistance_chats ORDER BY created_at DESC`);
    return res.rows.map(formatAIChat);
  }

  static async findById(id) {
    if (!id) return null;
    const res = await query(`SELECT * FROM ai_assistance_chats WHERE id = $1`, [id]);
    return formatAIChat(res.rows[0]);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const existing = await AIAssistanceChat.findById(id);
    if (!existing) return null;

    let updatedTitle = existing.title;
    let updatedLearningLevel = existing.learningLevel;
    let updatedMessages = [...existing.messages];

    if (update.title !== undefined) {
      updatedTitle = update.title;
    }
    if (update.learningLevel !== undefined) {
      updatedLearningLevel = update.learningLevel;
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
      `UPDATE ai_assistance_chats
       SET title = $1, learning_level = $2, messages = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [updatedTitle, updatedLearningLevel, JSON.stringify(updatedMessages), id]
    );

    return formatAIChat(res.rows[0]);
  }

  static async findByIdAndDelete(id) {
    const res = await query(`DELETE FROM ai_assistance_chats WHERE id = $1 RETURNING *`, [id]);
    return formatAIChat(res.rows[0]);
  }
}

export default AIAssistanceChat;
