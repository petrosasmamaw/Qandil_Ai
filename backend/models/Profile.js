import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const formatProfile = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    name: row.name,
    grade: Number(row.grade),
    level: row.level,
    studySystem: row.study_system,
    preferredLanguage: row.preferred_language || "en",
    goal: row.goal,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class Profile {
  static async create(data) {
    const id = data.id || data._id || uuidv4();
    const {
      userId,
      name,
      grade,
      level,
      studySystem,
      preferredLanguage = "en",
      goal,
    } = data;

    const res = await query(
      `INSERT INTO profiles (id, user_id, name, grade, level, study_system, preferred_language, goal, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [id, userId, name, grade, level, studySystem, preferredLanguage, goal]
    );

    return formatProfile(res.rows[0]);
  }

  static async find() {
    const res = await query(`SELECT * FROM profiles ORDER BY created_at DESC`);
    return res.rows.map(formatProfile);
  }

  static async findById(id) {
    const res = await query(`SELECT * FROM profiles WHERE id = $1`, [id]);
    return formatProfile(res.rows[0]);
  }

  static async findOne({ userId }) {
    if (!userId) return null;
    const res = await query(`SELECT * FROM profiles WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`, [userId]);
    return formatProfile(res.rows[0]);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    const existing = await Profile.findById(id);
    if (!existing) return null;

    const updated = {
      name: data.name !== undefined ? data.name : existing.name,
      grade: data.grade !== undefined ? data.grade : existing.grade,
      level: data.level !== undefined ? data.level : existing.level,
      studySystem: data.studySystem !== undefined ? data.studySystem : existing.studySystem,
      preferredLanguage: data.preferredLanguage !== undefined ? data.preferredLanguage : existing.preferredLanguage,
      goal: data.goal !== undefined ? data.goal : existing.goal,
    };

    const res = await query(
      `UPDATE profiles
       SET name = $1, grade = $2, level = $3, study_system = $4, preferred_language = $5, goal = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        updated.name,
        updated.grade,
        updated.level,
        updated.studySystem,
        updated.preferredLanguage,
        updated.goal,
        id,
      ]
    );

    return formatProfile(res.rows[0]);
  }

  static async findByIdAndDelete(id) {
    const res = await query(`DELETE FROM profiles WHERE id = $1 RETURNING *`, [id]);
    return formatProfile(res.rows[0]);
  }
}

export default Profile;
