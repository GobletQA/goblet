import { TConductorConfig } from '../types'
const { HOSTNAME, GB_CD_HOST } = process.env

export const getDomain = (config:TConductorConfig) => {
  return config?.server?.host
    || config?.proxy?.host
    || HOSTNAME
    || GB_CD_HOST
}