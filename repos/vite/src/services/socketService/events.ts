import type { TSocketEvt } from '@types'
import type { SocketService } from './socketService'

import * as socketActions from '@actions/socket/local'
import { camelCase, checkCall } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { playEvent } from '@actions/socket/local/playEvent'
import { recordAction } from '@actions/socket/local/recordAction'
import { SelectFromBrowserRespEvt, BrowserNavEvt } from '@constants'
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
    if(events[actionName as keyof typeof events]) return

    checkCall(socketActions[actionName as keyof typeof socketActions], message)
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
  pwAutomateSelectElement: function(message:TSocketEvt){
    EE.emit(SelectFromBrowserRespEvt, message.data)
  },
  playEnded: playEvent,
  playError: playEvent,
  playAction: playEvent,
  playGeneral: playEvent,
  playResults: playEvent,
  playStarted: playEvent,
  playSpecDone: playEvent,
  playSuiteDone: playEvent,
  playSpecStart: playEvent,
  playSuiteStart: playEvent,
}
