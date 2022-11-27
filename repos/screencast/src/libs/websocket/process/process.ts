import type { Socket } from 'socket.io'
import type { SocketManager } from '../manager/manager'
import type {
  TCmdMessage,
  TFilterObj,
  TProcConfig,
  TCmdsConfig,
  TSocketMessage,
  TSocketMessageObj
} from '@GSC/types'

import path from 'path'
import { exec } from './exec'
import appRootPath from 'app-root-path'
import { deepMerge, noOpObj, isStr } from '@keg-hub/jsutils'
import { shouldFilterMessage, validateCmd, addConfig } from './helpers'
import {
  WS_RUN_CMD,
  WS_CMD_OUT,
  WS_CMD_ERR,
  WS_CMD_END,
  WS_CMD_FAIL,
  WS_CMD_RUNNING,
} from '@gobletqa/shared/constants/websocket'

const appRoot = appRootPath.path
const socketRoot = path.join(__dirname, `../../../`)

/**
 * Class for managing child process run from a socket connection
 * Captures the child process output, and forwards them to the connected sockets
 * @class
 * @public
 */
export class Process {
  config:TProcConfig = {
    command: {
      default: '/bin/bash',
      overrides: [],
    },
    exec: {
      shell: '/bin/bash',
    },
    root: appRoot,
    script: path.join(socketRoot, `./scripts/exec.sh`),
    debug: false,
  }

  commands:TCmdsConfig
  filters:TFilterObj
  manager:SocketManager

  constructor(
    Manager:SocketManager,
    commands?:TCmdsConfig,
    filters?:TFilterObj,
    config?:TProcConfig
  ) {
    this.manager = Manager
    this.commands = commands || noOpObj as TCmdsConfig
    this.filters = filters || noOpObj as TFilterObj
    this.config = deepMerge(this.config, config)
  }

  /**
   * Logs an error to the terminal when debug is true
   */
  debugError = (
    err:Error = noOpObj as Error,
    message?:TSocketMessage
  ) => {
    this.config.debug
      && console.error(`[Socket Error] ${err.message}`, message)
  }

  /**
   * Logs an event to the terminal when debug is true
   */
  debugEvent = (
    event:string,
    message?:TSocketMessage
  ) => {
    this.config.debug && console.log(`[Socket Event] ${event}`, message)
  }

  /**
   * Helper to filter message sent from a child process
   * @memberof Process
   * @alias instance&period;filterMessage
   * @function
   */
  filterMessage = (
    data:string,
    cmd:string,
    group:string,
    name:string
  ):boolean => {
    return shouldFilterMessage({
      cmd,
      group,
      data: data.trim(),
      filters: this.filters,
      commands: this.commands,
    })
  }

  /**
   * Callback called when child process prints text to stdout
   * Calls manager.emitAll with standard out message from the child process
   * @memberof Process
   * @alias instance&period;stdOutEmit
   * @function
   * @public
   */
  stdOutEmit = (
    data:string,
    cmd:string,
    group:string,
    name:string,
    socketId:string
  ) => {
    if(this.filterMessage(data, cmd, group, name)) return

    const emitMessage = {
      name,
      group,
      socketId,
      message: data,
    }

    this.debugEvent(WS_CMD_OUT, emitMessage)
    this.manager.emitAll(WS_CMD_OUT, emitMessage)
  }

  /**
   * Callback called when child process prints text to stderr
   * Calls manager.emitAll with standard error message from the child process
   * @memberof Process
   * @alias instance&period;stdErrEmit
   * @function
   * @public
   */
  stdErrEmit = (
    data:string,
    cmd:string,
    group:string,
    name:string,
    socketId:string
  ) => {
    const emitMessage = {
      name,
      group,
      socketId,
      message: data,
    }

    this.debugEvent(WS_CMD_ERR, emitMessage)

    !this.filterMessage(data, cmd, group, name) &&
      this.manager.emitAll(WS_CMD_ERR, emitMessage)
  }

  /**
   * Callback called when child process exits
   * Calls the manager.emitAll with the exitCode
   * @memberof Process
   * @alias instance&period;onExitEmit
   * @function
   * @public
   */
  onExitEmit = (
    code:number,
    cmd:string,
    group:string,
    name:string,
    socketId:string
  ) => {
    this.manager.isRunning = false

    const emitMessage = {
      name,
      group,
      socketId,
      data: { exitCode: code },
    }

    this.debugEvent(WS_CMD_END, emitMessage)
    this.manager.emitAll(WS_CMD_END, emitMessage)
  }

  /**
   * Callback called when child process throws an error
   * Calls the manager.emitAll with the error message
   * @memberof Process
   * @alias instance&period;onErrorEmit
   * @function
   * @public
   */
  onErrorEmit = (
    _err:string|Error,
    cmd:string,
    group:string,
    name:string,
    socketId:string
  ) => {
    const err = isStr(_err) ? new Error(_err) : _err

    const message = err.message.indexOf('ENOENT') !== -1
        ? `[ SOCKET CMD ERROR ] - Command '${cmd}' does not exist!\n\nMessage:\n${err.message}`
        : `[ SOCKET CMD ERROR ] - Failed to run command!\n\nMessage:\n${err.message}`

    const emitMessage = {
      name,
      group,
      socketId,
      error: true,
      message: message,
    }

    this.debugError(err, emitMessage)

    if (this.filterMessage( err.message, cmd, group, name)) return

    this.manager.isRunning = false
    this.debugEvent(WS_CMD_FAIL, emitMessage)
    this.manager.emitAll(WS_CMD_FAIL, emitMessage)
  }

  /**
   * Builds the events for the child process, to allow capturing its output
   * @memberof Process
   * @alias instance&period;buildEvents
   * @function
   * @public
   */
  buildEvents = (
    cmd:string,
    params:string[],
    group:string,
    name:string,
    socketId:string
  ) => {
    return {
      onExit: (code:number) => this.onExitEmit(code, cmd, group, name, socketId),
      onStdOut: (data:string) => this.stdOutEmit(data, cmd, group, name, socketId),
      onStdErr: (data:string) => this.stdErrEmit(data, cmd, group, name, socketId),
      onError: (err:Error|string) => this.onErrorEmit(err, cmd, group, name, socketId),
    }
  }

  /**
   * Executes a command in a child process passed in from the message object
   * @memberof Process
   * @alias instance&period;exec
   * @function
   * @public
   */
  exec = (message:TCmdMessage) => {
    const { name, cmd, params, group, socketId } = message

    // Update the connected sockets, that a command is running
    this.manager.isRunning = true

    const emitMessage = {
      name,
      group,
      socketId,
      data: { cmd, params },
      message: 'Running command',
    }

    this.debugEvent(WS_CMD_RUNNING, emitMessage)
    this.manager.emitAll(WS_CMD_RUNNING, emitMessage)

    const cmdArr = addConfig(
      cmd,
      message,
      this.config,
      this.buildEvents(cmd, params, group, name, socketId)
    )

    exec(this.config, ...cmdArr)
  }

  /**
   * Binds a socket to RUN_CMD event, that calls the exec method
   * Validates the message passed from the client before executing
   * @memberof Process
   * @alias instance&period;bindSocket
   * @function
   * @public
   */
  bindSocket = (socket:Socket) => {
    socket.on(WS_RUN_CMD, (message:TSocketMessageObj) => {
      this.manager.checkAuth(socket, WS_RUN_CMD, message, () => {
        const socketId = socket.id

        this.debugEvent(WS_RUN_CMD, message)

        const { name, group } = message

        try {
          // Validate the cmd to ensure it is allowed to run
          const command = validateCmd(
            message,
            this.commands,
            this.manager
          )

          // Set the params to be the passed in params
          command.params = message.params

          // If a cmd and id is returned, then run the exec method
          return command.cmd && this.exec({ ...command, socketId })
        }
        catch (err) {
          this.debugError(err, message)
          this.manager.isRunning = false

          const emitMessage = {
            name,
            group,
            socketId,
            error: true,
            message: `Error running command:\n${err.message}`,
          }

          this.debugEvent(WS_RUN_CMD, emitMessage)

          this.manager.emitAll(WS_CMD_RUNNING, emitMessage)
        }
      })
    })
  }
}
