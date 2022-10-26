# match-comment-phrase-action

## Example usage in a workflow

Your workflow needs to listen to the following events:

```yml
on:
  issue_comment:
    types: [created, edited]
```

And then you can use the action in your jobs like this:

```yml
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: smart-host/match-comment-phrase-action@v1.1.0
        id: check
        env:
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
        with:
          phrase: '/preview'
          reactions: eyes
          mode: starts_line
      - run: 'echo Found it!'
        if: steps.check.outputs.match_found == 'true'
```

Reactions must be one of the reactions here: https://developer.github.com/v3/reactions/#reaction-types
And if you specify a reaction, you have to provide the `GITHUB_TOKEN` env variable.

## Modes

| Output         | Description                                         |
| -------------- | --------------------------------------------------- |
| starts_line    | Checks if phrase starts any line of the comment     |
| starts_comment | Checks if phrase is at the beginning of the comment |
| within         | Checks if phrase is anywhere within the comment     |

## Inputs

| Input        | Required?                      | Description                                                                                                                                  |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| phrase       | Yes                            | the phrase to look for in the issue comment. eg '/preview'                                                                                   |
| mode         | No <br/>default: 'starts_line' | the mode is how the action checks for the phrase within the comment. possible values: starts_line, starts_comment, within                    |
| include_code | No <br/>default: 'false'       | boolean to determine if the action should also search in code blocks or simple code snippets. Only practical with the "within" mode snippets |
| pr_only      | No <br/>default 'false'        | 'When "true", limits action to run for pull requests only. Will throw error if pull request context is not found'                            |
| reactions    | No <br/> default ''            | Comma separated list of valid reactions to add to the comment if phrase is found. For example, "rocket".                                     |

## Outputs

| Output       | Description                                             |
| ------------ | ------------------------------------------------------- |
| match_found  | 'true' or 'false' depending on if the phrase was found. |
| comment_body | The comment body.                                       |
