import { Router, Request, Response } from 'express'
import pool from '../db/pool'
import cloudinary from '../lib/cloudinary'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/photos — add photo via JSON (url + metadata) (auth required)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { albumId, url, width, height, caption, camera, lens, captureDate, location, order } = req.body
  if (!albumId || !url) { res.status(400).json({ error: 'albumId and url are required' }); return }

  const photoRes = await pool.query(
    `INSERT INTO photos (album_id, url, width, height, caption, camera, lens, capture_date, location, "order")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [albumId, url, width ?? 0, height ?? 0,
     caption ?? null, camera ?? null, lens ?? null,
     captureDate ?? null, location ?? null, order ?? 0]
  )

  res.status(201).json(photoRes.rows[0])
})

// PATCH /api/photos/:id — update metadata only (auth required)
router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { caption, camera, lens, captureDate, location, order } = req.body

  const photoRes = await pool.query(
    `UPDATE photos SET
       caption      = COALESCE($1, caption),
       camera       = COALESCE($2, camera),
       lens         = COALESCE($3, lens),
       capture_date = COALESCE($4, capture_date),
       location     = COALESCE($5, location),
       "order"      = COALESCE($6, "order"),
       updated_at   = NOW()
     WHERE id = $7 RETURNING *`,
    [caption ?? null, camera ?? null, lens ?? null,
     captureDate ?? null, location ?? null,
     order !== undefined ? parseInt(order) : null,
     req.params.id]
  )

  res.json(photoRes.rows[0])
})

// DELETE /api/photos/:id — remove from Cloudinary + DB (auth required)
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const photoRes = await pool.query('SELECT public_id FROM photos WHERE id = $1', [req.params.id])
  if (!photoRes.rows.length) { res.status(404).json({ error: 'Photo not found' }); return }

  const { public_id } = photoRes.rows[0]
  if (public_id) {
    await cloudinary.uploader.destroy(public_id).catch(() => {})
  }

  await pool.query('DELETE FROM photos WHERE id = $1', [req.params.id])
  res.json({ success: true })
})

export default router
