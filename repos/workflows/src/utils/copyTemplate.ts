import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { copyContent } from './copyContent'
import { aliases } from '@GConfigs/aliases.config'

// TODO: Figure out how to load this from shared repo. May need to more to diff location
// Maybe create a gobletConfig repo - Dedicating to loading the config
import { configFromFolder } from '@gobletqa/shared/goblet'

/**
 * Copies the goblet template files into the mounted repo
 * First checks if a goblet.config exists
 * If it does, the template copy is bypassed
 *
 */
export const copyTemplate = async (local:string, template:string) => {
  Logger.info(`Searching for goblet config...`)
  
  // TODO: This is the first time a goblet config would be loaded
  // May want to set it to the GOBLET_CONFIG cache in getGobletConfig
  // To ensure it loads this config, loaded from the mounted repo
  const gobletConfig = await configFromFolder(local)

  if (gobletConfig){
    Logger.info(`Found existing goblet config at ${local}`)
    console.log(gobletConfig)
    return true
  }

  Logger.info(`Creating goblet setup from template...`)
  const src = template || path.join(aliases[`@GWF`], `templates/repo/*`)

  return await copyContent({ src, dest: local })
    .then(() => true)
    .catch(err => {
      Logger.error(`Creating goblet from template failed`)
      Logger.log(err.stack)
      return false
    })
}
