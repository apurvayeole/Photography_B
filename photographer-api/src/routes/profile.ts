import { Router, Request, Response } from 'express'
import pool from '../db/pool'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { upload } from '../middleware/upload'
import { uploadBuffer } from '../lib/uploadToCloudinary'

const router = Router()

async function buildProfile(profileId: string) {
  const [profileRes, linksRes, albumsRes] = await Promise.all([
    pool.query('SELECT * FROM profiles WHERE id = $1', [profileId]),
    pool.query('SELECT * FROM social_links WHERE profile_id = $1', [profileId]),
    pool.query('SELECT * FROM albums WHERE profile_id = $1 ORDER BY "order" ASC', [profileId]),
  ])

  if (!profileRes.rows.length) return null

  const albums = await Promise.all(
    albumsRes.rows.map(async (album: any) => {
      const photosRes = await pool.query(
        'SELECT * FROM photos WHERE album_id = $1 ORDER BY "order" ASC',
        [album.id]
      )
      return { ...album, photos: photosRes.rows }
    })
  )

  return {
    ...profileRes.rows[0],
    socialLinks: linksRes.rows,
    albums,
  }
}

// GET /api/profile — public, returns first profile with albums + photos
router.get('/', async (_req: Request, res: Response) => {
  const first = await pool.query('SELECT id FROM profiles LIMIT 1')
  if (!first.rows.length) { res.status(404).json({ error: 'No profile found' }); return }
  const profile = await buildProfile(first.rows[0].id)
  res.json(profile)
})

// GET /api/profile/:id — public
router.get('/:id', async (req: Request, res: Response) => {
  const profile = await buildProfile(req.params.id as string)
  if (!profile) { res.status(404).json({ error: 'Profile not found' }); return }
  res.json(profile)
})

// PATCH /api/profile — update own profile (auth required)
router.patch('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { name, location, bio, socialLinks } = req.body
  const profileRes = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [req.userId as string])
  if (!profileRes.rows.length) { res.status(404).json({ error: 'Profile not found' }); return }
  const profileId = profileRes.rows[0].id

  await pool.query(
    `UPDATE profiles SET
       name     = COALESCE($1, name),
       location = COALESCE($2, location),
       bio      = COALESCE($3, bio),
       updated_at = NOW()
     WHERE id = $4`,
    [name ?? null, location ?? null, bio ?? null, profileId]
  )

  if (Array.isArray(socialLinks)) {
    await pool.query('DELETE FROM social_links WHERE profile_id = $1', [profileId])
    for (const link of socialLinks as { label: string; href: string }[]) {
      await pool.query(
        'INSERT INTO social_links (profile_id, label, href) VALUES ($1, $2, $3)',
        [profileId, link.label, link.href]
      )
    }
  }

  const updated = await buildProfile(profileId)
  res.json(updated)
})

// POST /api/profile/avatar — upload avatar to Cloudinary (auth required)
router.post('/avatar', requireAuth, upload.single('avatar'), async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return }

  const profileRes = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [req.userId as string])
  if (!profileRes.rows.length) { res.status(404).json({ error: 'Profile not found' }); return }
  const profileId = profileRes.rows[0].id

  const result = await uploadBuffer(req.file.buffer, 'photographer-portfolio/avatars')

  await pool.query('UPDATE profiles SET avatar_url = $1, updated_at = NOW() WHERE id = $2', [result.url, profileId])
  res.json({ avatarUrl: result.url })
})

export default router
