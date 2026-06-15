import multer from 'multer'

// Store file in memory; routes stream directly to Cloudinary
export const upload = multer({ storage: multer.memoryStorage() })
