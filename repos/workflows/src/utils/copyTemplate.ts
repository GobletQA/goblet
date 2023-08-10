import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { copyContent } from './copyContent'
import { configFromFolder } from '@gobletqa/goblet'
import { aliases } from '@GConfigs/aliases.config'

/**
 * Copies the goblet template files into the mounted repo
 * First checks if a goblet.config exists
 * If it does, the template copy is bypassed
 */
export const copyTemplate = async (local:string, template:string) => {
  Logger.info(`Searching for goblet config...`)

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
