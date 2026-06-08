import { Avatar } from './Avatar'
import { Bio } from './Bio'
import { SocialLinks } from './SocialLinks'
import { AlbumGrid } from './AlbumGrid'
import type { Profile } from '@/types'

interface ProfileSceneProps {
  profile: Profile
}

export function ProfileScene({ profile }: ProfileSceneProps) {
  return (
    <div className="relative z-0 w-full h-full overflow-y-auto">

      {/* Profile header — constrained width */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6 sm:gap-10">
          <Avatar src={profile.avatarUrl} name={profile.name} />
          <div className="flex-1 min-w-0">
            <Bio
              name={profile.name}
              location={profile.location}
              bio={profile.bio}
            />
            <SocialLinks links={profile.socialLinks} />
          </div>
        </div>
        <hr className="my-8 sm:my-10 border-zinc-200 dark:border-zinc-800" />
      </div>

      {/* Album grid — full width so the 6-column layout has room to breathe */}
      <AlbumGrid albums={profile.albums} />

    </div>
  )
}
