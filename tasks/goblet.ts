import './utils/envs/setNodeEnv'

import path from 'path'
import { appRoot } from './paths'
import { createRequire } from 'module'
import { setLogs } from '@keg-hub/jsutils'
import tasksConfig from '../configs/tasks.config'
import { setContexts } from './utils/helpers/contexts'
import { setAppRoot, runTask } from '@keg-hub/cli-utils'
import { registerAliases } from '../configs/aliases.config'

process.env.TASKS_DEBUG && setLogs(true, `log`, `[Goblet]`)
const requireTasks = createRequire(path.join(appRoot, 'tasks/definitions'))


;(async () => {
  registerAliases()
  setAppRoot(appRoot)
  setContexts(tasksConfig.apps)

  requireTasks('./utils/task/sharedOptions.ts')
  const { default:tasks } = requireTasks('./definitions/goblet.ts')

  await runTask(tasks, { env: process.env.NODE_ENV || `local` })
})()

