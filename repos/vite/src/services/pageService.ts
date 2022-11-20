import { ensureArr, noPropArr, isUrl } from '@keg-hub/jsutils'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { actionBrowser } from '@actions/screencast/api/actionBrowser'

export class PageService {

  action = async (act:string, props:string|string[], log?:boolean) => {
    return await actionBrowser({
      ref: 'page',
      actions: [{
        action: act,
        props: ensureArr(props),
      }],
    }, log)
  }

  reload = async (log?:boolean) => {
    return await this.action(`reload`, noPropArr, log)
  }

  goto = async (url:string, log?:boolean) => {
    // Playwright force the protocol to exist on the url
    // This validates the url has a protocol on it
    // But doesn't care what that is
    // If none exist, it adds the current window.location.protocol
    const withProto = /^\w+:\/\//.test(url)
      ? url
      : `${window.location.protocol}//${url}`

    return await this.action(`goto`, new URL(withProto).toString(), log)
  }
  
}


export const pageService = new PageService()