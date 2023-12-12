// TODO: should add a Promise timeout here to avoid memory leaks
// Has to be very long, could be based on the global timeout option from Exam / Parkin
import type { TProm } from '@utils/promise/promiseAbort'
import type {
  TOffCB,
  TRepoApiObj,
  TFileModel,
  TStartPlaying,
  TPlayerResEvent,
  TBrowserStateEvt,
  TStartBrowserPlayOpts
} from '@types'

import { EBrowserState } from '@types'
import { addToast } from '@actions/toasts'
import { EE } from '@services/sharedService'
import { WSService } from '@services/socketService'
import { pickKeys, emptyObj } from '@keg-hub/jsutils'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { getRepoData } from '@utils/store/getStoreData'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import { SocketMsgTypes, WSRecordActions } from '@constants'
import { buildCmdParams } from '@utils/browser/buildCmdParams'
import { filterFileContext } from '@utils/files/filterFileContext'
import {
  BrowserStateEvt,
  PlayerStartedEvent,
  PlayerFinishedEvent,
  WSCancelPlayerEvent,
} from '@constants'


type TBuildOpts = {
  appUrl:string
  params:string[],
  file:TFileModel,
  forwardLogs?:boolean
  options:Record<string, any>
}

type TBrowserPlay = Omit<TStartPlaying, `repo`|`id`|`onEvent`|`browserConf`|`onCleanup`> & {
  repo:TRepoApiObj
}

const buildOptions = (
  { options, params, file, appUrl, forwardLogs }:TBuildOpts,
  repo:TRepoApiObj
) => {
  return {
    repo,
    ref: `page`,
    forwardLogs,
    action: {
      props: [
        {
          params,
          playOptions: options,
          file: pickKeys<Partial<TFileModel>>(
            file,
            [`fileType`, `location`, `uuid`, `name`, `content`, `ast`]
          )
        },
        appUrl
      ],
      action: WSRecordActions.start
    }
  } as TBrowserPlay
}


/**
 * Uses a web-socket to run tests on a file from the backend
 * Also updates the current active test file, which is different from the file per-screen
 * @function
 *
 */
export const startBrowserPlay = async (
  file:TFileModel,
  startOpts:TStartBrowserPlayOpts=emptyObj
) => {
  addToast({
    type: `info`,
    message: `Running tests for file ${file.name}!`,
  })

  const repo = getRepoData()
  const { params, options, forwardLogs } = buildCmdParams({ file })
  const appUrl = getWorldVal({loc: `url`, fb: `app.url`})

  const model = await filterFileContext(file, startOpts)

  const opts = buildOptions(
    {
      appUrl,
      params,
      options,
      file: model,
      forwardLogs,
    },
    pickKeys<TRepoApiObj>(
      repo?.git,
      [`local`, `remote`, `username`, `branch`, `name`]
    )
  )

  WSService.emit(SocketMsgTypes.BROWSER_PLAY, opts)
  EE.emit(PlayerStartedEvent, {})

  let promise:TProm<any>|undefined = PromiseAbort((res, rej) => {

    // Then listen for the response event fired from the websocket service
    let onPlayerEnd:TOffCB

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    let cancelOff = EE.on(
      WSCancelPlayerEvent,
      () => {
        
        // Turn off the on player end listener
        onPlayerEnd?.()

        // Send event to cancel on the backend
        WSService.emit(SocketMsgTypes.CANCEL_AUTOMATE, { player: true })

        // Sent event to cancel on the frontend
        EE.emit<TBrowserStateEvt>(BrowserStateEvt, {browserState: EBrowserState.idle})

        // Finally stop listening, cancel and reject
        cancelOff?.()
        promise?.cancel?.()
        promise = undefined
        cancelOff = undefined
        rej?.(emptyObj)
      }
    )
    
    onPlayerEnd = EE.on<TPlayerResEvent>(PlayerFinishedEvent, () => {
      onPlayerEnd?.()
      cancelOff?.()
      promise = undefined
      cancelOff = undefined
      onPlayerEnd = undefined
      res?.(emptyObj)
    })
  })

}
