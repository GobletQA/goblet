import type { TTaskParams } from '../../types'
import fs from 'fs'
import path from 'path'
import { containerDir } from '../../paths'
// @ts-ignore
import { Logger } from '@keg-hub/cli-utils'

/**
 * Removes the devspace cache directory if it exists at `container/.devspace`
 */
export const removeCacheDir = ({ log }:TTaskParams) => {
  return new Promise((res, rej) => {
    log && Logger.info(`\nRemoving devspace cache folder...`)
    fs.rmSync(path.join(containerDir, '.devspace'), { recursive: true, force: true })
    res(true)
  })
}

