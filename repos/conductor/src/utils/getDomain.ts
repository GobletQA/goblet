import { TConductorConfig } from '@gobletqa/conductor/types'
const { HOSTNAME, GB_CD_HOST } = process.env

// TODO: fix this? What is host name when in backend, the same?
export const getDomain = (config:TConductorConfig) => {
  return  GB_CD_HOST || HOSTNAME
}