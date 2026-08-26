import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not set in environment variables.");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const query = (text, params) => pool.query(text, params);

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log("🐘 Connected to Neon PostgreSQL Database.");

    // Create Profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        grade INT NOT NULL,
        level VARCHAR(100) NOT NULL,
        study_system VARCHAR(100) NOT NULL,
        preferred_language VARCHAR(50) DEFAULT 'en',
        goal VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    `);

    // Create AI Assistance Chats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_assistance_chats (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) DEFAULT 'New Chat',
        learning_level VARCHAR(100),
        messages JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_ai_assistance_chats_user_id ON ai_assistance_chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_ai_assistance_chats_created_at ON ai_assistance_chats(created_at DESC);
    `);

    // Create Notes Chats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes_chats (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) DEFAULT 'New Notes',
        subject VARCHAR(255),
        messages JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notes_chats_user_id ON notes_chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_notes_chats_created_at ON notes_chats(created_at DESC);
    `);

    // Create Assignment Guide Chats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assignment_guide_chats (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) DEFAULT 'Assignment Guidance',
        assignment_type VARCHAR(255),
        messages JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_assignment_guide_chats_user_id ON assignment_guide_chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_assignment_guide_chats_created_at ON assignment_guide_chats(created_at DESC);
    `);

    // Create Image Analyzer Chats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS image_analyzer_chats (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) DEFAULT 'Image Analysis',
        image_count INT DEFAULT 0,
        messages JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_image_analyzer_chats_user_id ON image_analyzer_chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_image_analyzer_chats_created_at ON image_analyzer_chats(created_at DESC);
    `);

    console.log("✅ Neon PostgreSQL schemas & tables verified.");
  } catch (error) {
    console.error("❌ Neon PostgreSQL initialization error:", error.message);
  } finally {
    client.release();
  }
};

export default initializeDatabase;
