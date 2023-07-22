import type {
  TDomScripts,
  TDomScriptOptions
} from '@gobletqa/exam'

import {emptyObj} from '@keg-hub/jsutils'
import { RunnerErr } from '@gobletqa/exam'
import { MethodContentSplit } from '@GSC/constants'
import mouseTracking from './scripts/mouseTracking'


export type TDomScriptName = `mouseTracking`|string

/**
 * Formats the script by getting it's string content
 * Then rewrapping the content in a named function
 */
const convertScript = (name:TDomScriptName, method:() => any) => {
  const methodStr = method.toString()
  const [start, content=``, end] = methodStr.split(MethodContentSplit)

  return `const ${name} = async () => {\n${content}\n}\n${name}()\n`
}

export class DomScripts {
  
  scripts:TDomScripts = {
    mouseTracking: convertScript(`mouseTracking`, mouseTracking)
  }

  constructor(options:TDomScriptOptions=emptyObj){
    const { scripts } = options
    Object.entries(scripts).forEach(([name, method]) => this.convert(name, method))
  }
  
  /**
   * Helper method to load scripts into the DOM
   * Then splits the script on the const MethodContentSplit and rebuilds the method
   * This allows writing the scripts in typescript, but still using them in the DOM as JS
   */
  get = (name:TDomScriptName) => {
    if(!this.scripts[name]) throw new RunnerErr(`Unknown dom script named ${name}`)
    
    return this.scripts[name]
  }
  
  /**
   * Formats the script by getting it's string content
   * Then rewrapping the content in a named function
   */
  convert = (name:TDomScriptName, method:() => any) => {
    this.scripts[name] = convertScript(name, method)

    return this.scripts[name]
  }

  /**
   * Clears all loaded scripts except the mouseTracking script
   */
  clear = () => {
    this.scripts = {
      mouseTracking: this.scripts.mouseTracking
    }
  }
  
}