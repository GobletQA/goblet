import type { TGitData } from '@gobletqa/git'

import path from 'path'
import { existsSync } from 'fs'
import { Logger } from '@gobletqa/logger'
import { copyContent } from './copyContent'
import { wait } from '@keg-hub/jsutils/wait'
import { aliases } from '@gobletqa/configs/aliases.config'
import { replaceGobletConfigRef, configFromFolder } from '@gobletqa/goblet'


const copyTemplateContent = async (gitData:TGitData, template:string) => {
  Logger.info(`Creating goblet setup from template...`)

  const local = gitData.local
  const src = template || path.join(aliases[`@GWF`], `templates/repo`)

  return await copyContent({ src, dest: local })
    .then(() => replaceGobletConfigRef(gitData))
    .then(() => true)
    .catch(err => {
      Logger.error(`Creating goblet from template failed`)
      Logger.log(err)
      return false
    })
}

const checkGobletExists = (gitData:TGitData) => {
  Logger.info(`Searching for goblet config...`)
  const config = configFromFolder(gitData.local, { remote: gitData.remote, clearCache: true })

  if(!config){
    Logger.log(`Failed to find config with gitData`, gitData)

    return false
  }

  Logger.info(`Found existing goblet config at ${config?.location}`, config)

  return true

}

const checkGobletFolder = (gitData:TGitData) => existsSync(path.join(gitData.local, `goblet`))

/**
 * Copies the goblet template files into the mounted repo
 * First checks if a goblet.config exists
 * If it does, the template copy is bypassed
 * Then checks if goblet folder exists in the repo
 * If it does, we wait 2 seconds and look for a goblet config again
 * After the second check fails, then we try to copy the goblet template over
 */
export const copyTemplate = async (gitData:TGitData, template:string, reCheck:boolean=true) => {
  const gobletConfig = checkGobletExists(gitData)
  if(gobletConfig) return true

  if(!checkGobletFolder(gitData) || reCheck === false)
    return await copyTemplateContent(gitData, template)

  // Has a goblet folder in the repo, but a goblet config could not be found?
  // Could be that the files are not accessible on the HD, so try again in two seconds
  Logger.info(`Goblet folder found, but config missing. Retrying check in 3 seconds...`)
  await wait(3000)

  return await copyTemplate(gitData, template, false)
}
