import type { TTask, TTaskParams, TTaskOption } from '../../types'

import constants from '../../constants'
import { exists } from '@keg-hub/jsutils'

const { envFilter } = constants

/**
 * Removes an ENV from the currently running process
 * @param {string} key - Name of the key to removed
 * 
 * @returns {void}
 */
const removeEnv = (key:string) => {
  process.env[key] = undefined
  delete process.env[key]
}

/**
 * Adds an env value to the current process if it does not already exist
 * @param {string} key - Name of the key to added
 * @param {*} val - Value to set for the key
 * 
 * @returns {void}
 */
const addEnv = (key:string, val:string|number|boolean) => {
  !exists(process.env[key]) && exists(val) && (process.env[key] = val as string)
}

/**
 * Loops through the current process.env Keys, and checks if they should be removed
 * Uses the envFilter constants defined in the tasks/constants folder
 * @returns {void}
 */
const filterRemove = () => {
  const {starts, contains, ends, exclude} = envFilter

  Object.keys(process.env).map(key => {
    if(exclude.includes(key)) return

    starts.map((start) => key.startsWith(start) && removeEnv(key))
    contains.map((contain) => key.includes(contain) && removeEnv(key))
    ends.map((ends) => key.endsWith(ends) && removeEnv(key))
  })
}

/**
 * Loops through the add Envs and check for a matching env in the params
 * If found, then adds it's value to the current process
 * @param {Object} params - Task options parsed as an object
 * @param {Object} task - Task meta data for the task being run
 *
 * @returns {void}
 */
const filterAdd = (params:TTaskParams, task:TTask) => {
  if(!params || !task || !task.options) return

  const { add } = envFilter

  Object.entries(task.options).map(([name, meta]:[string, TTaskOption]) => {
    meta &&
      meta.env &&
      add.includes(meta.env) &&
      exists(params[name]) &&
      addEnv(meta.env, params[name])
  })
}

/**
 * Filters ENVs by both adding and remove them based on defined constants
 * @returns {void}
 */
export const filterTaskEnvs = (params:TTaskParams, task:TTask) => {
  filterRemove()
  filterAdd(params, task)
}
