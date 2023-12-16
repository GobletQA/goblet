import type {
  TBrowserPage,
  TBrowserContext,
} from '@gobletqa/shared/types'

import type { TScriptsKey } from './getInjectScript'

import { getInjectScript } from './getInjectScript'

const isCtxParent = (parent:TBrowserPage|TBrowserContext):parent is TBrowserContext => {
  return (`__contextGoblet` in parent)
}


export const addPWInitScripts = async (
  parent:TBrowserPage|TBrowserContext,
  scripts:string[],
) => {
  try {

    const isContext = isCtxParent(parent)
    const cache = isContext ? parent.__contextGoblet : parent.__pageGoblet
    cache.initScript = cache.initScript || []

    const toAdd = scripts.filter(script => !cache.initScript.includes(script)) as TScriptsKey[]
    if(!toAdd.length) return false

    cache.initScript.push(...toAdd)
    await parent.addInitScript({ content: getInjectScript(toAdd) })

    return true
  }
  catch(err){
    console.log(err)
  }
}