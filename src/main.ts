import * as core from '@actions/core'
import {addReactions} from './add-reactions'
import {context} from '@actions/github'
import {getInputs} from './get-inputs'
import {matchPhrase} from './match-phrase'

async function run(): Promise<void> {
  try {
    const {reactions, githubToken, isPrOnly, phrase, mode, isCodeIncluded} =
      getInputs()

    if (reactions && !githubToken) {
      core.setFailed('If "reactions" is supplied, GITHUB_TOKEN is required')
      return
    }

    const {payload} = context
    const comment = payload?.comment?.body || payload?.review?.body || ''
    const commentId = payload?.comment?.id || payload?.review?.id

    const pullRequestNumber = context.payload?.pull_request?.number

    if (isPrOnly && !pullRequestNumber) {
      core.setFailed('No pull request in current context.')
      return
    }

    const {matchFound} = matchPhrase({
      comment,
      phrase,
      mode,
      isCodeIncluded
    })

    core.setOutput('match_found', matchFound)
    core.setOutput('comment_body', comment)
    core.setOutput('pull_request_number', pullRequestNumber)

    if (!matchFound || !reactions) return

    await addReactions({commentId, reactions, token: githubToken})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
