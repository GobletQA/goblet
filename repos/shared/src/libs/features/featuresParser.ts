import type { Repo } from '@GSH/repo/repo'

import fs from 'fs'
import { noOpObj } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { getParkinInstance } from '@GSH/libs/parkin'

export type TFeatureMeta = {
  location:string
  relative:string
}

/**
 * Parses the a feature file located at the passed in featureMeta.location
 * @function
 *
 */
export const featuresParser = (featureMeta:TFeatureMeta = noOpObj as TFeatureMeta, repo:Repo) => {
  const { location } = featureMeta

  const parkin = repo?.parkin || getParkinInstance(repo)

  return new Promise((res, rej) => {
    try {
      fs.readFile(location, (err, data) => {
        if (err) return rej(err)
        const content = data.toString()

        // TODO: Add a proper logger for shared / screencast
        // Logger.pair(`Parsing feature at`, location)

        try {
          // Pass in an empty world object so the values are not replaced
          // We only want to replace values during execution
          const ast = parkin.parse.feature(content, parkin.world, { worldReplace: false })
          return res({
            ...featureMeta,
            content,
            ast
          })
        }
        catch(err:unknown){
          // TODO: Update Parkin to allow feature parsing with Error handling
          rej(err)
        }
      })
    }
    catch(err:unknown){
      rej(err)
    }
  })
}
