import fs from 'fs'
import path from 'path'
import { aliases } from '@GConfigs/aliases.config'

let _LOADED_SCRIPTS:Record<string, string>={}

// Scripts that are injected into the playwright browser

const loadBrowserScripts = () => {
  if(_LOADED_SCRIPTS) return _LOADED_SCRIPTS

  _LOADED_SCRIPTS = {
    mouseHelper: fs.readFileSync(
      path.join(aliases[`@GBR/scripts`], `playwright/mouseHelper.js`)
    ).toString(),

    record: fs.readFileSync(
      path.join(aliases[`@GBR/scripts`], `playwright/record.js`)
    ).toString(),

    selector: fs.readFileSync(
      path.join(aliases[`@GBR/scripts`], `playwright/selector.js`)
    ).toString(),

    mouseHover: fs.readFileSync(
      path.join(aliases[`@GBR/scripts`], `playwright/mouseHover.js`)
    ).toString(),
    
    polyfils: fs.readFileSync(
      path.join(aliases[`@GBR/scripts`], `playwright/polyfils.js`)
    ).toString(),
  }

  return _LOADED_SCRIPTS
}


export type TScriptsKey = keyof typeof _LOADED_SCRIPTS

/**
 * Helper to load the content of a script to inject into the webpage
 */
export const getInjectScript = (files:TScriptsKey[]) => {
  const scripts = loadBrowserScripts()

  return files.reduce((acc, file) => {
    acc.push(scripts[file])
    return acc
  }, []).join(`\n`)
}