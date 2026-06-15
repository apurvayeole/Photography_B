import cloudinary from './cloudinary'

interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
}

export function uploadBuffer(buffer: Buffer, folder = 'photographer-portfolio'): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'))
        resolve({
          url:      result.secure_url,
          publicId: result.public_id,
          width:    result.width,
          height:   result.height,
        })
      }
    )
    stream.end(buffer)
  })
}
