import type {TPWConsoleMsgEvt, TSocketEvt} from "@types"
import {WSPwConsole} from "@constants/websocket"


export const parsePlayLogs = (message:TSocketEvt<TPWConsoleMsgEvt>) => {
  if(!message.data) return

  const {
    type,
    text,
  } = message.data

  const args = text.split(`\n${WSPwConsole}\n`)
    .reduce((acc, arg) => {
      try {acc.push(JSON.parse(arg))}
      catch(err){acc.push(arg)}

      return acc
    }, [] as any[])

  const method = (console[type as keyof Console] || console.log) as ((...args:any[]) => void)
  method?.call?.(console, `[Goblet BinB]\n`, ...args)
}
