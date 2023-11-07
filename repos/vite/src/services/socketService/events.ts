import type { SocketService } from './socketService'
import type {
  TSocketEvt,
  TBrowserNavEvt,
  TIdleConnection,
  TPWConsoleMsgEvt,
  TBrowserIsLoadedEvent,
} from '@types'

import * as socketActions from '@actions/socket/local'
import { camelCase, checkCall } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { playEvent } from '@actions/socket/local/playEvent'
import { parsePlayLogs } from '@actions/runner/parsePlayLogs'
import { recordAction } from '@actions/socket/local/recordAction'
import { setBrowserRecording } from '@actions/socket/local/setBrowserRecording'
import {clearEditorDecorations} from '@actions/runner/clearEditorDecorations'
import {
  BrowserNavEvt,
  WSAutomateEvent,
  SCIdleConnectionsEvt,
  SetBrowserIsLoadedEvent,
} from '@constants'

type TPlayerCancelEvent = TSocketEvt & {
  location:string
}

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
  idleStatus: function(message:TSocketEvt<TIdleConnection>) {
    EE.emit<TIdleConnection>(SCIdleConnectionsEvt, message.data)
  },
  browserStatus: function (message:TSocketEvt){
    console.log(`------- browser status -------`)
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
  pwBrowserRestarted: function (message:TSocketEvt){
    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: true })
  },
  pwUrlChange: function(message:TSocketEvt<TBrowserNavEvt>){
    const data = message.data
    EE.emit(BrowserNavEvt, data)
  },
  pwAutomateEvent: function(message:TSocketEvt){
    EE.emit(WSAutomateEvent, message.data)
  },
  pwConsole: function(message:TSocketEvt<TPWConsoleMsgEvt>){
    parsePlayLogs(message)
  },
  playCanceled: function(message:TPlayerCancelEvent){
    clearEditorDecorations(message.location)
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
  playSuiteDoneRoot: playEvent,
  playSuiteStartRoot: playEvent,
  testRunDone: function (message:TSocketEvt){
    
  },
  testRunCanceled: function (message:TSocketEvt){
    
  },
  testRunError: function (message:TSocketEvt){
    
  },
}
