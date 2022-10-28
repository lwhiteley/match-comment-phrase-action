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
  creator: string
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

    const creator = result.data.user?.login || ''
    const {sha} = result.data.head

    return {sha, creator}
  } catch (error) {
    core.info('could not get pull request data')
    return null
  }
}
