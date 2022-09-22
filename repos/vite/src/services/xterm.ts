import type { IEvent, IDisposable } from 'xterm'

import { Terminal } from 'xterm'
import { isObj } from '@keg-hub/jsutils'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

export type TXTerminal = {
  element: HTMLElement
}

export type TEventData = {
  key: string,
  domEvent: KeyboardEvent
}

const printable = (event:KeyboardEvent) => (
  !event.altKey && !event.ctrlKey && !event.metaKey
)

export class XTerminal {

  term:Terminal
  fitAddon:FitAddon
  dispose: IDisposable | false
  cmd: string =``

  constructor(config: TXTerminal){
    this.term = new Terminal({
      convertEol: true,
      fontSize: 16,
      allowProposedApi: true,
      cursorBlink: true,
      cursorStyle: 'block',
      disableStdin: false,
      logLevel: 'debug',
      scrollback: 300,
    })
    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.term.loadAddon(new WebLinksAddon())
    this.term.open(config.element)
    this.dispose = false
    this.clear()
    this.listen()
    this.resize()
  }

  private onKey = (data:TEventData) => {
    const { key, domEvent } = data

    if(domEvent.key === `Enter`){
      if(this.cmd === 'clear')
        this.clear()
      else {
        this.cmd = ``
        this.term.write('\r\n $ ')
      }
      return
    }
    else if(domEvent.key === `Backspace`){
      this.term.write("\b \b")
    }
    else {
      if(!printable(domEvent)) return

      this.cmd += key
      this.term.write(key)
    }
  }

  private listen = () => {
    if(isObj<IDisposable>(this.dispose)) this.dispose.dispose()
    this.dispose = this.term.onKey(this.onKey.bind(this))
  }

  resize = () => {
    this.fitAddon.fit()
  }

  clear = () => {
    this.cmd = ``
    this.term.write('\r\n $ ')
    this.term.clear()
  }

}