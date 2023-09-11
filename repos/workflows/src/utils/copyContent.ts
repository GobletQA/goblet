import { promises as fs } from 'fs'
import { throwErr } from './throwErr'
import { wait } from '@keg-hub/jsutils/wait'
import { limbo } from '@keg-hub/jsutils/limbo'

/**
 * May be better to switch to the cmd line option instead
 * the fs.cp is experimental, and is slower
 */
// import { exec } from 'node:child_process'
// const resp = exec(`cp -R ${src}/* ${dest}`)

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
  const [err, resp] = await limbo(fs.cp(src, dest, { recursive: true }))

  // Sometimes the file-system takes a second to finish the copy
  // Technically it should be done, be we wait an extra second just incase
  await wait(2000)

  return err ? throwErr(err) : true
}
