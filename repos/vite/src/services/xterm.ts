import type { TXTerminal, TEventData } from '@types'
import type { IDisposable } from 'xterm'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import LocalEchoController from 'local-echo'
import { isObj, limbo, deepMerge } from '@keg-hub/jsutils'
import { WebLinksAddon } from 'xterm-addon-web-links'

const printable = (event:KeyboardEvent) => (
  !event.altKey
    && !event.ctrlKey
    && !event.metaKey
    && event.key !== `Enter`
    && event.key !== `Backspace`
)

const setHistory = (term:Terminal, history?:string[]) => {
  history
    && history.length
    && history.forEach(line => term.write(line))

  term.scrollToBottom()
}

const defTermOpts = {
  fontSize: 16,
  scrollback: 300,
  convertEol: true,
  cursorBlink: true,
  logLevel: `error`,
  disableStdin: false,
  cursorStyle: 'block',
  allowProposedApi: true,
  screenReaderMode: true,
  // TODO: check if on windows on set based on that
  windowsMode: false,
  // TODO: check if on mac on set based on that
  macOptionIsMeta: true,
}


export class XTerminal {

  id:string
  cmd:string=``
  term:Terminal
  fitAddon:FitAddon
  stdin:boolean=false
  promptText:string="❯ "
  dispose: IDisposable | false
  localEcho:ReturnType<typeof LocalEchoController>

  constructor(config: TXTerminal){
    const {
      id,
      element,
      history,
      ...rest
    } = config
    
    this.id = id
    
    this.term = new Terminal(deepMerge(defTermOpts, rest))

    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.term.loadAddon(new WebLinksAddon())

    this.localEcho = new LocalEchoController()

    this.term.loadAddon(this.localEcho)

    this.term.open(element)
    this.dispose = false
    this.resize()
    setHistory(this.term, history)
    this.readInput()
  }

  private onKey = (data:TEventData) => {
    const { key, domEvent } = data
    printable(domEvent)
      && (this.cmd += key)
  }

  private onInput = async (input:string) => {
    try {
      switch(input){
        case `clear`: {
          this.clear()
          break
        }
        default: {
          console.log(`------- input -------`)
          console.log(input)
          break
        }
      }
    }
    catch(err:any){

    }
    finally {
      // Ensure the cmd is cleared and history is updated even if an error is throw
      this.cmd = ``
    }
  }

  private readInput = async ():Promise<void> => {
    if(isObj<IDisposable>(this.dispose)) this.dispose.dispose()
    this.dispose = this.term.onKey(this.onKey.bind(this))

    const [err, input] = await limbo(this.localEcho.read(this.promptText))
    await this.onInput(input)
    return this.readInput()
  }

  resize = () => {
    this.fitAddon.fit()
  }

  clear = () => {
    this.cmd = ``
    this.term.clear()
  }

  remove = () => {
    if(isObj<IDisposable>(this.dispose)) this.dispose.dispose()
    this?.term?.dispose?.()
  }

}