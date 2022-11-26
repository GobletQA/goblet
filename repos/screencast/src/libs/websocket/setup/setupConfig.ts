import type {
  TSocketConfig,
  TSocketConfigOpts,
  ESocketEnvironment,
} from '@GSC/types'

import {
  get,
  set,
  deepMerge,
  reduceObj,
  uuid,
} from '@keg-hub/jsutils'

const NODE_ENV = (process.env.NODE_ENV || 'local') as ESocketEnvironment
const defServerConfig:Partial<TSocketConfigOpts> = {
  process: {},
  groups: {
    default: {
      filters: {},
      commands: {}
    },
  }
}

const buildConfig = (
  serverConfig:TSocketConfigOpts,
  group:string,
  env:ESocketEnvironment
) => {
  const addDefConfig = Boolean(!serverConfig)
  // Extract the groups from the def config, so we don't add the example commands
  const { groups: defGroups, ...socketConf } = defServerConfig

  const {
    host,
    port,
    groups,
    path: socketPath,
    ...config
  } = deepMerge(
    addDefConfig ? defServerConfig : socketConf,
    serverConfig
  )

  // Get the commands by group separated by environment
  const { development, production, ...other } = deepMerge(
    get(groups, `default.commands`),
    get(groups, `${group}.commands`)
  )

  // If in production, only use the production commands
  // Otherwise use them all, with priority to development commands
  const activeCommands =
    NODE_ENV === 'production'
      ? production
      : deepMerge(other, production, development)

  const filters = deepMerge(
    get(groups, `default.filters`),
    get(groups, `${group}.filters`)
  )

  const builtCmds = reduceObj(
    activeCommands,
    (command, definition, groups) => {
      definition.id = uuid()
      definition.name = definition.name || command
      definition.group = definition.group || group

      set(groups, [ definition.group, command ], definition)

      return groups
    },
    {}
  )

  return {
    ...config,
    process: config.process,
    socket: {
      port,
      host,
      path: socketPath,
    },
    filters,
    commands: builtCmds,
  } as TSocketConfig
}

export const setupConfig = async (
  config:TSocketConfigOpts,
  cmdGroup:string,
  env:ESocketEnvironment=NODE_ENV
) => {
  const built = buildConfig(config, cmdGroup, env)
  return built
}

