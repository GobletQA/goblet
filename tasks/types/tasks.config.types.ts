export type TTCEnvMap = {
  [k: string]: string[]
} 

export type TTCEnvironment = {
  options: string[],
  map: TTCEnvMap
}
export type TTCDefaultArgs = {
  env: {
    alias: string[]
    default: string
    example: string
    description: string
  }
  devspace: {
    alias: string[]
    default: string
    example: string
    description: string
  }
}

export type TTCSettings = {
  defaultEnv: string
  task: Record<string, any>
}

export type TTCDomain = {
  host: string
}

export type TTCDomains = {
  local: TTCDomain
  default: TTCDomain
}

export type TTCAppEnv = {
  omit?: string[]
  pick?: string[]
  values?: Record<string, string|number>
}

export type TTCAppSync = {
  localSubPath: string
  initialSync: string
  containerPath: string
  excludePaths: string[]
  disableDownload: boolean
}

export type TTCAppPortForward = {
  ports:string[]
}

export type TTCApp = {
  prefix: string
  envs?: TTCAppEnv
  sync?: TTCAppSync
  contexts: string[]
  servicePrefix:string
  portForward?:TTCAppPortForward
}

export type TTCDApp = Omit<TTCApp, `contexts`>

export type TTCApps = Record<string, TTCApp> & {
  default?: TTCDApp
}

export type TTaskConfig = {
  apps: TTCApps
  domains: TTCDomains
  settings: TTCSettings
  environment: TTCEnvironment
  defaultArgs: TTCDefaultArgs
}
