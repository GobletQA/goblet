import type {
  TBrowserPage,
  TBrowserContext,
} from '@GSC/types'
import type { TScriptsKey } from './getInjectScript'

import { getInjectScript } from './getInjectScript'

export const addPWInitScripts = async (
  parent:TBrowserPage|TBrowserContext,
  scripts:string[],
) => {
  try {
    // @ts-ignore
    parent.__GobletInitScripts = parent.__GobletInitScripts || []
    // @ts-ignore
    const initScripts = parent.__GobletInitScripts

    const toAdd = scripts.filter(script => !initScripts.includes(script)) as TScriptsKey[]
    if(!toAdd.length) return false

    // @ts-ignore
    parent.__GobletInitScripts.push(...toAdd)
    await parent.addInitScript({ content: getInjectScript(toAdd) })

    return true
  }
  catch(err){
    console.log(err)
  }
}