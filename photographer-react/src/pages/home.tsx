import { useEffect, useState } from 'react'
import { Canvas } from '@/components/canvas/Canvas'
import { fetchProfile } from '@/lib/api'
import type { Profile } from '@/types'

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-zinc-400 text-sm">Could not connect to the API.</p>
          <p className="text-zinc-600 text-xs font-mono">{error}</p>
          <button
            onClick={() => { setError(null); fetchProfile().then(setProfile).catch((e) => setError(e.message)) }}
            className="mt-2 px-4 py-2 text-xs bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="w-full h-full">
      <Canvas profile={profile} initialAlbumId={null} initialPhotoId={null} />
    </main>
  )
}
