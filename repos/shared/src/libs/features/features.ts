import type { Repo, TFeatureFileModel } from '@GSH/types'

import path from 'path'
import { glob } from 'glob'
import { readFile } from 'node:fs/promises'
import { limbo } from '@keg-hub/jsutils/limbo'
import { featuresParser } from './featuresParser'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { getPathFromBase } from '@gobletqa/goblet'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'
import { ApiLogger as Logger } from '@gobletqa/logger'
import { buildFileModel } from '@GSH/models/buildFileModel'

/**
 * TODO: Move this to the Parkin Lib
 * Should run while the feature AST is being parsed
 * Maps feature.scenario.steps to existing step definitions
 * Step definitions should be pre-registered with parkin
 * @param {Object} fileModel - Model the feature file to have it's steps mapped
 *
 * @returns {Object} - FileModel of the feature file
 */
export const mapStepsToDefinitions = (repo, fileModel) => {
  fileModel.ast && 
    fileModel.ast.map(feature => {
      feature.scenarios &&
        feature.scenarios.map(scenario => {
          scenario.steps &&
            scenario.steps.map(step => {
              const match = repo.parkin.steps.match(step.step, step, { worldReplace: false })
              match &&
                match.definition &&
                (step.definition = match.definition.uuid)
            })
        })
    })
  
  return fileModel
} 

/**
 * Builds the file model for a feature file
 * @param {Object} ast - Parkin parsed version of a feature file
 * @param {string} content - The content of the feature file
 * @param {string} location - Location of the file on the file system
 * @param {Object} repo - Git Repo object the file is apart of
 *
 * @returns {Object} - FileModel of the feature file
 */
const buildFeatureFileModel = async (repo, ast, content, location) => {
  const fileModel = await buildFileModel({
    ast,
    content,
    location,
    fileType: 'feature',
  }, repo)

  return mapStepsToDefinitions(repo, fileModel)
}

/**
 * Loads a feature from the passed in fullPath argument
 * @param {string} location - Location of the file on the file system
 * @param {Object} repo - Git Repo object the file is apart of
 *
 * @returns {Object} - FileModel of the feature file
 */
export const loadFeature = async (repo:Repo, location:string) => {
  const [__, content] = await limbo(readFile(location, { encoding: `utf8` }))

  return await buildFeatureFileModel(
    repo,
    repo.parkin.parse.feature(content, repo.world,  { worldReplace: false }),
    content,
    location,
  )
}

/**
 * Loads feature files base on the passed in features directory
 * @function
 * @private
 * @param {string} featuresDir - Location where feature files can be found
 *
 * @returns {Promise<Array<string>>} - Found feature file paths
 */
const loadFeatureFiles = (featuresDir:string) => {
  return glob(path.join(featuresDir, '**/*.feature'), {})
}

/**
 * Makes call to parse feature files, and convert them into Parkin feature AST objects
 * @function
 * @private
 * @param {Array<string>} featureFiles - feature file paths
 * @param {string} featuresDir - Path to the features test directory
 *
 * @returns {Promise<Array<string>>} - Group of parsed feature file AST Objects including their location
 */
const parseFeatures = (repo:Repo, featureFiles:string[], featuresDir:string) => {
  return featureFiles.reduce(async (toResolve, file) => {
    const loaded = await toResolve
    if (!file) return loaded

    const [err, feature = noOpObj] = await limbo(
      featuresParser({
        location: file,
        relative: file.replace(`${featuresDir}/`, ''),
      }, repo)
    )

    if(err){
      Logger.warn(`[Error Feature] Parse File Path => ${Logger.colors.white(file)}`)
      Logger.error(err.stack)
    }

    const featLoaded = Boolean(feature && feature.location)
    const [modelErr, fileModel] = featLoaded
      ? await limbo(buildFeatureFileModel(
          repo,
          feature.ast,
          feature.content,
          feature.location,
        ))
      : noPropArr

    if(modelErr){
      Logger.warn(`[Error Feature] Build File Model => ${Logger.colors.white(file)}`)
      Logger.error(modelErr.stack)
    }

    fileModel && loaded.push(fileModel)

    return loaded
  }, Promise.resolve([] as TFeatureFileModel[]))
}

/**
 * Loads features files from the file system as File Model objects
 * Then maps the passed in definitions to the Feature steps
 * @function
 * @export
 * @param {Object} config - Goblet Config object
 *
 * @returns {Promise<Array<string>>} - Group of parsed feature files as FileModel objects
 */
export const loadFeatures = async (repo:Repo) => {
  const { featuresDir, repoRoot } = repo.paths
  if (!featuresDir || !repoRoot)
    throw new Error(
      `Goblet config featuresDir and repoRoot must be defined. Found: 
        - featuresDir=${featuresDir}
        - repoRoot=${repoRoot}
      `
    )

  const pathToFeatures = getPathFromBase(featuresDir, repo) as string
  const featureFiles = featuresDir && (await loadFeatureFiles(pathToFeatures)) as string[]

  return await parseFeatures(repo, featureFiles, pathToFeatures)
}
