export interface Photo {
  id: string
  url: string
  width: number
  height: number
  caption?: string
  camera?: string
  lens?: string
  captureDate?: string
  location?: string
}

export interface Album {
  id: string
  title: string
  caption?: string
  coverUrl: string
  photos: Photo[]
}

export interface SocialLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  location: string
  bio: string
  avatarUrl: string
  socialLinks: SocialLink[]
  albums: Album[]
}
