import type { Profile, Album, Photo } from '@/types'

const BASE = 'http://localhost:8000/api'

function getToken() {
  return localStorage.getItem('auth_token')
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── snake_case → camelCase mappers ──────────────────────────────────────────

function mapPhoto(r: any): Photo {
  return {
    id:          r.id,
    url:         r.url,
    width:       r.width  ?? 0,
    height:      r.height ?? 0,
    caption:     r.caption     ?? undefined,
    camera:      r.camera      ?? undefined,
    lens:        r.lens         ?? undefined,
    captureDate: r.capture_date ?? undefined,
    location:    r.location    ?? undefined,
  }
}

function mapAlbum(r: any): Album {
  return {
    id:       r.id,
    title:    r.title,
    caption:  r.caption   ?? undefined,
    coverUrl: r.cover_url ?? '',
    photos:   (r.photos ?? []).map(mapPhoto),
  }
}

function mapProfile(r: any): Profile {
  return {
    name:       r.name,
    location:   r.location ?? '',
    bio:        r.bio      ?? '',
    avatarUrl:  r.avatar_url ?? '',
    socialLinks: (r.social_links ?? r.socialLinks ?? []).map((l: any) => ({
      label: l.label,
      href:  l.href,
    })),
    albums: (r.albums ?? []).map(mapAlbum),
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Login failed')
  return res.json() as Promise<{ token: string; profileId: string }>
}

export async function register(email: string, password: string, name: string) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Register failed')
  return res.json() as Promise<{ token: string; profile: any }>
}

// ── Profile ─────────────────────────────────────────────────────────────────

export async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`${BASE}/profile`)
  if (!res.ok) throw new Error('Failed to load profile')
  return mapProfile(await res.json())
}

export async function updateProfile(data: { name?: string; location?: string; bio?: string; socialLinks?: { label: string; href: string }[] }) {
  const res = await fetch(`${BASE}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  return mapProfile(await res.json())
}

export async function uploadAvatar(file: File): Promise<string> {
  const form = new FormData()
  form.append('avatar', file)
  const res = await fetch(`${BASE}/profile/avatar`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (!res.ok) throw new Error('Avatar upload failed')
  const data = await res.json()
  return data.avatarUrl
}

// ── Albums ───────────────────────────────────────────────────────────────────

export async function fetchAlbums(): Promise<Album[]> {
  const res = await fetch(`${BASE}/albums`)
  if (!res.ok) throw new Error('Failed to load albums')
  const data = await res.json()
  return data.map(mapAlbum)
}

export async function createAlbum(title: string, caption?: string, coverUrl?: string): Promise<Album> {
  const res = await fetch(`${BASE}/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ title, caption, coverUrl }),
  })
  if (!res.ok) throw new Error('Failed to create album')
  return mapAlbum(await res.json())
}

export async function updateAlbum(id: string, data: { title?: string; caption?: string; coverUrl?: string }): Promise<Album> {
  const res = await fetch(`${BASE}/albums/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update album')
  return mapAlbum(await res.json())
}

export async function deleteAlbum(id: string): Promise<void> {
  await fetch(`${BASE}/albums/${id}`, { method: 'DELETE', headers: authHeaders() })
}

// ── Photos ───────────────────────────────────────────────────────────────────

export async function addPhoto(
  albumId: string,
  url: string,
  meta?: { width?: number; height?: number; caption?: string; camera?: string; lens?: string; captureDate?: string; location?: string }
): Promise<Photo> {
  const res = await fetch(`${BASE}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ albumId, url, ...meta }),
  })
  if (!res.ok) throw new Error('Failed to add photo')
  return mapPhoto(await res.json())
}

export async function updatePhoto(
  id: string,
  meta: { caption?: string; camera?: string; lens?: string; captureDate?: string; location?: string }
): Promise<Photo> {
  const res = await fetch(`${BASE}/photos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(meta),
  })
  if (!res.ok) throw new Error('Failed to update photo')
  return mapPhoto(await res.json())
}

export async function deletePhoto(id: string): Promise<void> {
  await fetch(`${BASE}/photos/${id}`, { method: 'DELETE', headers: authHeaders() })
}
