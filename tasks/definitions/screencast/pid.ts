import type { TTask, TTaskActionArgs } from '../../types'

import path from 'path'
import { repos } from '../../paths'

const pidAction = async (args:TTaskActionArgs) => {
  const { runSCTask } = require(path.join(repos.screencast, `tasks`))
  await runSCTask(`pid`, args.params)
  process.exit(0)
}

export const pid:TTask = {
  name: `pid`,
  alias: [`pi`],
  action: pidAction,
  options: {
    context: {
      default: `all`,
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