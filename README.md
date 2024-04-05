# Match Comment Phrase

Github action to match a phrase within a github comment and outputs a boolean value when found by a specific mode

## Example usage

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
      - uses: lwhiteley/match-comment-phrase-action@v2.0.0
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

Notes:

- The provided reactions must be one of the valid reactions here: https://developer.github.com/v3/reactions/#reaction-types
- If you specify reactions, you have to provide the `GITHUB_TOKEN` env variable.
- By default, this action ignores phrases found in code blocks so actions are not triggered unintentionally

## Modes

| Output         | Description                                         |
| -------------- | --------------------------------------------------- |
| starts_line    | Checks if phrase starts any line of the comment     |
| starts_comment | Checks if phrase is at the beginning of the comment |
| within         | Checks if phrase is anywhere within the comment     |

## Inputs

| Input        | Required?                      | Description                                                                                                                         |
| ------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| phrase       | Yes                            | the phrase to look for in the issue comment. eg '/preview'                                                                          |
| mode         | No <br/>default: 'starts_line' | the mode is how the action checks for the phrase within the comment. possible values: starts_line, starts_comment, within           |
| include_code | No <br/>default: 'false'       | boolean to determine if the action should also search in code blocks or simple code snippets. Only practical with the "within" mode |
| own_line     | No <br/>default: 'false'       | boolean to determine if phrase is only matched if it occupies its own line. Applicable modes: "starts_line", "starts_comment"       |
| reactions    | No <br/> default: ''           | Comma separated list of valid reactions to add to the comment if phrase is found. For example, "rocket".                            |

## Outputs

| Output        | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| match_found   | Boolean string depending on if the phrase was found. Possible values: true or false |
| comment_body  | The comment body.                                                                   |
| comment_line  | The comment line where the first valid match of the phrase is found                 |
| issue_number  | the associated issue or pull request number.                                        |
| sha           | the associated head sha of pull request.                                            |
| issue_creator | the creator of the issue.                                                           |
| issue_actor   | the user that commented. Defaults to issue creator if not found                     |

## Similar actions:

- https://github.com/machine-learning-apps/actions-chatops
- https://github.com/Khan/pull-request-comment-trigger
