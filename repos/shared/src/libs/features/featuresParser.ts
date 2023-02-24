import type { Repo } from '@GSH/repo/repo'

import fs from 'fs'
import { noOpObj } from '@keg-hub/jsutils'
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
    fs.readFile(location, (err, data) => {
      if (err) return rej(err)
      const content = data.toString()

      const ast = parkin.parse.feature(content)
      return res({
        ...featureMeta,
        content,
        ast
      })
    })
  })
}
