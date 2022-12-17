import type { TTask, TTaskActionArgs } from '../../types'

import path from 'path'
import { repos } from '../../paths'

const startAction = async (args:TTaskActionArgs) => {
  const { runSCTask } = require(path.join(repos.screencast, `tasks`))
  const procs = await runSCTask(`start`, args.params)
  process.exit(0)
  
}

export const start:TTask = {
  name: `start`,
  alias: [`rs`],
  action: startAction,
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