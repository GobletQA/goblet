import type { TFileModel } from '@types'

import { addToast } from '@actions/toasts'
import { WSRecordActions } from '@constants'
import { WSService } from '@services/socketService'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { clearSpecs } from '@actions/tracker/clearSpecs'
import { buildCmdParams } from '@utils/browser/buildCmdParams'

type TBuildOpts = {
  appUrl:string
  cmd:string,
  params:string[],
  file:TFileModel,
}

const buildOptions = ({ params, cmd, file, appUrl }:TBuildOpts) => {
  return {
    ref: 'page',
    action: {
      props: [
        {
          params,
          testCmd: cmd,
          activeFile: file,
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

  const appUrl = getWorldVal({ loc: `url`, fb: `app.url`})
  const params = buildCmdParams({ file, cmd })

  const options = buildOptions({
    file,
    appUrl,
    params,
    cmd,
  })

  WSService.runCommand(cmd, params)
  // WSService.emit(SocketMsgTypes.BROWSER_RUN_TESTS, options)
}
