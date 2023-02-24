import { GSCRoot } from '../resolveRoot'
import { esbuild } from '@ltipton/esdev'
import { aliases } from '@GConfigs/aliases.config'
import { loadConfigs } from '@keg-hub/parse-config'

/**
 * Load the ENVs from <node-env>.env ( local.env || prod.env )
 */
const envs = loadConfigs({
  noYml: true,
  name: `goblet`,
  locations: [aliases.GobletRoot],
  envs: { GOBLET_ROOT_DIR: aliases.GobletRoot },
})

export type TSCesbuild = {
  dev:boolean
  outFile:string
  entryFile:string
}

export const ESBuild = (args:TSCesbuild) => {
  return esbuild({
    aliases,
    cwd: GSCRoot,
    mergeEnvs:true,
    sourcemap: 'inline',
    envs: {
      ...envs,
      GOBLET_ROOT_DIR: aliases.GobletRoot
    },
    ...args
  })
}

