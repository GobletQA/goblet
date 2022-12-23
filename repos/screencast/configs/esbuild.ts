import type { ChildProcess } from 'child_process'
import type {
  Plugin,
  PluginBuild,
  BuildResult,
  BuildOptions,
  BuildFailure,
} from 'esbuild'

require('../resolveRoot')

import path from 'path'
import { build } from 'esbuild'
import { spawn } from 'child_process'
import { loadConfigs } from '@keg-hub/parse-config'
import aliasPlugin from 'esbuild-plugin-path-alias'
import {
  isArr,
  toBool,
  exists,
  noOpObj,
  noOpArr,
  eitherObj,
  eitherArr,
  flatUnion,
} from '@keg-hub/jsutils'

export type TDevServer = (() => void) & {
  server?: ChildProcess
}

export type TEnvOpts = {
  env?:string
  name?: string,
  load?:boolean
  merge?:boolean
  noYml?: boolean
  locations?: string[],
  envs?:Record<string, string|number|boolean>
}

export type TNMOpts = {
  args?:string[]
  merge?:boolean
}

export type TESBuildConf = BuildOptions & {
  cwd:string
  dev?:boolean
  outFile:string
  args?:string[]
  envOpts?:TEnvOpts
  entryFile?:string
  plugins?: Plugin[]
  nodemonOpts?:TNMOpts
  entryPoints?:string[]
  aliases?:Record<string, string>
  onRebuild?:(error:BuildFailure, result:BuildResult) => void
}

const nodeEnv = process.env.NODE_ENV || `local`
const isDev = [`1`, 1, `true`, `T`, `yes`].includes(process.env.DEV_BUILD)

const getEnvs = (envOpts:TEnvOpts) => {
  const {
    env,
    envs,
    load=true,
    merge=true,
    ...rest
  } = envOpts
  
  const envObj =  eitherObj(envs, noOpObj)
  if(!merge && !load) return envObj

  const loaded = load
    ? loadConfigs({ ...rest, env: env || nodeEnv })
    : noOpObj

  return {
    ...loaded,
    ...(merge ? process.env : noOpObj),
    ...envObj,
  }
}

const nodemonDefArgs = (cwd:string) => ([
  `--ext`,
  `none`,
  `--watch`,
  `""`,
  `--verbose`,
  `--ignore`,
  path.join(cwd, `../../`),
  `--no-update-notifier`,
  `--polling-interval`,
  `0`,
])

const getArgs = (
  cwd:string,
  nodemonOpts?:TNMOpts,
  nmArgs?:string[],
) => {
  const { merge, args } = nodemonOpts

  const mergeArgs = isArr(nmArgs)
    ? flatUnion(nmArgs, args)
    : isArr(args) && args

  return merge
    ? flatUnion<string>(nodemonDefArgs(cwd), mergeArgs)
    : eitherArr<string[]>(mergeArgs, nodemonDefArgs(cwd))
}

/**
 * Helper to start the dev server after bundling the app
 */
const buildDevServer = (config:TESBuildConf, noDevServer:boolean) => {
  const { cwd, envOpts, args, nodemonOpts } = config

  const envs = getEnvs(eitherObj<TEnvOpts,TEnvOpts>(envOpts, noOpObj))
  const nmArgs = getArgs(cwd, eitherObj<TNMOpts,TNMOpts>(nodemonOpts, noOpObj), args)

  const devServer = (async () => {
    if (noDevServer) return

    // @ts-ignore
    devServer.server = spawn('nodemon', nmArgs, {
      cwd,
      env: envs,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    })

    devServer.server.stdout.on('data', (data:string) => process.stdout.write(data))
    devServer.server.stderr.on('data', (data:string) => process.stderr.write(data))
    process.on(`exit`, () => (
      devServer.server
        && devServer.server.pid
        && process.kill(devServer.server.pid)
    ))
  }) as TDevServer

  return devServer
}

/**
* Calls esbuild.build API, then starts a dev server when configured
* Uses nodemon to reload the server
*/
export const esbuild = async (config:TESBuildConf) => {
  const {
    cwd,
    dev,
    args,
    plugins,
    aliases,
    envOpts,
    outFile,
    entryFile,
    onRebuild,
    nodemonOpts,
    entryPoints,
    ...rest
  } = config

  const configDev = exists(dev) ? toBool(dev) : false
  const noDevServer = !isDev && !configDev
  const devServer = buildDevServer(config, noDevServer)

  const inputFiles = eitherArr(entryPoints, [])
  !inputFiles.includes(entryFile) && inputFiles.push(entryFile)

  /**
  * Build the code, then run the devServer
  * ESBuild config object
  * [See here for more info](https://esbuild.github.io/api/#build-api)
  */
  return await build({
    outfile: outFile,
    bundle: true,
    minify: false,
    sourcemap: true,
    target: 'es2020',
    platform: 'node',
    assetNames: '[name]',
    allowOverwrite: true,
    entryPoints: inputFiles,
    ...rest,
    watch: !noDevServer && {
      onRebuild(error:BuildFailure, result:BuildResult) {
        if (error) console.error(`Error rebuilding app`, error)
        else console.log(`Rebuilt app successfully`, result)

        onRebuild?.(error, result)
        devServer.server && devServer.server.send('restart')
      },
    },
    plugins: [
      ...(eitherArr(aliases && [aliasPlugin(aliases)], noOpArr)),
      /**
      * Custom plugin to filter out node_modules
      * See more info [here](https://github.com/evanw/esbuild/issues/619#issuecomment-751995294)
      */
      {
        name: 'external-node-modules',
        setup(build:PluginBuild) {
          // Must not start with "/" or "./" or "../" which means it's a node_modules
          // eslint-disable-next-line no-useless-escape
          const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/
          build.onResolve({ filter }, (args) => ({
            external: true,
            path: args.path,
          }))
        },
      },
      ...(eitherArr(plugins, noOpArr))
    ],
    
  }).then(devServer)

}
