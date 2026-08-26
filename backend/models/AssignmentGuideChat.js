import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const formatAssignmentGuideChat = (row) => {
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
    assignmentType: row.assignment_type,
    messages,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class AssignmentGuideChat {
  static async create(data) {
    const id = data.id || data._id || uuidv4();
    const {
      userId,
      title = "Assignment Guidance",
      assignmentType = null,
      messages = [],
    } = data;

    const res = await query(
      `INSERT INTO assignment_guide_chats (id, user_id, title, assignment_type, messages, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, userId, title, assignmentType, JSON.stringify(messages)]
    );

    return formatAssignmentGuideChat(res.rows[0]);
  }

  static async find(filter = {}) {
    if (filter.userId) {
      const res = await query(
        `SELECT * FROM assignment_guide_chats WHERE user_id = $1 ORDER BY created_at DESC`,
        [filter.userId]
      );
      return res.rows.map(formatAssignmentGuideChat);
    }
    const res = await query(`SELECT * FROM assignment_guide_chats ORDER BY created_at DESC`);
    return res.rows.map(formatAssignmentGuideChat);
  }

  static async findById(id) {
    if (!id) return null;
    const res = await query(`SELECT * FROM assignment_guide_chats WHERE id = $1`, [id]);
    return formatAssignmentGuideChat(res.rows[0]);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const existing = await AssignmentGuideChat.findById(id);
    if (!existing) return null;

    let updatedTitle = existing.title;
    let updatedAssignmentType = existing.assignmentType;
    let updatedMessages = [...existing.messages];

    if (update.title !== undefined) {
      updatedTitle = update.title;
    }
    if (update.assignmentType !== undefined) {
      updatedAssignmentType = update.assignmentType;
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
      `UPDATE assignment_guide_chats
       SET title = $1, assignment_type = $2, messages = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [updatedTitle, updatedAssignmentType, JSON.stringify(updatedMessages), id]
    );

    return formatAssignmentGuideChat(res.rows[0]);
  }

  static async findByIdAndDelete(id) {
    const res = await query(`DELETE FROM assignment_guide_chats WHERE id = $1 RETURNING *`, [id]);
    return formatAssignmentGuideChat(res.rows[0]);
  }
}

export default AssignmentGuideChat;
