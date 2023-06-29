import { throwErr } from './throwErr'
import { limbo, wait } from '@keg-hub/jsutils'
import { runCmd } from '@keg-hub/cli-utils'
import { TLimboCmdResp } from '@gobletqa/workflows/types'

type TCopyArgs = {
  src:string
  dest:string
}

/**
 * Copies content from one location to another
 * @param {string} src - Source location to copy from
 * @param {string} dest - Final location to copy to
 *
 * @returns {boolean} - True if the copy method does not throw
 */
export const copyContent = async ({ src, dest }:TCopyArgs) => {
  const [err, { error }] = await limbo(
    runCmd('cp', ['-R', src, dest], { exec: true })
  ) as TLimboCmdResp

  // Sometimes the file-system takes a second to finish the copy
  // Technically it should be done, be we wait an extra second just incase
  await wait(2000)

  return err || error ? throwErr(err || new Error(error)) : true
}
