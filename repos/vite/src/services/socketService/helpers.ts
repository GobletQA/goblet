import type { SocketService } from './socketService'
import type {
  TSockCmd,
  TSockCmds,
  TSocketEvt,
  TSockCmdObj,
  TEndpointConf,
  TSocketService
} from '@types'

import {
  get,
  isArr,
  isObj,
  noOpObj,
  camelCase,
  checkCall,
} from '@keg-hub/jsutils'


/**
 * Builds the websocket endpoint to connect to the backend websocket
 * @function
 * @private
 *
 * @param {Object} config - Websocket client config object matching the config spec
 *
 * @returns {string} - Built websocket endpoint
 */
export const buildEndpoint = (config:TEndpointConf) => {
  if (config.endpoint) return config.endpoint

  // Use the same http protocol as what the current window is using
  const win = typeof window === 'undefined' ? {} : window
  const protocol = get(win, 'location.protocol', 'https:')

  const namespace = !config.namespace
    ? ``
    : config.namespace.startsWith(`/`)
      ? config.namespace
      : `/${config.namespace}`

  return config.port
    ? `${protocol}//${config.host}:${config.port}${namespace}`.trim()
    : `${config.host}${namespace}`.trim()
}

/**
 * Calls the passed in actions with the received message and SocketService class instance
 * @function
 * @private
 *
 * @param {function} action - Method to be called relative to the event type
 * @param {Object} message - Data received from the websocket
 * @param {Object} instance - SocketService class instance
 * @param {string} event - Type of socket event receive
 *
 * @returns {*} Response from the action method
 */
const checkCallEvent = (
  action:(...args:any[]) => any,
  message:TSocketEvt,
  instance:SocketService,
  event:string,
) => {
  return checkCall(action, message, instance, event)
}

/**
 * Calls internal and custom actions with the received message and SocketService class instance
 * @function
 * @private
 *
 * @param {Object} instance - SocketService class instance
 * @param {string} event - Type of socket event receive
 * @param {function} action - Method to be called relative to the event type
 * @param {Object} message - Data received from the websocket
 *
 * @returns {void}
 */
export const callAction = (
  instance:SocketService,
  event:string
) => {
  const eventName = camelCase((event.split(':')[1] || '').toLowerCase())

  return (data:string, ...args:any[]) => {
    if (!eventName) return instance.logData(`Invalid event name!`, event)

    // Parse the data from string to object
    const message = data && JSON.parse(data) || noOpObj as TSocketEvt

    // Log the event for debugging
    instance.logEvent(event, message)

    // Look for the init event, and pull out the commands from it
    // Init should only happen when we connect to the socket
    eventName === 'init' && (instance.commands = get(message, 'data.commands'))
    // Call the custom action if it exists
    const customEvent = get(instance.config, `events.${eventName}`)
    customEvent && checkCallEvent(customEvent, message, instance, event)

    // Call the all action if it exists
    // Is called for all websocket events that happen on the frontend
    const allEvent = get(instance.config, `events.all`)
    allEvent && checkCallEvent(allEvent, message, instance, event)
  }
}

/**
 * Find the command from the commands ID
 * Searches through all loaded command, looking for a matching id
 * Otherwise returns false
 * @function
 */
export const getCommand = (
  commands:TSockCmds,
  cmdOrName:TSockCmd
) => {
  const cmdName:string = isObj(cmdOrName) ? cmdOrName.name : cmdOrName
  return Object.entries(commands)
    .reduce((found, [ group, subCmds ]) => {
      return found
        ? found
        : Object.entries(subCmds)
          .reduce((subFound, [ name, definition ]) => {
              return !subFound && isObj(definition) && definition.name === cmdName
                ? definition
                : subFound
            }, false as TSockCmdObj|false)

    }, false as TSockCmdObj|false)
}

export const getTransports = (config:TSocketService) => {
  const transports = isArr(config.transports)
    ? config.transports
    : []

  return transports.length ? transports : ['polling', 'websocket']
}
