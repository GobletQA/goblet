import type { TTaskParams } from '../../types'

import path from 'path'
import { repos } from '../../paths'

const stopAction = async (args:TTaskParams) => {
  const { runSCTask } = require(path.join(repos.screencast, `tasks`))
  await runSCTask(`stop`, args.params)
  process.exit(0)
}

export const stop = {
  name: `stop`,
  alias: [`rs`],
  action: stopAction,
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