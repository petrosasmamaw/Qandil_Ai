import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export const formatUser = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || "student",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class User {
  static async create({ name, email, password, role = "student" }) {
    const id = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const normalizedEmail = email.toLowerCase().trim();

    const res = await query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, name.trim(), normalizedEmail, hashedPassword, role]
    );

    return {
      user: formatUser(res.rows[0]),
      raw: res.rows[0],
    };
  }

  static async findByEmail(email) {
    if (!email) return null;
    const normalizedEmail = email.toLowerCase().trim();
    const res = await query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [normalizedEmail]);
    if (!res.rows[0]) return null;
    return {
      user: formatUser(res.rows[0]),
      raw: res.rows[0],
    };
  }

  static async findById(id) {
    if (!id) return null;
    const res = await query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);
    if (!res.rows[0]) return null;
    return formatUser(res.rows[0]);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

export default User;
