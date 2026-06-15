import 'dotenv/config'
import pool from './pool'

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        email      TEXT UNIQUE NOT NULL,
        password   TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id     TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name        TEXT NOT NULL,
        location    TEXT,
        bio         TEXT,
        avatar_url  TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS social_links (
        id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        profile_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        label       TEXT NOT NULL,
        href        TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS albums (
        id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        profile_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title       TEXT NOT NULL,
        caption     TEXT,
        cover_url   TEXT,
        "order"     INT DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS photos (
        id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        album_id     TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
        url          TEXT NOT NULL,
        public_id    TEXT,
        width        INT DEFAULT 0,
        height       INT DEFAULT 0,
        caption      TEXT,
        camera       TEXT,
        lens         TEXT,
        capture_date TEXT,
        location     TEXT,
        "order"      INT DEFAULT 0,
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        updated_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log('Migration complete.')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((e) => { console.error(e); process.exit(1) })
