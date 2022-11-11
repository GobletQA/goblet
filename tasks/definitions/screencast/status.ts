import type { TTaskParams } from '../../types'

import path from 'path'
import { repos } from '../../paths'

const statusAction = async (args:TTaskParams) => {
  const { runSCTask } = require(path.join(repos.screencast, `tasks`))
  await runSCTask(`status`, args.params)
}

export const status = {
  name: `status`,
  alias: [`stat`, `sts`],
  action: statusAction,
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