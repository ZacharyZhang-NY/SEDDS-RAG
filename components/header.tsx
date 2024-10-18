import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import Image from "next/image";
import {siteConfig} from "@/siteConfig";
import {auth} from "@/auth";
import {getUser, getUserRole} from "@/app/login/actions";
import {usePathname} from "next/navigation";

import logo from '@/public/icon.png'


async function UserOrLogin() {
  const session = (await auth()) as Session
  const role = await getUserRole(session?.user?.id)

  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/" rel="nofollow">
          <Image src={logo} alt='icon' width={24} />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} role={role} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/login">登录</Link>
          </Button>
        )}
      </div>
    </>
  )
}

export async function Header() {
  const session = (await auth()) as Session

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {session?.user && (
          <Link href='/' className='flex flex-row gap-0.5 items-center'>
          <Image src={logo} alt='icon' width={24} />
          <span className="hidden ml-2 md:flex font-medium text-neutral-900">{siteConfig.title}</span>
          </Link>
        )}
        {/* <a*/}
        {/*  href="https://vercel.com/templates/Next.js/nextjs-ai-chatbot"*/}
        {/*  target="_blank"*/}
        {/*  className={cn(buttonVariants())}*/}
        {/*>*/}
        {/*  <IconVercel className="mr-2" />*/}
        {/*  <span className="hidden sm:block">Deploy to Vercel</span>*/}
        {/*  <span className="sm:hidden">Deploy</span>*/}
        {/*</a> */}
      </div>
    </header>
  )
}
