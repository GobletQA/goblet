import type { TGitData, TFileModel, TStartPlaying, TBrowserActionOptions } from '@types'

import { addToast } from '@actions/toasts'
import { pickKeys } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { getRepoData } from '@utils/store/getStoreData'
import { clearSpecs } from '@actions/tracker/clearSpecs'
import { SocketMsgTypes, WSRecordActions } from '@constants'
import { buildCmdParams } from '@utils/browser/buildCmdParams'

type TBuildOpts = {
  appUrl:string
  cmd:string,
  params:string[],
  file:TFileModel,
  options:Record<string, any>
}

type TBrowserPlay = Omit<TStartPlaying, `repo`|`id`|`onEvent`|`browserConf`|`onCleanup`> & {
  repo:TGitData
}

const buildOptions = ({ options, params, cmd, file, appUrl }:TBuildOpts, repo:TGitData) => {
  return {
    repo,
    ref: 'page',
    action: {
      props: [
        {
          cmd,
          params,
          playOptions: options,
          file: pickKeys<Partial<TFileModel>>(
            file,
            [`fileType`, `location`, `uuid`, `name`, `content`]
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
  cmd:string,
) => {
  addToast({
    type: `info`,
    message: `Running ${cmd} tests for file ${file.name}!`,
  })

  // Clear any existing tracker specs
  clearSpecs()

  const repo = getRepoData()
  const { params, options } = buildCmdParams({ file, cmd })
  const appUrl = getWorldVal({loc: `url`, fb: `app.url`})

  const opts = buildOptions(
    {
      cmd,
      file,
      appUrl,
      params,
      options
    },
    pickKeys<TGitData>(
      repo?.git,
      [`local`, `remote`, `username`, `branch`, `name`]
    )
  )

  WSService.emit(SocketMsgTypes.BROWSER_PLAY, opts)
}
