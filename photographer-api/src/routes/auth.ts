import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/pool'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    res.status(400).json({ error: 'email, password, and name are required' }); return
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length) {
    res.status(409).json({ error: 'Email already in use' }); return
  }

  const hashed = await bcrypt.hash(password, 12)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const userRes = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashed]
    )
    const userId = userRes.rows[0].id
    const profileRes = await client.query(
      'INSERT INTO profiles (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name]
    )
    await client.query('COMMIT')
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.status(201).json({ token, profile: profileRes.rows[0] })
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' }); return
  }

  const userRes = await pool.query(
    'SELECT u.*, p.id as profile_id FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.email = $1',
    [email]
  )
  const user = userRes.rows[0]
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: 'Invalid credentials' }); return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  res.json({ token, profileId: user.profile_id })
})

export default router
