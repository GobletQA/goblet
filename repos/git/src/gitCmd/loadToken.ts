import path from 'path'
import { Logger } from '@gobletqa/logger'
import { fileSys } from '@keg-hub/cli-utils'
const { readFileSync, pathExistsSync } = fileSys

let gitToken
const devEnvs = ['development', 'develop', 'local', 'test']

type TTokenArgs = {
  token?: string|boolean
}

export const loadTestToken = ():string|boolean => {
  const tokenFile = path.join(__dirname, `../../__mocks__/.token`)
  try {
    const exists = pathExistsSync(tokenFile)
    if (!exists) return

    const token = readFileSync(tokenFile)
    if (!token.trim()) throw new Error(`Missing token in ${tokenFile}`)

    gitToken = token.trim()
    process.env.GOBLET_GIT_TOKEN = gitToken

    return process.env.GOBLET_GIT_TOKEN
  }
  catch (err) {
    Logger.error(`[ ERROR ] Could not load git token file`)
    Logger.log(err.message)

    Logger.info(`\nWhen running in a dev environment`)
    Logger.pair(`Please create a file at`, tokenFile)
    Logger.log(`It must contain only a valid git token for the test repo\n`)
  }
}

/**
 * Loads a git token in development environments
 * If a token is found it will be loaded in to process.env.GOBLET_GIT_TOKEN and returned
 */
export const loadToken = ({ token }:TTokenArgs):string|boolean => {
  // If a token is passed, then set it
  if (token) gitToken = token

  // If gitToken is set, set the env and return
  if (gitToken) {
    !process.env.GOBLET_GIT_TOKEN && (process.env.GOBLET_GIT_TOKEN = gitToken)

    return gitToken
  }

  if (process.env.GOBLET_GIT_TOKEN)
    return (gitToken = process.env.GOBLET_GIT_TOKEN)

  if (!devEnvs.includes(process.env.NODE_ENV)) return

  return loadTestToken()
}

