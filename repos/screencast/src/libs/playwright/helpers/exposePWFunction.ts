import type {
  TBrowserPage,
  TBrowserContext,
} from '@GSC/types'

export const exposePWFunction = async (
  parent:TBrowserPage|TBrowserContext,
  name:string,
  method:(...args:any[]) => any
) => {
  try { await parent.exposeFunction(name, method) }
  catch(err){
    !err.message.includes(`has been already registered`)
      && console.error(err)
  }
}