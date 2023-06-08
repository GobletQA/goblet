import type { TFeatureAst } from '@ltipton/parkin'
import type { TGitData, TFileModel, TStartPlaying, TPlayerResEvent } from '@types'



import { EBrowserState } from '@types'
import { addToast } from '@actions/toasts'
import { WSService } from '@services/socketService'
import { pickKeys, emptyObj } from '@keg-hub/jsutils'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { getRepoData } from '@utils/store/getStoreData'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { SocketMsgTypes, WSRecordActions } from '@constants'
import { buildCmdParams } from '@utils/browser/buildCmdParams'
import { EEditorMode, SimpleScenarioTag } from '@gobletqa/race'
import { PromiseAbort } from '@gobletqa/shared/utils/promiseAbort'
import {
  BrowserStateEvt,
  PlayerEndedEvent,
  WSCancelPlayerEvent,
} from '@constants'
import {getEditorSettings} from '@utils/editor/getEditorSettings'


type TBuildOpts = {
  appUrl:string
  params:string[],
  file:TFileModel,
  options:Record<string, any>
}

type TBrowserPlay = Omit<TStartPlaying, `repo`|`id`|`onEvent`|`browserConf`|`onCleanup`> & {
  repo:TGitData
}

const buildOptions = ({ options, params, file, appUrl }:TBuildOpts, repo:TGitData) => {
  return {
    repo,
    ref: 'page',
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


const findSimpleTag = (feature:TFeatureAst) => {
  return feature.scenarios.find(scenario => scenario?.tags?.tokens?.includes(SimpleScenarioTag))
}

const fileModelContext = async (file:TFileModel) => {
  if(file?.fileType !== `feature`) return file

  const { settings } = await getEditorSettings()
  if(!settings || settings?.mode !== EEditorMode.simple || !file?.ast?.[0])
    return file
  
  const feat = file?.ast?.[0]
  const scenario = findSimpleTag(feat)
  
  return {
    ...file,
    ast: [{
      ...feat,
      rules: [],
      background: undefined,
      scenarios: [scenario]
    }]
  }
}

/**
 * Uses a web-socket to run tests on a file from the backend
 * Also updates the current active test file, which is different from the file per-screen
 * @function
 *
 */
export const startBrowserPlay = async (file:TFileModel) => {
  addToast({
    type: `info`,
    message: `Running tests for file ${file.name}!`,
  })

  const repo = getRepoData()
  const { params, options } = buildCmdParams({ file })
  const appUrl = getWorldVal({loc: `url`, fb: `app.url`})

  const model = await fileModelContext(file)

  const opts = buildOptions(
    {
      appUrl,
      params,
      options,
      file: model,
    },
    pickKeys<TGitData>(
      repo?.git,
      [`local`, `remote`, `username`, `branch`, `name`]
    )
  )

  const promise = PromiseAbort((res, rej) => {
    WSService.emit(SocketMsgTypes.BROWSER_PLAY, opts)

    // Then listen for the response event fired from the websocket service
    const onPlayerEnd = EE.on<TPlayerResEvent>(PlayerEndedEvent, () => res(emptyObj))

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    const cancelOff = EE.on(
      WSCancelPlayerEvent,
      () => {
        // Turn off the select listener above
        onPlayerEnd?.()
        // Send event to cancel on the backend
        WSService.emit(SocketMsgTypes.CANCEL_AUTOMATE, { player: true })

        // Sent event to cancel on the frontend
        EE.emit(BrowserStateEvt, {browserState: EBrowserState.idle})

        // Finally stop listening, cancel and reject
        cancelOff?.()
        promise.cancel()
        rej(emptyObj)
      }
    )
  })

}
