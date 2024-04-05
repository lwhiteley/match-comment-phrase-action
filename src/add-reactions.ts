import {context, getOctokit} from '@actions/github'

// See https://docs.github.com/en/rest/reactions#reaction-types
export const REACTIONS = [
  '+1',
  '-1',
  'laugh',
  'confused',
  'heart',
  'hooray',
  'rocket',
  'eyes'
] as const
export type Reaction = (typeof REACTIONS)[number]

interface AddReactionsOptions {
  commentId: number
  reactions: string
  token: string
}

export async function addReactions({
  commentId,
  reactions,
  token
}: AddReactionsOptions): Promise<void> {
  const octokit = getOctokit(token)
  const validReactions = reactions
    .replace(/\s/g, '')
    .split(',')
    .filter(reaction => REACTIONS.includes(reaction as Reaction)) as Reaction[]

  await Promise.allSettled(
    validReactions.map(async content => {
      await octokit.rest.reactions.createForIssueComment({
        ...context.repo,
        comment_id: commentId,
        content
      })
    })
  )
}
