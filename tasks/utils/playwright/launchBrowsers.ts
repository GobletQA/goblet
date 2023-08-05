import type { TBrowserLaunchParams } from '../../types'
import { EGobletMode } from '../../types'
import { launchBrowser } from './launchBrowser'
import { runSeq, noOpObj } from '@keg-hub/jsutils'
import { getBrowsers } from '@gobletqa/browser/utils/getBrowsers'



/**
 *
 * @param {Object} launchParams - params for launching, including sharedOptions.js values
 */
export const launchBrowsers = (
  launchParams:TBrowserLaunchParams,
  gobletMode:EGobletMode
) => {
  if (gobletMode === EGobletMode.vnc) return noOpObj

  const { headless, log, ...browserParams } = launchParams
  const browsers = getBrowsers(browserParams)

  // launch each browser in a series
  const output = runSeq(
    browsers.map(
      browser => () =>
        launchBrowser({
          ...browserParams,
          type: browser,
          headless,
          log,
        })
    )
  )

  return {
    output,
    browsers,
  }
}


