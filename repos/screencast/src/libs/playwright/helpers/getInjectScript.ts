import fs from 'fs'
import path from 'path'
import { aliases } from '@GConfigs/aliases.config'

// Scripts that are injected into the playwright browser
const scripts = {

  mouseHelper: fs.readFileSync(
    path.join(aliases[`@GSC/Scripts`], `playwright/mouseHelper.js`)
  ).toString(),

  record: fs.readFileSync(
    path.join(aliases[`@GSC/Scripts`], `playwright/record.js`)
  ).toString(),

  selector: fs.readFileSync(
    path.join(aliases[`@GSC/Scripts`], `playwright/selector.js`)
  ).toString(),

  mouseHover: fs.readFileSync(
    path.join(aliases[`@GSC/Scripts`], `playwright/mouseHover.js`)
  ).toString(),
  
  polyfils: fs.readFileSync(
    path.join(aliases[`@GSC/Scripts`], `playwright/polyfils.js`)
  ).toString(),

}

export type TScriptsKey = keyof typeof scripts

/**
 * Helper to load the content of a script to inject into the webpage
 */
export const getInjectScript = (files:TScriptsKey[]) => {
  return files.reduce((acc, file) => {
    acc.push(scripts[file])
    return acc
  }, []).join(`\n`)
}