import type { Repo } from '@GSH/types'

import { readFile } from 'node:fs/promises'
import { limbo } from '@keg-hub/jsutils/limbo'
import { buildFileModel } from '@GFS/models/buildFileModel'

/**
 * Loads a feature from the passed in fullPath argument
 * @param {string} location - Location of the file on the file system
 * @param {Object} repo - Git Repo object the file is apart of
 *
 * @returns {Object} - FileModel of the feature file
 */
export const loadFeature = async (repo:Repo, location:string) => {
  const [__, content] = await limbo(readFile(location, { encoding: `utf8` }))

  return await buildFileModel({
    ast: repo.parkin.parse.feature(content, repo.world,  { worldReplace: false }),
    content,
    location,
    fileType: `feature`,
  }, repo)
}