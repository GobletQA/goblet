
import { useCallback } from 'react'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { actionBrowser } from '@actions/screencast/api/actionBrowser'

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
export const useLoadRepoUrl = (repo?:any) => {

  return useCallback(() => {
    const appUrl = getWorldVal({
      location: `url`,
      fallback: `app.url`,
      repo
    })

    return appUrl
      && actionBrowser({
        ref: 'page',
        actions: [{
          action: 'goto',
          // props: [appUrl],
          props: [`http://www.gobletqa.com`],
        }],
      }, false)
    
  }, [repo])
  
}