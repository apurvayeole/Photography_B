
interface BioProps {
  name: string
  location: string
  bio: string
}

export function Bio({ name, location, bio }: BioProps) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {name}
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        {location}
      </p>
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-md">
        {bio}
      </p>
    </div>
  )
}
