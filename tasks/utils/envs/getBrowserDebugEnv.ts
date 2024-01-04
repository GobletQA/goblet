import { TTaskParams } from '../../types/index'
import constants from '../../constants/index'
import { isStr } from '@keg-hub/jsutils'

const { PWDebug } = constants

export const getBrowserDebugEnv = (params:TTaskParams):false|string => {
  const { debugBrowser } = params
  const { options, channel } = PWDebug as Record<string, Record<string, string>>

  if(debugBrowser === true || !debugBrowser)
    return debugBrowser === true ? `pw:*` : debugBrowser ?? false

  else if(!isStr(debugBrowser)) return false
  else if(debugBrowser.includes(`pw:`) && debugBrowser.includes(`*`)) return debugBrowser

  let hasChannel:boolean=false
  const channelArr = []
  
  const cleaned = debugBrowser.split(`,`).reduce((acc, part) => {
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