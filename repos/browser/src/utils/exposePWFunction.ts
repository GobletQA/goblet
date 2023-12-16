import type {
  TBrowserPage,
  TBrowserContext,
} from '@gobletqa/shared/types'

const isCtxParent = (parent:TBrowserPage|TBrowserContext):parent is TBrowserContext => {
  return (`__contextGoblet` in parent)
}

export const exposePWFunction = async (
  parent:TBrowserPage|TBrowserContext,
  name:string,
  method:(...args:any[]) => any
) => {
  try {

    const isContext = isCtxParent(parent)
    const cache = isContext ? parent.__contextGoblet : parent.__pageGoblet
    cache.initFuncs = cache.initFuncs || []

    const alreadyAdded = cache.initFuncs?.find?.((funcName:string) => name === funcName)
    if(alreadyAdded) return false

    await parent.exposeFunction(name, method)
    cache.initFuncs.push(name)

    return true
  }
  catch(err){
    !err.message.includes(`has been already registered`)
      && console.error(err)
  }
}