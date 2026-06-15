import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import {
  fetchProfile, updateProfile,
  fetchAlbums, createAlbum, updateAlbum, deleteAlbum,
  addPhoto, deletePhoto,
} from '@/lib/api'
import type { Profile, Album, Photo } from '@/types'

type Tab = 'profile' | 'albums'

// ─── tiny shared input style ──────────────────────────────────────────────────
const inp = 'w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors'
const btn = (variant: 'primary' | 'danger' | 'ghost') =>
  variant === 'primary' ? 'px-4 py-2 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-40'
  : variant === 'danger' ? 'px-3 py-1.5 bg-red-900/30 text-red-400 text-xs rounded-lg hover:bg-red-900/50 transition-colors border border-red-800/50'
  : 'px-3 py-1.5 text-zinc-400 text-xs rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-800'

// ─── Profile section ──────────────────────────────────────────────────────────
function ProfileSection({ initial }: { initial: Profile }) {
  const [name,     setName]     = useState(initial.name)
  const [location, setLocation] = useState(initial.location)
  const [bio,      setBio]      = useState(initial.bio)
  const [links,    setLinks]    = useState(initial.socialLinks)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState<string | null>(null)

  function addLink() { setLinks([...links, { label: '', href: '' }]) }
  function removeLink(i: number) { setLinks(links.filter((_, idx) => idx !== i)) }
  function patchLink(i: number, field: 'label' | 'href', val: string) {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [field]: val } : l))
  }

  async function save() {
    setSaving(true); setMsg(null)
    try {
      await updateProfile({ name, location, bio, socialLinks: links })
      setMsg('Saved.')
    } catch (e: any) { setMsg(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold text-white">Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-widest">Name</label>
          <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-widest">Location</label>
          <input className={inp} value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-widest">Bio</label>
          <textarea
            className={inp + ' resize-none h-24'}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Short biography…"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-zinc-400 uppercase tracking-widest">Social links</label>
          <button className={btn('ghost')} onClick={addLink}>+ Add</button>
        </div>
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className={inp} value={l.label} onChange={e => patchLink(i, 'label', e.target.value)} placeholder="Label" />
              <input className={inp} value={l.href}  onChange={e => patchLink(i, 'href',  e.target.value)} placeholder="URL" />
              <button className={btn('danger')} onClick={() => removeLink(i)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className={btn('primary')} disabled={saving} onClick={save}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
        {msg && <span className="text-xs text-zinc-400">{msg}</span>}
      </div>
    </div>
  )
}

// ─── Add Photo form ───────────────────────────────────────────────────────────
function AddPhotoForm({ albumId, onAdded }: { albumId: string; onAdded: (p: Photo) => void }) {
  const empty = { url: '', caption: '', camera: '', lens: '', captureDate: '', location: '' }
  const [fields, setFields] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState<string | null>(null)

  function patch(k: keyof typeof fields, v: string) { setFields(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!fields.url.trim()) { setErr('URL is required'); return }
    setSaving(true); setErr(null)
    try {
      const photo = await addPhoto(albumId, fields.url.trim(), {
        caption:     fields.caption     || undefined,
        camera:      fields.camera      || undefined,
        lens:        fields.lens        || undefined,
        captureDate: fields.captureDate || undefined,
        location:    fields.location    || undefined,
      })
      onAdded(photo)
      setFields(empty)
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Add photo</p>

      <div className="grid grid-cols-1 gap-2">
        <input className={inp} value={fields.url}         onChange={e => patch('url', e.target.value)}         placeholder="Image URL *" />
        <input className={inp} value={fields.caption}     onChange={e => patch('caption', e.target.value)}     placeholder="Caption" />
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} value={fields.camera}      onChange={e => patch('camera', e.target.value)}      placeholder="Camera" />
          <input className={inp} value={fields.lens}        onChange={e => patch('lens', e.target.value)}        placeholder="Lens" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} value={fields.captureDate} onChange={e => patch('captureDate', e.target.value)} placeholder="Capture date" />
          <input className={inp} value={fields.location}    onChange={e => patch('location', e.target.value)}    placeholder="Location" />
        </div>
      </div>

      {err && <p className="text-xs text-red-400">{err}</p>}

      <button className={btn('primary')} disabled={saving} onClick={submit}>
        {saving ? 'Adding…' : 'Add photo'}
      </button>
    </div>
  )
}

// ─── Photo row ────────────────────────────────────────────────────────────────
function PhotoRow({ photo, onDelete }: { photo: Photo; onDelete: () => void }) {
  const [deleting, setDeleting] = useState(false)

  async function remove() {
    setDeleting(true)
    try { await deletePhoto(photo.id); onDelete() }
    catch { setDeleting(false) }
  }

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
      <img src={photo.url} alt="" className="w-12 h-12 object-cover rounded-lg bg-zinc-800 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{photo.caption || <span className="text-zinc-600">No caption</span>}</p>
        <p className="text-xs text-zinc-500 truncate">{[photo.camera, photo.lens, photo.location].filter(Boolean).join(' · ')}</p>
      </div>
      <button className={btn('danger')} disabled={deleting} onClick={remove}>
        {deleting ? '…' : 'Delete'}
      </button>
    </div>
  )
}

// ─── Album card ───────────────────────────────────────────────────────────────
function AlbumCard({ album, onDelete, onRefresh }: {
  album: Album
  onDelete: () => void
  onRefresh: (updated: Album) => void
}) {
  const [open,     setOpen]     = useState(false)
  const [photos,   setPhotos]   = useState<Photo[]>(album.photos)
  const [deleting, setDeleting] = useState(false)

  // edit album fields
  const [editing,  setEditing]  = useState(false)
  const [title,    setTitle]    = useState(album.title)
  const [caption,  setCaption]  = useState(album.caption ?? '')
  const [coverUrl, setCoverUrl] = useState(album.coverUrl ?? '')
  const [saving,   setSaving]   = useState(false)

  async function removeAlbum() {
    setDeleting(true)
    try { await deleteAlbum(album.id); onDelete() }
    catch { setDeleting(false) }
  }

  async function saveAlbum() {
    setSaving(true)
    try {
      const updated = await updateAlbum(album.id, { title, caption: caption || undefined, coverUrl: coverUrl || undefined })
      onRefresh(updated)
      setEditing(false)
    } catch { }
    finally { setSaving(false) }
  }

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 p-4">
        {album.coverUrl && (
          <img src={album.coverUrl} alt="" className="w-14 h-10 object-cover rounded-lg bg-zinc-800 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{album.title}</p>
          <p className="text-xs text-zinc-500">{photos.length} photo{photos.length !== 1 ? 's' : ''}{album.caption ? ` · ${album.caption}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={btn('ghost')} onClick={() => { setOpen(o => !o); setEditing(false) }}>
            {open ? 'Collapse' : 'Manage'}
          </button>
          <button className={btn('danger')} disabled={deleting} onClick={removeAlbum}>
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* expanded */}
      {open && (
        <div className="border-t border-zinc-800 p-4 space-y-4">
          {/* edit album meta */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-zinc-400 uppercase tracking-widest">Album details</p>
              <button className={btn('ghost')} onClick={() => setEditing(e => !e)}>
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editing && (
              <div className="space-y-2">
                <input className={inp} value={title}    onChange={e => setTitle(e.target.value)}    placeholder="Title" />
                <input className={inp} value={caption}  onChange={e => setCaption(e.target.value)}  placeholder="Caption" />
                <input className={inp} value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="Cover image URL" />
                <button className={btn('primary')} disabled={saving} onClick={saveAlbum}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* photo list */}
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Photos</p>
            {photos.length === 0
              ? <p className="text-xs text-zinc-600 py-2">No photos yet.</p>
              : photos.map(p => (
                  <PhotoRow
                    key={p.id}
                    photo={p}
                    onDelete={() => setPhotos(ps => ps.filter(x => x.id !== p.id))}
                  />
                ))
            }
          </div>

          <AddPhotoForm
            albumId={album.id}
            onAdded={p => setPhotos(ps => [...ps, p])}
          />
        </div>
      )}
    </div>
  )
}

// ─── Albums section ───────────────────────────────────────────────────────────
function AlbumsSection() {
  const [albums,   setAlbums]   = useState<Album[]>([])
  const [loading,  setLoading]  = useState(true)

  // new album form
  const [title,    setTitle]    = useState('')
  const [caption,  setCaption]  = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [err,      setErr]      = useState<string | null>(null)

  useEffect(() => {
    fetchAlbums().then(setAlbums).finally(() => setLoading(false))
  }, [])

  async function create() {
    if (!title.trim()) { setErr('Title is required'); return }
    setCreating(true); setErr(null)
    try {
      const album = await createAlbum(title.trim(), caption || undefined, coverUrl || undefined)
      setAlbums(a => [...a, { ...album, photos: [] }])
      setTitle(''); setCaption(''); setCoverUrl('')
    } catch (e: any) { setErr(e.message) }
    finally { setCreating(false) }
  }

  if (loading) return <p className="text-sm text-zinc-500">Loading albums…</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-white">Albums</h2>

      {/* existing albums */}
      <div className="space-y-3">
        {albums.length === 0 && <p className="text-sm text-zinc-600">No albums yet.</p>}
        {albums.map(a => (
          <AlbumCard
            key={a.id}
            album={a}
            onDelete={() => setAlbums(prev => prev.filter(x => x.id !== a.id))}
            onRefresh={updated => setAlbums(prev => prev.map(x => x.id === updated.id ? { ...updated, photos: x.photos } : x))}
          />
        ))}
      </div>

      {/* create album */}
      <div className="border border-zinc-800 rounded-xl p-4 space-y-3">
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">New album</p>
        <input className={inp} value={title}    onChange={e => setTitle(e.target.value)}    placeholder="Title *" />
        <input className={inp} value={caption}  onChange={e => setCaption(e.target.value)}  placeholder="Caption" />
        <input className={inp} value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="Cover image URL" />
        {err && <p className="text-xs text-red-400">{err}</p>}
        <button className={btn('primary')} disabled={creating} onClick={create}>
          {creating ? 'Creating…' : 'Create album'}
        </button>
      </div>
    </div>
  )
}

// ─── Dashboard root ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const logout   = useAuthStore((s) => s.logout)

  const [tab,     setTab]     = useState<Tab>('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile().then(setProfile).finally(() => setLoading(false))
  }, [])

  function handleLogout() { logout(); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* top bar */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-zinc-300 tracking-wide">Admin panel</span>
          <nav className="flex gap-1">
            {(['profile', 'albums'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors capitalize ${
                  tab === t ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            View portfolio ↗
          </a>
          <button onClick={handleLogout} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* content */}
      <main className="px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === 'profile' && profile && <ProfileSection initial={profile} />}
            {tab === 'albums'  && <AlbumsSection />}
          </>
        )}
      </main>
    </div>
  )
}
