import * as core from '@actions/core'
import {getOctokit} from '@actions/github'

interface GetPullRequestDetailsOptions {
  pullRequestNumber?: number
  token: string
  owner: string
  repo: string
}

interface GetPullRequestDetailsResults {
  sha: string
}

export const getPullRequestDetails = async ({
  pullRequestNumber,
  token,
  owner,
  repo
}: GetPullRequestDetailsOptions): Promise<GetPullRequestDetailsResults | null> => {
  if (!pullRequestNumber) return null
  const octokit = getOctokit(token)

  try {
    const result = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullRequestNumber
    })

    return {sha: result.data.head.sha}
  } catch (error) {
    core.info('could not get pull request data')
    return null
  }
}
