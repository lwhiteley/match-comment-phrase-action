import * as core from '@actions/core'
import {addReactions} from './add-reactions'
import {context} from '@actions/github'
import {getInputs} from './get-inputs'
import {matchPhrase} from './match-phrase'
import {getPullRequestDetails} from './get-pull-request-details'

async function run(): Promise<void> {
  try {
    const {
      reactions,
      githubToken,
      phrase,
      mode,
      isCodeIncluded,
      isOwnLineEnabled
    } = getInputs()

    if (reactions && !githubToken) {
      core.setFailed('If "reactions" is supplied, GITHUB_TOKEN is required')
      return
    }

    const {payload} = context
    const comment = payload?.comment?.body || payload?.review?.body || ''
    const commentId = payload?.comment?.id || payload?.review?.id

    const pullRequestNumber = payload?.pull_request?.number || payload?.number
    const issueNumber = pullRequestNumber || payload?.issue?.number

    const {matchFound, commentLine} = matchPhrase({
      comment,
      phrase,
      mode,
      isCodeIncluded,
      isOwnLineEnabled
    })

    const pullRequestInfo = await getPullRequestDetails({
      token: githubToken,
      pullRequestNumber: issueNumber,
      owner: payload?.repository?.owner?.login || '',
      repo: payload?.repository?.name || ''
    })

    const issueCreator =
      payload?.pull_request?.user?.login || payload?.user?.login
    const issueActor =
      payload?.comment?.user?.login || payload?.review?.user?.login

    core.setOutput('match_found', matchFound)
    core.setOutput('comment_body', comment)
    core.setOutput('comment_line', commentLine)
    core.setOutput('issue_number', issueNumber)
    core.setOutput('sha', pullRequestInfo?.sha)
    core.setOutput('issue_actor', issueActor || issueCreator)
    core.setOutput('issue_creator', issueCreator)

    if (!matchFound || !reactions) return

    await addReactions({commentId, reactions, token: githubToken})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
