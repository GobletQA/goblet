import type { TSocketEvt } from '@types'
import { terminalDispatch } from '@store'
import { BrowserLogTerminal } from '@constants'

export const pwLog = (event:TSocketEvt) => {
  if(!event?.message || !event?.message?.includes(`pw:`)) return

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