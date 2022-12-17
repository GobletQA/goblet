import type { TTask, TTaskActionArgs } from '../../types'

import path from 'path'
import { repos } from '../../paths'

const restartAction = async (args:TTaskActionArgs) => {
  const { runSCTask } = require(path.join(repos.screencast, `tasks`))
  await runSCTask(`restart`, args.params)
  // Force exit the process, because the browser server causes it to hang 
  process.exit(0)
}

export const restart:TTask = {
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