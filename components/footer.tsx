import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import {siteConfig} from "@/siteConfig";

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      {siteConfig.title} 基于{' '}
      <ExternalLink href="https://www.moonshot.cn/">
        Kimi AI
      </ExternalLink>
      构建，生成内容不代表官方立场。
    </p>
  )
}
