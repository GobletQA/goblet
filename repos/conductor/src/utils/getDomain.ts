import { DEF_HOST_IP } from '../constants'
import { TConductorConfig } from '../types'

export const getDomain = (config:TConductorConfig) => {
  return config?.server?.host
    || config?.proxy?.host
    || DEF_HOST_IP
}