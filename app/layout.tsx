import type React from "react"
import type { Metadata } from "next"
// 1. REMOVE Manrope
// import { Manrope } from "next/font/google"
// 2. ADD Geist
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import "./globals.css"
// Import our new provider
import { GlobalStateProvider } from "@/contexts/GlobalStateProvider"

// 3. REMOVE Manrope variable
// const manrope = Manrope({ 
//   subsets: ["latin"],
//   variable: "--font-manrope",
// })

export const metadata: Metadata = {
  title: "QE Agents Dashboard",
  description: "Monitor and manage your quality engineering agents across teams",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 4. UPDATE className to use Geist
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* Wrap the children with the provider */}
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  )
}