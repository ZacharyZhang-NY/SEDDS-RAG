import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import { siteConfig } from "@/siteConfig";

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          {siteConfig.welcomeTitle}
        </h1>
        <p className="leading-normal text-muted-foreground">
          {siteConfig.welcomeDescription}
        </p>
        <p className="leading-normal text-muted-foreground">
          回答由 AI 检索学校官方文件后生成，请以{' '}
          <ExternalLink href={siteConfig.schoolDocLink}>
            {siteConfig.schoolDocName}
          </ExternalLink>{' '}
          等文件为准。
        </p>
      </div>
    </div>
  )
}
