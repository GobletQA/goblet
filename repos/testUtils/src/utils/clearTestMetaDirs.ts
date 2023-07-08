import fs from 'fs'
import path from 'path'
import { noOp } from '@keg-hub/jsutils'
import { Logger } from '@gobletqa/shared/libs/logger'
import { getDefaultGobletConfig } from '@gobletqa/shared/goblet/getDefaultGobletConfig'

/**
 * Clears out the temp folder that contains test artifacts
 */
export const clearTestMetaDirs = () => {
  Logger.log(`Clearing temp folder...`)
  
  const { internalPaths } = getDefaultGobletConfig()
  const tempDir = path.join(internalPaths.gobletRoot, `temp`)

  Object.entries(internalPaths)
    .map(([name, loc]:[string, string]) => {
      if(!loc) return

      try {
        if(name === `testMetaFile`) return fs.unlinkSync(loc)

        name.endsWith(`TempDir`) &&
          loc.startsWith(tempDir) &&
          fs.rm(loc, { recursive: true }, noOp)
      }
      catch(err){
        Logger.log(`Error cleaning temp dir, skipping!`)
        Logger.log(err.message)
      }

    })
}
