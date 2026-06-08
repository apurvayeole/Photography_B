interface AvatarProps {
  src: string
  name: string
}

export function Avatar({ src, name }: AvatarProps) {
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
