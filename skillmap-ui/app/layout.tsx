import type { ReactNode } from "react"
import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"

import { AuthProvider } from "@/components/auth-provider"

import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SkillMap — Build Your Career Roadmap",
  description:
    "Plan, track, and refine the path to your next role. Build a personal roadmap of skills, certifications, and weekly goals.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        {/* {process.env.NODE_ENV === "production" && <Analytics />} */}
      </body>
    </html>
  )
}
