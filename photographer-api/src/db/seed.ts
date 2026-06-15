import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pool from './pool'

const PHOTO_DIMS = [
  [800, 1067], [1200, 800], [800, 800],
  [800, 1200], [1200, 900], [800, 1067],
  [1200, 800], [800, 1067], [1200, 900],
] as const

const CAMERAS   = ['Sony α7R V','Fujifilm X-T5','Leica M11','Nikon Z9','Canon EOS R5','Sony α7C II','Hasselblad X2D','Fujifilm GFX 100S','Nikon Z8']
const LENSES    = ['Sigma 35mm f/1.4 Art','Fujinon XF 50mm f/1.0','Leica Summicron-M 28mm f/2','Nikkor Z 85mm f/1.2 S','RF 24-70mm f/2.8L IS','Sony FE 24mm f/1.4 GM','Otus 55mm f/1.4','Voigtländer 40mm f/1.2','Laowa 15mm f/2 Zero-D']
const DATES     = ['January 2024','March 2024','July 2023','November 2023','April 2024','August 2023','February 2024','October 2023','June 2024']
const LOCATIONS = ['Mumbai, Maharashtra','Fort Kochi, Kerala','Jodhpur, Rajasthan','Varanasi, Uttar Pradesh','Spiti Valley, Himachal Pradesh','Hampi, Karnataka','Rishikesh, Uttarakhand','Madurai, Tamil Nadu','Kolkata, West Bengal']

const ALBUMS = [
  { slug: 'street',       title: 'Street',       caption: 'Urban life and candid moments' },
  { slug: 'landscape',    title: 'Landscape',     caption: "Nature's grandeur"             },
  { slug: 'portrait',     title: 'Portrait',      caption: 'Faces and stories'             },
  { slug: 'minimal',      title: 'Minimal',       caption: 'Less is more'                  },
  { slug: 'travel',       title: 'Travel',        caption: 'Around the world'              },
  { slug: 'architecture', title: 'Architecture',  caption: 'Structures and spaces'         },
]

async function seed() {
  const client = await pool.connect()
  try {
    // User
    const password = await bcrypt.hash('admin123', 12)
    const userRes = await client.query(
      `INSERT INTO users (email, password) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      ['admin@portfolio.com', password]
    )
    const userId = userRes.rows[0].id

    // Profile
    const profileRes = await client.query(
      `INSERT INTO profiles (user_id, name, location, bio, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [userId, 'Chaitanya', 'Mumbai, India', 'Photographer capturing fleeting moments of light, texture, and emotion.', 'https://picsum.photos/seed/chaitanya-avatar/400/400']
    )
    const profileId = profileRes.rows[0].id

    // Social links (replace all)
    await client.query('DELETE FROM social_links WHERE profile_id = $1', [profileId])
    for (const link of [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: '500px',     href: 'https://500px.com'     },
      { label: 'Behance',   href: 'https://behance.net'   },
    ]) {
      await client.query(
        'INSERT INTO social_links (profile_id, label, href) VALUES ($1, $2, $3)',
        [profileId, link.label, link.href]
      )
    }

    // Albums + photos
    for (const [idx, a] of ALBUMS.entries()) {
      const albumRes = await client.query(
        `INSERT INTO albums (profile_id, title, caption, cover_url, "order")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [profileId, a.title, a.caption, `https://picsum.photos/seed/${a.slug}-cover/900/600`, idx]
      )
      // If already existed, fetch it
      let albumId: string
      if (albumRes.rows.length > 0) {
        albumId = albumRes.rows[0].id
      } else {
        const existing = await client.query('SELECT id FROM albums WHERE profile_id=$1 AND title=$2', [profileId, a.title])
        albumId = existing.rows[0].id
      }

      for (const [i, [w, h]] of PHOTO_DIMS.entries()) {
        await client.query(
          `INSERT INTO photos (album_id, url, width, height, camera, lens, capture_date, location, "order")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT DO NOTHING`,
          [albumId, `https://picsum.photos/seed/${a.slug}-${i}/${w}/${h}`, w, h,
           CAMERAS[i % CAMERAS.length], LENSES[i % LENSES.length],
           DATES[i % DATES.length], LOCATIONS[i % LOCATIONS.length], i]
        )
      }
    }

    console.log('Seeded. Login: admin@portfolio.com / admin123')
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((e) => { console.error(e); process.exit(1) })
