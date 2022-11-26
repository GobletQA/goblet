import type { TFileModel } from '@types'

import { getStore } from '@store'
import { addToast } from '@actions/toasts'
import { WSRecordActions } from '@constants'
import { WSService } from '@services/socketService'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { clearSpecs } from '@actions/tracker/clearSpecs'
import { buildCmdParams } from '@utils/browser/buildCmdParams'


type TBuildOpts = {
  appUrl:string
  testCmd:string,
  params:string[],
  activeFile:TFileModel,
}

const buildOptions = ({ params, testCmd, activeFile, appUrl }:TBuildOpts) => {
  return {
    ref: 'page',
    action: {
      props: [
        {
          params,
          testCmd,
          activeFile,
        },
        appUrl
      ],
      action: WSRecordActions.start
    }
  }
}


/**
 * Uses a web-socket to run tests on a file from the backend
 * Also updates the current active test file, which is different from the activeFile per-screen
 * @function
 *
 */
export const runTests = async (
  activeFile:TFileModel,
  testCmd:string,
) => {
  addToast({
    type: 'info',
    message: `Running ${testCmd} tests for file ${activeFile.name}!`,
  })
  
  // Clear any existing tracker specs
  clearSpecs()

  const state = getStore()?.getState()
  const appUrl = getWorldVal({ loc: `url`, fb: `app.url`})

  const params = buildCmdParams({
    state,
    cmd: testCmd,
    fileModel: activeFile,
  })

  const options = buildOptions({
    appUrl,
    params,
    testCmd,
    activeFile,
  })

  WSService.runCommand(testCmd, params)
  // WSService.emit(SocketMsgTypes.BROWSER_RUN_TESTS, options)
}
