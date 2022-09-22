import { Terminal } from 'xterm'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { FitAddon } from 'xterm-addon-fit'

export type TXTerminal = {
  element: HTMLElement
}


export class XTerminal {
  
  term:Terminal
  
  constructor(config: TXTerminal){
    this.term = new Terminal()
    this.term.open(config.element)
  }

  

}