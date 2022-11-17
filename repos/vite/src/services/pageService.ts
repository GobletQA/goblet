import { ensureArr, noPropArr } from '@keg-hub/jsutils'
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
    return await this.action(`goto`, url, log)
  }
  
}


export const pageService = new PageService()