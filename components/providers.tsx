'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import {useStore} from "@/store";
import {useEffect} from "react";
import { Session } from "@/lib/types";

interface Providers extends ThemeProviderProps {
  session: Session | null
}

export function Providers({ children, session,  ...props }: Providers) {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider session={session}>
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
      </SessionProvider>
    </NextThemesProvider>
  )
}

export function SessionProvider({ children, session, ...props }: { children: React.ReactNode, session: Session | null }) {
  const { user } = useStore()
  useEffect(() => {
    user.setSession(session)
  }, []);

  return <>{children}</>
}