import type { TGitData } from '@GWF/types'

import path from 'path'
import { Logger } from '@gobletqa/logger'
import { copyContent } from './copyContent'
import { aliases } from '@GConfigs/aliases.config'
import { replaceGobletConfigRef, configFromFolder } from '@gobletqa/goblet'


/**
 * Copies the goblet template files into the mounted repo
 * First checks if a goblet.config exists
 * If it does, the template copy is bypassed
 */
export const copyTemplate = async (gitData:TGitData, template:string) => {
  Logger.info(`Searching for goblet config...`)

  const local = gitData.local
  const gobletConfig = configFromFolder(local, { remote: gitData.remote })

  if (gobletConfig){
    Logger.info(`Found existing goblet config at ${local}`)
    console.log(gobletConfig)
    return true
  }

  Logger.info(`Creating goblet setup from template...`)
  const src = template || path.join(aliases[`@GWF`], `templates/repo/*`)

  return await copyContent({ src, dest: local })
    .then(() => replaceGobletConfigRef(gitData))
    .then(() => true)
    .catch(err => {
      Logger.error(`Creating goblet from template failed`)
      Logger.log(err.stack)
      return false
    })
}
