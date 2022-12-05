import type { TGitData, TFileModel } from '@types'

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
}

const buildOptions = ({ params, cmd, file, appUrl }:TBuildOpts, repo:TGitData) => {
  return {
    repo,
    // Add extra browser config if needed
    // browser: {},
    ref: 'page',
    action: {
      props: [
        {
          cmd,
          params,
          file: pickKeys<Partial<TFileModel>>(
            file,
            [`fileType`, `location`, `uuid`, `name`, `content`]
          )
          
        },
        appUrl
      ],
      action: WSRecordActions.start
    }
  }
}

/**
 * Uses a web-socket to run tests on a file from the backend
 * Also updates the current active test file, which is different from the file per-screen
 * @function
 *
 */
export const runTests = async (
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
  const params = buildCmdParams({ file, cmd })
  const appUrl = getWorldVal({ loc: `url`, fb: `app.url`})

  const options = buildOptions(
    {
      file,
      appUrl,
      params,
      cmd,
    },
    pickKeys<TGitData>(
      repo?.git,
      [`local`, `remote`, `username`, `branch`, `name`]
    )
  )

  WSService.emit(SocketMsgTypes.BROWSER_RUN_TESTS, options)
}
