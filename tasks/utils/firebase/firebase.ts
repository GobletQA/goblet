import type { TContainerEnvs, TTaskParams } from '../../types'

import fs from 'fs'
import path from 'path'
import { loadEnvs } from '../envs/loadEnvs'
import { command } from '../process/command'
import { appRoot, frontendDir } from '../../paths'
import { ensureArr, noOpObj } from '@keg-hub/jsutils'

const emptyParams = noOpObj as TTaskParams

type TFBFunc<T=any> = (params:TTaskParams, envs?:TContainerEnvs) => Promise<T>
type TFBDeploy = TFBFunc & {
  hosting: TFBFunc
}

/**
 * Throws an error when token can not be found
 */
const missingToken = () => {
  throw new Error(`Missing firebase token env or file path, can not deploy`)
}

/**
 * Loads the firebase CI token from a file defined by env or param
 */
const loadFromFile = (params:TTaskParams, envs:TContainerEnvs) => {
  const tokenFile = params.tokenFile
    || process.env.FIREBASE_TOKEN_FILE
    || envs.FIREBASE_TOKEN_FILE

  return tokenFile ? fs.readFileSync(tokenFile).toString().trim() : ``
}

/**
 * Runs a firebase command and returns the output
 * Exits the process if the firebase command throws an error
 */
export const firebaseCmd = command('firebase')


export const firebase = async (
  cmd:string|string[],
  params:TTaskParams=emptyParams
) => {
  
  const cmdArgs = ensureArr(cmd)

  return await firebaseCmd(cmdArgs, params)
}

firebase.token = (async (
  params:TTaskParams,
  envs?:TContainerEnvs
) => {
  envs = envs || await loadEnvs({ env: params?.env })
  const token = params.token
    || process.env.FIREBASE_TOKEN
    || envs.FIREBASE_TOKEN
    || loadFromFile(params, envs)

  !token && missingToken()

  process.env.FIREBASE_TOKEN = token

  return token
}) as TFBFunc<string>

firebase.project = (async (
  params:TTaskParams,
  envs?:TContainerEnvs
) => {
  
  const { env } = params
  envs = envs || await loadEnvs({ env: params?.env })

  const project = params.project || envs.NODE_ENV || env
  const content = fs.readFileSync(path.join(appRoot, `.firebaserc`))
  const data = JSON.parse(content.toString())

  return data.projects[project]
    ?? envs.FIRE_BASE_PROJECT_ID
    ?? project
    ?? data.projects.default

}) as TFBFunc<string>

firebase.deploy = (async (
  params:TTaskParams,
  envs?:TContainerEnvs
) => {
  envs = envs || await loadEnvs({ env: params?.env })
  const token = params.token || await firebase.token(params, envs)
  const project = params.project || await firebase.project(params, envs)

  const {
    log,
    deployType,
    cmdOpts=noOpObj
  } = params

  const cmdArgs = [
    `deploy`,
    `--non-interactive`,
    `--token`,
    token,
    `--project`,
    project
  ]
  deployType && cmdArgs.push(`--only`, deployType)

  return await firebase(cmdArgs, {
    log,
    exec: true,
    cwd: frontendDir,
    ...cmdOpts,
    envs: {
      ...envs,
      ...cmdOpts?.envs,
      FIREBASE_TOKEN: token,
      FIREBASE_PROJECT_ID: project,
    },
  })
}) as TFBDeploy


;(firebase.deploy as TFBDeploy).hosting = (async (
  params:TTaskParams,
  envs?:TContainerEnvs
) => {
  return await firebase.deploy({
    ...params,
    deployType: `hosting`
  }, envs)
}) as TFBFunc