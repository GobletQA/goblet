import type { SocketManager } from '../manager/manager'
import type {
  TFilterObj,
  TFilterArgs,
  TCmdMessage,
  TProcConfig,
  TCmdExecOpts,
  TCmdExecEvents,
  TSocketMessageObj,
} from '@GSC/types'
import { WSEventTypes } from '../../../constants'
import {
  get,
  exists,
  noOpObj,
  noPropArr,
  isEmptyColl,
} from '@keg-hub/jsutils'

const CWD_REGEX = /^(\-\-)?(location|loc|workdir|cwd)\s/

/**
 * Checks if a message should be filtered out, and not sent to the frontend
 * @function
 * @public
 */
export const shouldFilterMessage = (args:TFilterArgs) => {
  const {
    filters = noOpObj as TFilterObj,
    data,
    group,
    cmd,
    commands = noOpObj
  } = args

  if (!exists(data) || data === '') return true

  const toFilter = [
    ...(filters && (filters.all || noPropArr)),
    ...get(filters, [group], noPropArr),
    ...get(filters, [cmd], noPropArr),
    ...get(commands, [ group, cmd, 'filters' ], noPropArr),
  ]

  return toFilter.reduce(
    (shouldFilter, filter) =>
      shouldFilter || new RegExp(filter, 'gi').test(data),
    false
  )
}

export type TAddResp = [
  string,
  string[],
  TCmdExecOpts,
  TCmdExecEvents,
  string
]

/**
 * Adds the process instance config options to the command
 * @function
 * @public
 */
export const addConfig = (
  cmd:string,
  message:TCmdMessage,
  config:TProcConfig = noOpObj as TProcConfig,
  events:Record<string, any> = noOpObj as Record<string, any>
):TAddResp => {
  const {
    afterArgs = noPropArr,
    beforeArgs = noPropArr,
    params = noPropArr,
  } = message

  // Add the before and after args to the params
  const joinedParams = beforeArgs.concat(params.concat(afterArgs))

  const defCmd = get(config, 'command.default', '/bin/bash')
  const cmdOverrides = get(config, 'command.overrides', noPropArr)

  // Set the default root or the process working directory for cwd (current working directory)
  let cwd = get(config, 'root', process.cwd())

  // Search the params to see if there's a location/cwd argument
  // That should be the actual working directory
  joinedParams.map(param => {
    // Set the current working directory when a param matches
    CWD_REGEX.test(param.trim()) && (cwd = param.match(CWD_REGEX)[3].trim())
  })

  // If the command is in the overrides
  // That means we should call it directly,
  // So just return the array with cmd and params
  // The config command, and script are bypassed
  if (cmdOverrides.includes(cmd))
    return [
      cmd,
      joinedParams,
      config.exec,
      events,
      cwd
    ]

  // Add the cmd as the first argument to the script
  const cmdAndParams = [ cmd, ...joinedParams ]

  // Add the default script to be run
  config.script && cmdAndParams.unshift(config.script)

  // Returns an array with the default command, and updated params
  return [
    defCmd,
    cmdAndParams,
    config.exec,
    events,
    cwd
  ]
}

/**
 * Logs a message when an invalid command is attempting to be run
 * @function
 */
export const onInvalidCmd = (
  message:TSocketMessageObj,
  manager:SocketManager
) => {
  const {
    name,
    cmd,
    id,
    params,
    group
  } = message

  // Log the invalid command attempt
  console.error('---------- Invalid command ----------')
  console.error(`group: ${group}`)
  console.error(`name: ${name}`)
  console.error(`cmd: ${cmd}`)
  console.error(`id: ${id}`)
  console.error(`params: ${params.join(' ')}`)
  console.error('---------- Invalid command ----------')

  // Update manager, and emit a command failed event
  manager.isRunning = false
  manager.emitAll(WSEventTypes.CMD_FAIL, {
    name,
    error: true,
    isRunning: manager.isRunning,
    message: 'Failed to run command!',
  })

  // Return an empty object
  return noOpObj as TCmdMessage
}

/**
 * Validates the a command is allowed to be run
 * @function
 * @public
 */
export const validateCmd = (
  message:TSocketMessageObj,
  commands:Record<string, any>,
  manager:SocketManager,
) => {
  // If the allowedCmds array is not set, or it's empty, then ALLOW ALL COMMANDS
  // Which means we default to allow any command to be run
  if (!exists(commands) || isEmptyColl(commands)) return message as TCmdMessage

  const { name, cmd, id, group } = message

  // Find the command from the group and name
  // The group and name are defined in the command.config as parent properties
  const command = get(commands, [ group, name ])

  // Check if the command is valid, and matches the id that was originally sent to the client
  // If valid merge with the message, to get access to props not sent by the client
  return !command || command.cmd.indexOf(cmd) !== 0 || !id || id !== command.id
    ? onInvalidCmd(message, manager)
    : { ...command, ...message } as TCmdMessage
}
