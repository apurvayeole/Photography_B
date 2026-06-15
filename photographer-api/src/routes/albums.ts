import { Router, Request, Response } from 'express'
import pool from '../db/pool'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

async function albumWithPhotos(albumId: string) {
  const [albumRes, photosRes] = await Promise.all([
    pool.query('SELECT * FROM albums WHERE id = $1', [albumId]),
    pool.query('SELECT * FROM photos WHERE album_id = $1 ORDER BY "order" ASC', [albumId]),
  ])
  if (!albumRes.rows.length) return null
  return { ...albumRes.rows[0], photos: photosRes.rows }
}

// GET /api/albums — public
router.get('/', async (_req: Request, res: Response) => {
  const albumsRes = await pool.query('SELECT * FROM albums ORDER BY "order" ASC')
  const albums = await Promise.all(albumsRes.rows.map((a: any) => albumWithPhotos(a.id)))
  res.json(albums)
})

// GET /api/albums/:id — public
router.get('/:id', async (req: Request, res: Response) => {
  const album = await albumWithPhotos(req.params.id as string)
  if (!album) { res.status(404).json({ error: 'Album not found' }); return }
  res.json(album)
})

// POST /api/albums — create album with JSON body (auth required)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, caption, coverUrl, order } = req.body
  if (!title) { res.status(400).json({ error: 'title is required' }); return }

  const profileRes = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [req.userId as string])
  if (!profileRes.rows.length) { res.status(404).json({ error: 'Profile not found' }); return }
  const profileId = profileRes.rows[0].id

  const res2 = await pool.query(
    `INSERT INTO albums (profile_id, title, caption, cover_url, "order")
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [profileId, title, caption ?? null, coverUrl ?? null, order ?? 0]
  )
  res.status(201).json(res2.rows[0])
})

// PATCH /api/albums/:id — update album with JSON body (auth required)
router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, caption, coverUrl, order } = req.body

  await pool.query(
    `UPDATE albums SET
       title      = COALESCE($1, title),
       caption    = COALESCE($2, caption),
       cover_url  = COALESCE($3, cover_url),
       "order"    = COALESCE($4, "order"),
       updated_at = NOW()
     WHERE id = $5`,
    [title ?? null, caption ?? null, coverUrl ?? null, order ?? null, req.params.id]
  )

  const updated = await albumWithPhotos(req.params.id as string)
  res.json(updated)
})

// DELETE /api/albums/:id — delete (cascades photos) (auth required)
router.delete('/:id', requireAuth, async (_req: AuthRequest, res: Response) => {
  await pool.query('DELETE FROM albums WHERE id = $1', [_req.params.id])
  res.json({ success: true })
})

export default router
