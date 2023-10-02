import type { TStartRecording } from '@GBB/types'

import { GBrowser } from '../browser/browser'
import { Recorder }  from '../recorder/recorder'

/**
 * Execute an action on a browser
 */
export const recordBrowser = async (data:TStartRecording) => {
  const {
    id,
    action,
    onCleanup,
    browserConf,
    pwComponents,
    onRecordEvent,
  } = data

  const { props, action:method } = action

  const [recordOpts, url] = props
  const browserItems = pwComponents || await GBrowser.start({ browserConf })

  const recorder = Recorder.getInstance(id, {
    onCleanup,
    ...browserItems,
    options: recordOpts,
    onEvent: onRecordEvent,
  })

  return await recorder.start({ url })
}
