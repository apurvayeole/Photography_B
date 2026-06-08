

import type { SocialLink } from '@/types'

interface SocialLinksProps {
  links: SocialLink[]
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 justify-center sm:justify-start">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline-offset-4 hover:underline transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
