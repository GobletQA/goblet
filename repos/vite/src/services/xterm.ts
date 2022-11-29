import type { TTerminalLog, TXTerminal, TEventData } from '@types'
import type { IDisposable, ITerminalOptions } from 'xterm'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import LocalEchoController from 'local-echo'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { isObj, limbo, deepMerge, ensureArr } from '@keg-hub/jsutils'

const printable = (event:KeyboardEvent) => (
  !event.altKey
    && !event.ctrlKey
    && !event.metaKey
    && event.key !== `Enter`
    && event.key !== `Backspace`
)

const defTermOpts = {
  fontSize: 16,
  lineHeight: 1.2,
  scrollback: 1000000,
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
  xterm:Terminal
  fitAddon:FitAddon
  stdin:boolean=false
  promptText:string="❯ "
  dispose: IDisposable | false
  history:Record<number, TTerminalLog>={}
  localEcho:ReturnType<typeof LocalEchoController>

  constructor(config: TXTerminal){
    const {
      id,
      element,
      history,
      disabled,
      ...rest
    } = config

    this.id = id
    this.xterm = new Terminal(deepMerge(defTermOpts, rest))

    this.fitAddon = new FitAddon()
    this.xterm.loadAddon(this.fitAddon)
    this.xterm.loadAddon(new WebLinksAddon())

    this.localEcho = new LocalEchoController()

    this.xterm.loadAddon(this.localEcho)

    this.xterm.open(element)
    this.dispose = false
    this.resize()
    this.appendHistory(history)

    !disabled && this.readInput()
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
    this.dispose = this.xterm.onKey(this.onKey.bind(this))

    const [err, input] = await limbo(this.localEcho.read(this.promptText))
    await this.onInput(input)
    return this.readInput()
  }

  appendHistory = (history?:TTerminalLog|TTerminalLog[]) => {
    const toAdd = history && ensureArr(history)
    toAdd
      && toAdd.length
      && toAdd.forEach(log => {
          if(this.history[log.timestamp]) return

          this.xterm.write(log.text || log.message)
          this.history[log.timestamp] = log
      })
    this.xterm.scrollToBottom()
  }

  resize = () => {
    this.fitAddon.fit()
  }

  clear = () => {
    this.cmd = ``
    this.xterm.clear()
  }

  setOption = (name:keyof ITerminalOptions, value:any) => {
    this?.xterm?.options
      && (this.xterm.options = { [name]: value })
  }

  remove = () => {
    if(isObj<IDisposable>(this.dispose)) this.dispose.dispose()
    this?.xterm?.dispose?.()
  }

}