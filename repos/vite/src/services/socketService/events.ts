import type { TSocketEvt } from '@types'
import type { SocketService } from './socketService'

import * as socketActions from '@actions/socket/local'
import { camelCase, checkCall } from '@keg-hub/jsutils'
import { recordAction } from '@actions/socket/local/recordAction'
import { setBrowserRecording } from '@actions/socket/local/setBrowserRecording'


/**
 * Callback event functions bound to the SocketService
 * Each property function is called when a socket event happens through Sockr
 * @type Object
 * @private
 */
export const events = {
  all: function (
    message:TSocketEvt,
    instance:SocketService,
    event:string
  ) {
    if (!event) return

    // Get the name of the action from sockr's Event Types
    // And convert into an action name for the taps sockr actions
    const actionName = camelCase((event.split(':')[1] || '').toLowerCase())

    checkCall(socketActions[actionName as keyof typeof socketActions], message, `some-extra`)
  },
  init: function (message:TSocketEvt){
    console.log(`------- init event -------`)
    console.log(message)
  },
  connect: function (message:TSocketEvt){
    console.log(`------- connect event -------`)
    console.log(message)
  },
  browserStatus: function (message:TSocketEvt){
    
  },
  recordStarted: function(message:TSocketEvt){
    setBrowserRecording(message)
  },
  recordAction: function(message:TSocketEvt){
    recordAction(message)
  },
  recordEnded: function(message:TSocketEvt){
    setBrowserRecording(message)
  },
  recordGeneral: function(message:TSocketEvt){
    console.log(`------- recordGeneral -------`)
    console.log(message)
  },
}
