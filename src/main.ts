import * as core from '@actions/core'
import {addReactions} from './add-reactions'
import {context} from '@actions/github'
import {getInputs} from './get-inputs'
import {matchPhrase} from './match-phrase'

async function run(): Promise<void> {
  try {
    const {reactions, githubToken, phrase, mode, isCodeIncluded} = getInputs()

    if (reactions && !githubToken) {
      core.setFailed('If "reactions" is supplied, GITHUB_TOKEN is required')
      return
    }

    const {payload} = context
    const comment = payload?.comment?.body || payload?.review?.body || ''
    const commentId = payload?.comment?.id || payload?.review?.id

    const pullRequestNumber = payload?.pull_request?.number
    const issueNumber = pullRequestNumber || payload?.issue?.number

    const {matchFound} = matchPhrase({
      comment,
      phrase,
      mode,
      isCodeIncluded
    })

    core.setOutput('match_found', matchFound)
    core.setOutput('comment_body', comment)
    core.setOutput('issue_number', issueNumber)

    if (!matchFound || !reactions) return

    await addReactions({commentId, reactions, token: githubToken})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
