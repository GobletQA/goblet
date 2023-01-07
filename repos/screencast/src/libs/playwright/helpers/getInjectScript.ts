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

}

/**
 * Helper to load the content of a script to inject into the webpage
 */
export const getInjectScript = (files:string[]) => {
  return files.reduce((acc, file) => {
    acc.push(scripts[file])
    return acc
  }, []).join(`\n`)
}