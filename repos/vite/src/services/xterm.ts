import type { IEvent, IDisposable } from 'xterm'

import { Terminal } from 'xterm'
import { isObj, limbo } from '@keg-hub/jsutils'
import { FitAddon } from 'xterm-addon-fit'
import LocalEchoController from 'local-echo'
import { WebLinksAddon } from 'xterm-addon-web-links'

export type TXTerminal = {
  stdin?: boolean
  logLevel?:string
  history?:string[]
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
  cmd: string =``
  fitAddon:FitAddon
  stdin:boolean=false
  promptText:string="$ "
  dispose: IDisposable | false
  localEcho:ReturnType<typeof LocalEchoController>

  constructor(config: TXTerminal){
    this.term = new Terminal({
      fontSize: 16,
      scrollback: 300,
      // logLevel: 'debug',
      convertEol: true,
      cursorBlink: true,
      cursorStyle: 'block',
      allowProposedApi: true,
      // Allow user input
      // disableStdin: false,
      disableStdin: this.stdin,
    })

    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.term.loadAddon(new WebLinksAddon())

    this.localEcho = new LocalEchoController()

    this.term.loadAddon(this.localEcho)

    this.term.open(config.element)
    this.dispose = false
    // this.clear()
    // this.listen()
    this.resize()
    this.readInput()
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
      console.log(this.term)
      
      this.term.write("\b \b")
    }
    else {
      if(!printable(domEvent)) return

      this.cmd += key
      this.term.write(key)
    }
  }

  private readInput = async ():Promise<void> => {
    const [err, input] = await limbo(this.localEcho.read(this.promptText))

    console.log(`------- handle input -------`)
    console.log(input)

    return this.readInput()
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