import { TTaskActionArgs, TTasks, TTask } from '../../types'

import { isObj, isFunc } from '@keg-hub/jsutils'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'

/**
 * Injects the goblet.config into a tasks arguments
 * @param {function} taskAction - Function called when a task is run
 *
 * @return {function} - Function to inject the goblet config
 */
const injectGobletConfig = taskAction => {
  return (args:TTaskActionArgs) => {
    args?.params?.env !== process.env.NODE_ENV
      && (process.env.NODE_ENV = args?.params?.env)

    const {base, warn, local} = args.params
    return taskAction({
      ...args,
      goblet: getGobletConfig({base, warn, local}),
    })
  }
}

/**
 * Loops the goblet custom tasks, and injects the goblet.config as an argument
 * @param {Object} tasks - Task definitions to inject the goblet.config into
 *
 * @return {Object} - tasks with the goblet.config injected
 */
export const initialize = (tasks:TTasks):TTasks => {
  Object.entries(tasks)
    .forEach(([key, task]:[string, TTask]) => {
      task.action = isFunc(task.action) ? injectGobletConfig(task.action) : undefined
      task.tasks = isObj(task.tasks) ? initialize(task.tasks) : undefined
    })

  return tasks
}
