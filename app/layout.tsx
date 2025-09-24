import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TelcoX - Plataforma de Autogestión",
  description:
    "Gestiona tus servicios de telecomunicaciones de forma intuitiva. Consulta tu consumo de datos, minutos, SMS y facturación en tiempo real.",
  generator: "TelcoX Platform",
  keywords: ["telecomunicaciones", "autogestión", "consumo datos", "facturación", "BSS"],
  authors: [{ name: "TelcoX Development Team" }],
  creator: "TelcoX",
  publisher: "TelcoX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://telcox-platform.vercel.app"),
  openGraph: {
    title: "TelcoX - Plataforma de Autogestión",
    description: "Gestiona tus servicios de telecomunicaciones de forma intuitiva",
    url: "https://telcox-platform.vercel.app",
    siteName: "TelcoX",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TelcoX - Plataforma de Autogestión",
    description: "Gestiona tus servicios de telecomunicaciones de forma intuitiva",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
