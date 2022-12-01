import { TTaskParams } from '../../types'
import constants from '../../constants'
import { isStr } from '@keg-hub/jsutils'

const { PWDebug } = constants

export const getDebugEnv = (params:TTaskParams):false|string => {
  const { debug } = params
  const { options, channel } = PWDebug as Record<string, Record<string, string>>

  if(debug === true || !debug)
    return debug === true ? `pw:*` : debug ?? false
  else if(!isStr(debug)) return false
  else if(debug.includes(`pw:`) && debug.includes(`*`)) return debug

  let hasChannel:boolean=false
  const channelArr = []
  
  const cleaned = debug.split(`,`).reduce((acc, part) => {
    const type = part.includes(`pw:`)
      ? part.split(`pw:`).pop().trim()
      : part.trim()

    if(type === options.channel) hasChannel = true

    channel[type] && channelArr.push(`pw:channel:${part}`)
    options[type] && acc.push(`pw:${part}*`)

    return acc
  }, [])

  return hasChannel
    ? cleaned.concat(channelArr).join(`,`)
    : cleaned.join(`,`)
}