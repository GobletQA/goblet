import type { TStepDef } from '@ltipton/parkin'
import type { Repo, TDefinitionFileModel } from '@GSH/types'

import fs from 'fs'
import { Logger } from '@GSH/libs/logger'
import { checkCall } from '@keg-hub/jsutils'
import { buildFileModel } from '@GSH/utils/buildFileModel'
import { parkinCheck } from '@GSH/libs/overrides/parkinOverride'
import { requireOverride } from '@GSH/libs/overrides/requireOverride'

export type TDefinitionAstLoaded = TStepDef & {
  location:string
  __isLoaded?:boolean
}

class DefinitionsParser {

  /**
   * Clears out any previously loaded step definitions from the repo.parkin instance
   * @param {Object} repo - Repo Class instance for the currently active repo
   */
  clear = (repo:Repo) => {
    repo.parkin.steps.clear()
  }

  /**
   * Loads and parses a step definition and based on the passed in filePath
   * Then creates a fileModel from it's content
   */
  getDefinitions = async (
    filePath:string,
    repo:Repo,
    overrideParkin:(...args:any[]) => any
  ) => {
    try {

      const { fileModel } = await this.parseDefinition(filePath, repo, overrideParkin)

      // The definitions get auto-loaded into the parkin instance
      // from the require call in the parseDefinition method below
      const definitions = repo.parkin.steps.list() as TDefinitionAstLoaded[]

      definitions.forEach(def => {
        // Check if the __isLoaded is set
        // If so, skip loading the definitions 
        if(def.__isLoaded) return

        // Validate if the step match string exists in the file
        // This is required because the parkin instance is reused
        // Which means all definitions already loaded exist in this list
        // const hasDef = fileModel.content.includes(`'${def.match.toString()}'`)
        //   || fileModel.content.includes(`"${def.match.toString()}"`)
        //   || fileModel.content.includes(`\`${def.match.toString()}\``)

        // If the file model contains the step def
        // And it's a valid match string
        // Then add the def to the fileModels ast.definitions array
          this.validateMatch(def.match, def.type)
          && fileModel.ast.definitions.push({
              ...def,
              // Add a reference back to the parent
              location: filePath,
            })

        // Tell the definitions it's already loaded
        // This is a hack to ensure it's not loaded more then once
        def.__isLoaded = true

      })

      return fileModel
    }
    catch(err){
      // TODO: @lance-tipton - temporary fix to catch errors in definition parsing
      // Should be a better way to handel these so we can notify the user of the issues
      Logger.warn(`[Error Definition] Parse File Path => ${filePath}`)
      Logger.error(err)
      Logger.empty()
      return false
    }
  }

  parseDefinition = (
    filePath:string,
    repo:Repo,
    overrideMethod:(...args:any[]) => any
  ):Promise<Record<'fileModel', TDefinitionFileModel>> => {
    return new Promise((res, rej) => {
      let requireError
      const requireReset = overrideMethod &&
        requireOverride(
          repo,
          parkinCheck,
          overrideMethod
        )

      try {
        // Always clear out the node require cache
        // This ensure we get a fresh file every time
        // Otherwise changed files would not get reloaded
        delete require.cache[filePath]

        // Require the file, to auto-load the definitions into parkin
        // Later we'll pull them from parkin)
        require(filePath)
      }
      catch (err) {
        Logger.warn(`[Error Definition] Require File Path => ${filePath}`)
        Logger.error(err.stack)
        Logger.empty()
        requireError = err.message
      }
      // Use finally to ensure the requireReset is always called even on error
      finally {
        checkCall(requireReset)
      }

      // Read the file to get it's content and build the fileModel
      fs.readFile(filePath, async (err, content) => {
        if (err) return rej(err)

        const fileModel = await buildFileModel(
          {
            location: filePath,
            // @ts-ignore
            error: requireError,
            content: content.toString(),
            fileType: 'definition',
            ast: { definitions: [] },
          },
          repo
        ) as TDefinitionFileModel

        return res({ fileModel })
      })
    })
  }

  validateMatch = (match, type) => {
    if (!match)
      return console.warn(
        `Found a ${type} definition that contains an empty match in the definition definition files!`
      )

    return match
  }
}

const definitionsParser = new DefinitionsParser()
export {
  definitionsParser as DefinitionsParser
}
