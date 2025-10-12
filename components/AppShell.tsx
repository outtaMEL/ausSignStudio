'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ChevronDown } from 'lucide-react'

const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-xl text-sm ${
        active ? 'bg-emerald-700 text-white' : 'hover:bg-zinc-100'
      }`}
    >
      {label}
    </Link>
  )
}

const LibraryDropdown = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isActive = pathname?.startsWith('/library')

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1 ${
          isActive ? 'bg-emerald-700 text-white' : 'hover:bg-zinc-100'
        }`}
      >
        Library
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-40 z-50">
          <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
            <Link
              href="/library/board"
              className="block px-4 py-2.5 text-sm hover:bg-zinc-50"
            >
              Board Templates
            </Link>
            <Link
              href="/library/element"
              className="block px-4 py-2.5 text-sm hover:bg-zinc-50 border-t"
            >
              Elements
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Don't show nav for auth pages
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>
  }
  
  const isProfileActive = pathname === '/profile'
  
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">
            AU Direction Sign Studio
          </Link>
          <nav className="flex items-center gap-2">
            <NavItem href="/" label="Start" />
            <LibraryDropdown />
            <Link
              href="/profile"
              className={`p-2 rounded-xl ${
                isProfileActive ? 'bg-emerald-700 text-white' : 'hover:bg-zinc-100'
              }`}
              title="Profile"
            >
              <User className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

