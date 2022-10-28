import {Mode} from './common-types'

interface MatchPhraseOptions {
  comment: string
  phrase: string
  mode: Mode
  isCodeIncluded: boolean
  isOwnLineEnabled?: boolean
}
interface MatchPhraseResult {
  matchFound: boolean
  commentLine?: string
}

export function maskCodeSnippets(comment: string): string {
  const mask = '******'

  return comment
    .trim()
    .replace(/(```.+?```)/gms, mask) // mask code blocks first
    .replace(/(`.+?`)/gms, mask)
}

export function matchPhrase({
  comment: originalComment = '',
  phrase,
  mode = 'starts_line',
  isCodeIncluded = false,
  isOwnLineEnabled = false
}: MatchPhraseOptions): MatchPhraseResult {
  const sanitizedComment = originalComment.trim()
  if (!sanitizedComment || !phrase) return {matchFound: false}

  const comment = isCodeIncluded
    ? sanitizedComment
    : maskCodeSnippets(sanitizedComment)
  const commentLines: string[] = comment.split('\n').filter(Boolean)

  switch (mode) {
    /**
     * Checks if phrase starts any line of the comment
     */
    case 'starts_line': {
      const commentLine =
        commentLines.find(line =>
          isOwnLineEnabled
            ? line.trim() === phrase
            : line.trim().startsWith(phrase)
        ) || ''

      return {
        matchFound: !!commentLine,
        commentLine: commentLine.trim()
      }
    }

    /**
     * Checks if phrase is at the beginning of the comment
     */
    case 'starts_comment': {
      const [firstLine] = commentLines
      const matchFound = isOwnLineEnabled
        ? firstLine.trim() === phrase
        : firstLine.startsWith(phrase)
      return {
        matchFound,
        commentLine: matchFound ? firstLine.trim() : ''
      }
    }

    /**
     * Checks if phrase is anywhere within the comment
     */
    case 'within': {
      const commentLine = commentLines.find(line => line.includes(phrase)) || ''

      return {
        matchFound: !!commentLine,
        commentLine: commentLine.trim()
      }
    }

    default: {
      return {matchFound: false}
    }
  }
}
