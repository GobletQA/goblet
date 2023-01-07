import type { TSocketEvt } from '@types'
import type { SocketService } from './socketService'

import { BrowserNavEvt } from '@constants'
import { pageService } from '../pageService'
import * as socketActions from '@actions/socket/local'
import { camelCase, checkCall } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
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
    const actionName = camelCase((event.split(':')[1] || '').toLowerCase()) as string

    !events[actionName as keyof typeof events]
      && checkCall(socketActions[actionName as keyof typeof socketActions], message)
  },
  init: function (message:TSocketEvt){
    // console.log(`------- init event -------`)
    // console.log(message)
  },
  connect: function (message:TSocketEvt){
    // console.log(`------- connect event -------`)
    // console.log(message)
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
  pwUrlChange: function(message:TSocketEvt){
    EE.emit(BrowserNavEvt, message.data)
  },
  playStarted: function(message:TSocketEvt){
    console.log(`------- playStarted message -------`)
    console.log(message)
  },
  playEnded: function(message:TSocketEvt){
    console.log(`------- playEnded message -------`)
    console.log(message)
  },
  playResults: function(message:TSocketEvt){
    console.log(`------- playResults message -------`)
    console.log(message)
  },
  playError: function(message:TSocketEvt){
    console.log(`------- playError message -------`)
    console.log(message)
  },
  playAction: function(message:TSocketEvt){
    console.log(`------- playAction message -------`)
    console.log(message)
  },
  playGeneral: function(message:TSocketEvt){
    console.log(`------- playGeneral message -------`)
    console.log(message)
  },
  playSpecStart: function(message:TSocketEvt){
    console.log(`------- playSpecStart message -------`)
    console.log(message)
  },
  playSpecDone: function(message:TSocketEvt){
    console.log(`------- playSpecDone message -------`)
    console.log(message)
  },
  playSuiteStart: function(message:TSocketEvt){
    console.log(`------- PlaySuiteStart message -------`)
    console.log(message)
  },
  playSuiteDone: function(message:TSocketEvt){
    console.log(`------- playSuiteDone message -------`)
    console.log(message)
  },
}
