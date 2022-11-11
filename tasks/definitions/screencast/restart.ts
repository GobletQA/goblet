import type { TTaskParams } from '../../types'

import path from 'path'
import { repos } from '../../paths'

const restartAction = async (args:TTaskParams) => {
  const { runSCTask } = require(path.join(repos.screencast, `tasks`))
  await runSCTask(`restart`, args.params)
}

export const restart = {
  name: `restart`,
  alias: [`rs`],
  action: restartAction,
  options: {
    context: {
      alias: [`ctx`, `name`],
      example: `--context vnc`,
      description: `Context or name of the service`,
    },
    log: {
      type: `boolean`,
      description: `Log commands and their output`,
    },
  }
}