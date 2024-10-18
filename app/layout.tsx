import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { GeistSans } from "geist/font/sans"
import { useStore } from "@/store";
import {auth} from "@/auth";
import 'remixicon/fonts/remixicon.css'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Next.js AI Chatbot`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        'font-sans antialiased',
        GeistSans.className
      )}
    >
    <Toaster position="top-center" />
    <Providers
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      //@ts-expect-error
      session={session}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
      </div>
      <TailwindIndicator />
    </Providers>
    </body>
    </html>
  )
}
