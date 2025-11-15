"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronRight, MoreVertical, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppHeaderProps {
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function AppHeader({ title = "QE Agents Dashboard", breadcrumbs }: AppHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-4 z-50 mx-auto mb-8">
      <div className="rounded-full border border-white/40 bg-white shadow-lg backdrop-blur-md mx-4">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="w-[100px] h-[40px] relative top-2">
              <Image
                src="/Sapient-Slingshot-Logo-RGB-FullColor.svg"
                alt="Slingshot Logo"
                width={100}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Divider */}
          <div className="h-8 w-px bg-white/40" />

          {/* Navigation / Breadcrumbs */}
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-2">
              {/* QE Agents Icon and Text */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-[#00ebad]">
                  <Code2 className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-bold text-black">QE Agents</h3>
              </div>

              {/* Current Page / Breadcrumb */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="text-black/70 hover:text-black transition-colors truncate font-normal"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="font-normal text-black truncate">{crumb.label}</span>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <span className="text-black">/</span>
                      )}
                    </div>
                  ))}
                </nav>
              )}
            </div>
          </div>
          </div>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
