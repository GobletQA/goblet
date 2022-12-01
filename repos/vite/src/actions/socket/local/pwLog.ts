import type { TSocketEvt } from '@types'
import { terminalDispatch } from '@store'
import { BrowserLogTerminal } from '@constants'

const jsonPrefix = [
  `SEND ► {`,
  `◀ RECV {`
] 
const filterLogs = (event:TSocketEvt) => {
  if(!event?.message || !event?.message?.includes(`pw:`)) return false
  
  const { message } = event
  const found = jsonPrefix.find(prefix => message.includes(prefix))

  return !found

  // jsonPrefix.map(prefix => {
    
  //   if(!message.includes(prefix)) return
    
  //   const jsonStr = message.split(prefix).pop()
  //   if(!jsonStr) return
    
  //   try {
  //     const jsonObj = JSON.parse(`{${jsonStr}`)
  //     console.log(jsonObj)
  //   }
  //   catch(err){}
  // })
  
}


export const pwLog = (event:TSocketEvt) => {
  const filtered = filterLogs(event)
  if(!filtered) return

  const { id, timestamp, message } = event

  const date = new Date(timestamp)
  const time = date.toLocaleTimeString(`en-US`)
  const cleaned = message.slice(message.indexOf(`pw:`)).trim().replace(/\r/g, '\n\r')
  const log = `[${time}] ❯ ${cleaned}\r\n`

  terminalDispatch.appendHistoryByRef({
    name: BrowserLogTerminal,
    history: {
      id,
      timestamp,
      message: log,
    }
  })
}