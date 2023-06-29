import { ensureArr, noPropArr } from '@keg-hub/jsutils'
import { actionBrowser } from '@actions/screencast/api/actionBrowser'

type TResizeDims = {
  height: number
  width: number
}

export class PageService {

  action = async (act:string, props:any|any[], log?:boolean) => {
    return await actionBrowser({
      ref: `page`,
      actions: [{
        action: act,
        props: ensureArr(props),
      }],
    }, log)
  }

  reload = async (log?:boolean) => {
    return await this.action(`reload`, noPropArr, log)
  }

  resize = async (dims:TResizeDims) => {
    return await this.action(`setViewportSize`, [dims], true)
  }

  /**
   * Normalizes a url string to ensure it's consistent
   */
  normalize = (url:string) => {
    try {
      return new URL(this.ensureProtocol(url)).toString()
    }
    catch(err){
      console.log(err)
      return false
    }
  }

  /**
   * Playwright requires the protocol to exist on the url
   * This validates the url has a protocol on it
   * But doesn't care what that is
   * If none exist, it adds the current window.location.protocol
   */
  ensureProtocol = (url:string) => {
    return /^\w+:\/\//.test(url)
      ? url
      : `${window.location.protocol}//${url}`
  }

  /**
   * Tell the page to go backward
   */
  goBack = async (log?:boolean) => {
    return await this.action(`goBack`, noPropArr, log)
  }

  /**
   * Tell the page to go forward
   */
  goForward = async (log?:boolean) => {
    return await this.action(`goForward`, noPropArr, log)
  }

  /**
   * Tell playwright to navigate to a specific page
   */
  goto = async (url:string, log?:boolean) => {
    const normal = this.normalize(url)
    return normal && await this.action(`goto`, normal, log)
  }
}


export const pageService = new PageService()